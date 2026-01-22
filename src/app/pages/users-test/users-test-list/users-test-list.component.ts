import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { UserProfileService } from '../../../../app/core/services/user.service';
import * as proj4 from 'proj4';

@Component({
  selector: 'app-users-test-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users-test-list.component.html',
  styleUrl: './users-test-list.component.scss'
})
export class UsersTestListComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: true })
  mapContainer!: ElementRef<HTMLDivElement>;

  map!: L.Map;
  selectedLayer: L.Path | null = null;

  // =========================
  // ✅ INDICATEURS (STATE)
  // =========================
  indicateursDemo = {
    population: 0,
    hommes: 0,
    femmes: 0,
    marocains: 0,
    etrangers: 0,
    menages: 0
  };

  // ✅ TERRITOIRE (NEW IMAGE)
  indicateursTerritoire = {
    superficieKm2: 0,
    communesTerritoriales: 0,
    grandMassifPct: 0,
    plaineSoussPct: 0,
    littoralKm: 0
  };

  // 👉 Santé
  santeLayer = L.layerGroup();
  santeVisible = false;

  // 👉 Education
  educationLayer = L.layerGroup();
  educationVisible = false;

  // 👉 Eau potable
  eauPotableLayer = L.layerGroup();
  eauPotableVisible = false;

  // 👉 Emploi
  emploiLayer = L.layerGroup();
  emploiVisible = false;

  // 👉 Mise à niveau
  miseLayer = L.layerGroup();
  miseVisible = false;

  constructor(private router: Router, private mapService: UserProfileService) {}

  /* =========================
     ICONS
  ========================= */
  chrIcon = L.icon({
    iconUrl: 'assets/icons/hopitaux2.png',
   iconSize: [45, 45],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28]
  });

  hopitauxExistantsIcon = L.icon({
    iconUrl: 'assets/icons/hopitaux2.png',
 iconSize: [45, 45],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28]
  });

  educationIcon = L.icon({
    iconUrl: 'assets/icons/educationIcon.png',
  iconSize: [45, 45],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28]
  });

  eauIcon = L.icon({
    iconUrl: 'assets/icons/water_drop1.png',
    iconSize: [50, 50],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28]
  });

  emploiIcon = L.icon({
    iconUrl: 'assets/icons/emploi2.png',
   iconSize: [45, 45],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28]
  });

  miseIcon = L.icon({
    iconUrl: 'assets/icons/way.png',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28]
  });

  // =========================
  // ✅ SAFE HELPERS
  // =========================
  private n(v: any): number {
    const x = Number(v);
    return Number.isFinite(x) ? x : 0;
  }

  private pick(p: any, keys: string[]): any {
    for (const k of keys) {
      if (p && p[k] !== undefined && p[k] !== null && p[k] !== '') return p[k];
    }
    return undefined;
  }

  // ✅ Proj definition (ton GeoJSON eau est en ESRI:102193 → coords en mètres)
// ✅ ESRI:102193 (Sahara_Degree) — le vrai proj4
private readonly CRS_102193 =
  '+proj=lcc +lat_1=26.1 +lat_0=26.1 +lon_0=-5.4 +k_0=0.9996 +x_0=1200000 +y_0=400000 +ellps=clrk80ign +units=m +no_defs';


  // ✅ Convert projected coords → lat/lng (Leaflet)
  private projectedToLatLng = (coords: any): L.LatLng => {
    const [x, y] = coords;

    // proj4 import en Angular moderne → fonction accessible via default
    const fn = (proj4 as any).default ?? (proj4 as any);

    const res = fn(this.CRS_102193, 'WGS84', [x, y]) as [number, number];
    const lng = res[0];
    const lat = res[1];

    return L.latLng(lat, lng);
  };

  // =========================
  // ✅ MAIN
  // =========================
  ngAfterViewInit(): void {
    /* =========================
       1️⃣ INIT MAP
    ========================= */
    this.map = L.map(this.mapContainer.nativeElement, {
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap & CartoDB'
    }).addTo(this.map);

    /* =========================
       2️⃣ LOAD COMMUNES
    ========================= */
    this.mapService.getCommunes().subscribe((data: GeoJSON.FeatureCollection) => {
      // ✅ reset
      this.resetIndicators();

      // ✅ communes territoriales = nombre de features
      this.indicateursTerritoire.communesTerritoriales = data.features.length;

      let foundMassif = false;
      let foundPlaine = false;

      data.features.forEach((feature: any) => {
        const p = feature.properties || {};

        // ✅ DEMO (sum)
        this.indicateursDemo.population += this.n(p.Population);
        this.indicateursDemo.hommes += this.n(p.Hommes);
        this.indicateursDemo.femmes += this.n(p.Femmes);
        this.indicateursDemo.marocains += this.n(p.Marocains);
        this.indicateursDemo.etrangers += this.n(p.Etrangers);
        this.indicateursDemo.menages += this.n(p.Nb_Menages);

        // ✅ TERRITOIRE (sum / pick)
        const sup = this.pick(p, ['Superficie', 'superficie', 'Area_km2', 'area_km2', 'SUP_KM2']);
        this.indicateursTerritoire.superficieKm2 += this.n(sup);

        const lit = this.pick(p, ['Littoral_km', 'littoral_km', 'LITTORAL_KM', 'longueur_littoral', 'LITTORAL']);
        this.indicateursTerritoire.littoralKm += this.n(lit);

        if (!foundMassif) {
          const massif = this.pick(p, ['Grand_massif_pct', 'grandMassifPct', 'GRAND_MASSIF_PCT', 'GRAND_MASSIF']);
          const mv = this.n(massif);
          if (mv > 0) {
            this.indicateursTerritoire.grandMassifPct = mv;
            foundMassif = true;
          }
        }

        if (!foundPlaine) {
          const plaine = this.pick(p, ['Plaine_souss_pct', 'plaineSoussPct', 'PLAINE_SOUS_PCT', 'PLAINE_SOUS']);
          const pv = this.n(plaine);
          if (pv > 0) {
            this.indicateursTerritoire.plaineSoussPct = pv;
            foundPlaine = true;
          }
        }
      });

      const communesLayer = L.geoJSON(data, {
        style: (feature: any) => ({
          color: '#888',
          weight: 1,
          fillColor: this.getCommuneColor(feature.properties.id_objet),
          fillOpacity: 0.55
        }),

        onEachFeature: (feature: any, layer: L.Layer) => {
          const polygon = layer as L.Path;

          const bounds = (polygon as any).getBounds();
          const area = bounds.getNorthEast().distanceTo(bounds.getSouthWest());

          if (area > 15000) {
            L.tooltip({
              permanent: true,
              direction: 'center',
              className: 'commune-label'
            })
              .setContent(feature.properties.COMMUNE)
              .setLatLng(bounds.getCenter())
              .addTo(this.map);
          }

          polygon.on('mouseover', () => {
            if (this.selectedLayer) {
              this.selectedLayer.setStyle({
                color: '#888',
                weight: 1,
                fillOpacity: 0.55
              });
            }

            polygon.setStyle({
              color: '#1565c0',
              weight: 3,
              fillOpacity: 0.85
            });

            this.selectedLayer = polygon;
          });

          polygon.on('mouseout', () => this.map.closePopup());

          const routes: Record<string, string> = {
            DCHEIRA: '/dcheira',
            BOUKRAA: '/boucraa',
            'FOUM EL OUED': '/foumelouad',
            LAAYOUNE: '/laayoune',
            'EL MARSA': '/elmarsa'
          };

          polygon.on('click', () => {
            const key = feature.properties.COMMUNE?.toUpperCase().trim();
            if (routes[key]) this.router.navigate([routes[key]]);
          });
        }
      }).addTo(this.map);

      /* =========================
         3️⃣ SANTÉ (HIDDEN)
      ========================= */
      this.mapService.getCHRs().subscribe((chrs) => {
        L.geoJSON(chrs, {
          pointToLayer: (_feature, latlng) => L.marker(latlng, { icon: this.hopitauxExistantsIcon }),
          onEachFeature: (feature, layer) => {
            layer.bindPopup(`<b>CHR</b><br>${(feature.properties as any)?.nom || ''}`);
          }
        }).addTo(this.santeLayer);
      });

      this.mapService.getSanteExistants().subscribe((cs) => {
        L.geoJSON(cs, {
          pointToLayer: (_feature, latlng) => L.marker(latlng, { icon: this.chrIcon }),
          onEachFeature: (feature, layer) => {
            layer.bindPopup(`<b>Centre de santé</b><br>${(feature.properties as any)?.nom || ''}`);
          }
        }).addTo(this.santeLayer);
      });

      /* =========================
         3️⃣bis EDUCATION (HIDDEN)
      ========================= */
      const addEducation = (fc: GeoJSON.FeatureCollection, label: string) => {
        L.geoJSON(fc, {
          pointToLayer: (_feature, latlng) => L.marker(latlng, { icon: this.educationIcon }),
          onEachFeature: (feature, layer) => {
            const nom = (feature.properties as any)?.nom || (feature.properties as any)?.name || '';
            layer.bindPopup(`<b>${label}</b><br>${nom}`);
          }
        }).addTo(this.educationLayer);
      };

      this.mapService.getEducationExistants1().subscribe((fc) => addEducation(fc, 'Education 1'));
      this.mapService.getEducationExistants2().subscribe((fc) => addEducation(fc, 'Education 2'));
      this.mapService.getEducationExistants3().subscribe((fc) => addEducation(fc, 'Education 3'));
      this.mapService.getEducationExistants4().subscribe((fc) => addEducation(fc, 'Education 4'));

      /* =========================
         3️⃣ter EAU POTABLE (HIDDEN)
      ========================= */
    /* =========================
   3️⃣ter EAU POTABLE (POINT – ESRI:102193)
========================= */
/* =========================
   3️⃣ter EAU POTABLE (POINT – ESRI:102193)
========================= */
const addEau = (fc: GeoJSON.FeatureCollection, label: string) => {
  L.geoJSON(fc, {
    pointToLayer: (feature, _latlng) => {
      const coords = (feature.geometry as any).coordinates; // [x,y] en mètres

      const fn = (proj4 as any).default ?? (proj4 as any);
      const [lng, lat] = fn(this.CRS_102193, 'WGS84', coords); // -> [lon,lat]

      // ✅ Debug (optionnel) : vérifie dans console
      // console.log('EAU:', coords, '=>', lat, lng);

      return L.marker([lat, lng], { icon: this.eauIcon });
    },

    onEachFeature: (feature, layer) => {
      const p = feature.properties as any;
      layer.bindPopup(`
        <b>${label}</b><br/>
        <strong>Projet :</strong> ${p?.Projet || ''}<br/>
        <strong>Commune :</strong> ${p?.Commune || ''}
      `);
    }
  }).addTo(this.eauPotableLayer);
};

this.mapService.getEauPotable().subscribe((fc) => {
  addEau(fc, 'Eau potable');

  // ✅ Pour tester immédiatement (sans cliquer sur le bouton)
  // Décommente si tu veux voir direct
  // this.eauPotableLayer.addTo(this.map);
  // this.eauPotableVisible = true;
});


      /* =========================
         3️⃣quater EMPLOI (HIDDEN)
      ========================= */
      const addEmploi = (fc: GeoJSON.FeatureCollection, label: string) => {
        L.geoJSON(fc, {
          pointToLayer: (_feature, latlng) => L.marker(latlng, { icon: this.emploiIcon }),
          onEachFeature: (feature, layer) => {
            const nom = (feature.properties as any)?.nom || (feature.properties as any)?.name || '';
            layer.bindPopup(`<b>${label}</b><br>${nom}`);
          }
        }).addTo(this.emploiLayer);
      };

      this.mapService.getEmploi1().subscribe((fc) => addEmploi(fc, 'Emploi 1'));
      this.mapService.getEmploi2().subscribe((fc) => addEmploi(fc, 'Emploi 2'));
      this.mapService.getEmploi3().subscribe((fc) => addEmploi(fc, 'Emploi 3'));

      /* =========================
         3️⃣quinquies MISE A NIVEAU (HIDDEN)
      ========================= */
      const addMise = (fc: GeoJSON.FeatureCollection, label: string) => {
        L.geoJSON(fc, {
          pointToLayer: (_feature, latlng) => L.marker(latlng, { icon: this.miseIcon }),
          onEachFeature: (feature, layer) => {
            const nom = (feature.properties as any)?.nom || (feature.properties as any)?.name || '';
            layer.bindPopup(`<b>${label}</b><br>${nom}`);
          }
        }).addTo(this.miseLayer);
      };

      this.mapService.getMise1().subscribe((fc) => addMise(fc, 'Mise à niveau 1'));
      this.mapService.getMise2().subscribe((fc) => addMise(fc, 'Mise à niveau 2'));
      this.mapService.getMise3().subscribe((fc) => addMise(fc, 'Mise à niveau 3'));

      /* =========================
         4️⃣ MASK
      ========================= */
      const worldRing: GeoJSON.Position[] = [
        [-180, -90],
        [-180, 90],
        [180, 90],
        [180, -90],
        [-180, -90]
      ];

      const provinceRings: GeoJSON.Position[][] = [];

      data.features.forEach((f: any) => {
        const g = f.geometry;
        if (!g) return;

        if (g.type === 'Polygon') g.coordinates.forEach((r: any) => provinceRings.push(r));
        if (g.type === 'MultiPolygon') g.coordinates.forEach((p: any) => p.forEach((r: any) => provinceRings.push(r)));
      });

      const maskFeature: GeoJSON.Feature<GeoJSON.Polygon> = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [worldRing, ...provinceRings]
        }
      };

      L.geoJSON(maskFeature, {
        style: { fillColor: '#f5f7fa', fillOpacity: 0.85, stroke: false },
        interactive: false
      }).addTo(this.map);

      /* =========================
         5️⃣ OUTLINE
      ========================= */
      L.geoJSON(data, {
        style: { color: '#263238', weight: 3, fillOpacity: 0 },
        interactive: false
      }).addTo(this.map);

      /* =========================
         6️⃣ ZOOM
      ========================= */
      this.map.fitBounds(communesLayer.getBounds(), {
        paddingTopLeft: [80, 40],
        paddingBottomRight: [40, 40]
      });

      setTimeout(() => this.map.invalidateSize(), 0);
    });
  }

  ngOnDestroy(): void {
    if (this.map) this.map.remove();
  }

  // =========================
  // HELPERS
  // =========================
  resetIndicators() {
    this.indicateursDemo = {
      population: 0,
      hommes: 0,
      femmes: 0,
      marocains: 0,
      etrangers: 0,
      menages: 0
    };

    this.indicateursTerritoire = {
      superficieKm2: 0,
      communesTerritoriales: 0,
      grandMassifPct: 0,
      plaineSoussPct: 0,
      littoralKm: 0
    };
  }

  /* =========================
     TOGGLES
  ========================= */
  toggleSante() {
    if (this.santeVisible) this.map.removeLayer(this.santeLayer);
    else this.santeLayer.addTo(this.map);
    this.santeVisible = !this.santeVisible;
  }

  toggleEducation() {
    if (this.educationVisible) this.map.removeLayer(this.educationLayer);
    else this.educationLayer.addTo(this.map);
    this.educationVisible = !this.educationVisible;
  }

  toggleEauPotable() {
    if (this.eauPotableVisible) this.map.removeLayer(this.eauPotableLayer);
    else this.eauPotableLayer.addTo(this.map);
    this.eauPotableVisible = !this.eauPotableVisible;
  }

  toggleEmploi() {
    if (this.emploiVisible) this.map.removeLayer(this.emploiLayer);
    else this.emploiLayer.addTo(this.map);
    this.emploiVisible = !this.emploiVisible;
  }

  toggleMise() {
    if (this.miseVisible) this.map.removeLayer(this.miseLayer);
    else this.miseLayer.addTo(this.map);
    this.miseVisible = !this.miseVisible;
  }

  /* =========================
     COLORS
  ========================= */
  getCommuneColor(nom: string): string {
    switch (nom) {
      case '1080204': return '#7e89b3'; // boucraa
      case '1080202': return '#7e89b3'; // elmarsa
      case '1080206': return '#7e89b3'; // foumelouad
      case '1080203': return '#7e89b3'; // laayoune
      case '1080205': return '#7e89b3'; // dcheira
      default: return '#e6dbdb';
    }
  }

  /* =========================
     NAV
  ========================= */
  goToElmarsa(e: Event) { e.preventDefault(); this.router.navigate(['/elmarsa']); }
  goToBoucraa(e: Event) { e.preventDefault(); this.router.navigate(['/boucraa']); }
  goToLaayoune(e: Event) { e.preventDefault(); this.router.navigate(['/laayoune']); }
  goToDcheira(e: Event) { e.preventDefault(); this.router.navigate(['/dcheira']); }
  goToFoumelouad(e: Event) { e.preventDefault(); this.router.navigate(['/foumelouad']); }
}
