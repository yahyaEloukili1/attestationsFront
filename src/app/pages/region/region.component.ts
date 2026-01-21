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
import { UserProfileService } from 'src/app/core/services/user.service';


@Component({
  selector: 'app-region',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './region.component.html',
  styleUrl: './region.component.scss'
})
export class RegionComponent {

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

  constructor(
    private router: Router,
    private mapService: UserProfileService
  ) {}

  /* =========================
     ICONS
  ========================= */
  chrIcon = L.icon({
    iconUrl: 'assets/icons/hopital1.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });

  hopitauxExistantsIcon = L.icon({
    iconUrl: 'assets/icons/hopital3.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });

  educationIcon = L.icon({
    iconUrl: 'assets/icons/education.png',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28]
  });

  eauIcon = L.icon({
    iconUrl: 'assets/icons/water.png',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28]
  });

  emploiIcon = L.icon({
    iconUrl: 'assets/icons/job.png',
    iconSize: [28, 28],
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

  // Get first available property from feature.properties using multiple keys
  private pick(p: any, keys: string[]): any {
    for (const k of keys) {
      if (p && p[k] !== undefined && p[k] !== null && p[k] !== '') return p[k];
    }
    return undefined;
  }

  // =========================
  // ✅ MAIN
  // =========================
  ngAfterViewInit(): void {

    /* =========================
       1️⃣ INIT MAP
    ========================= */
this.map = L.map(this.mapContainer.nativeElement, {
  zoomControl: false,        // ❌ زر + -
  attributionControl: false,

  scrollWheelZoom: false,   // ❌ zoom بالماوس
  doubleClickZoom: false,   // ❌ double click
  boxZoom: false,           // ❌ drag box
  keyboard: false,          // ❌ clavier
  touchZoom: false,         // ❌ mobile pinch
  dragging: false            // ✅ نخلّي غير التحريك
});

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      { attribution: '&copy; OpenStreetMap & CartoDB' }
    ).addTo(this.map);

    /* =========================
       2️⃣ LOAD COMMUNES
    ========================= */
    this.mapService.getMaroc().subscribe((data: GeoJSON.FeatureCollection) => {

      console.log(data.features,'spspspsp');
      // ✅ reset
      this.resetIndicators();

      // ✅ communes territoriales = nombre de features
      this.indicateursTerritoire.communesTerritoriales = data.features.length;

      // ✅ On va essayer d'extraire aussi grandMassifPct & plaineSoussPct
      // (souvent ce genre de données est globale et répétée sur chaque feature)
      let foundMassif = false;
      let foundPlaine = false;
console.log(data.features,'qsss');
      data.features.forEach((feature: any) => {
        const p = feature.properties || {};



        // -------------------------
        // ✅ DEMO (sum)
        // -------------------------
        this.indicateursDemo.population += this.n(p.Population);
        console.log(this.indicateursDemo.population,'bbbbbbb');
        this.indicateursDemo.hommes     += this.n(p.Hommes);
        this.indicateursDemo.femmes     += this.n(p.Femmes);
        this.indicateursDemo.marocains  += this.n(p.Marocains);
        this.indicateursDemo.etrangers  += this.n(p.Etrangers);
        this.indicateursDemo.menages    += this.n(p.Nb_Menages);

        // -------------------------
        // ✅ TERRITOIRE (sum / pick)
        // -------------------------
        
        // Superficie km² (sum if exists per feature)
        const sup = this.pick(p, ['Superficie', 'superficie', 'Area_km2', 'area_km2', 'SUP_KM2']);
        this.indicateursTerritoire.superficieKm2 += this.n(sup);

        // Littoral km (sum if exists per feature)
        const lit = this.pick(p, ['Littoral_km', 'littoral_km', 'LITTORAL_KM', 'longueur_littoral', 'LITTORAL']);
        this.indicateursTerritoire.littoralKm += this.n(lit);

        // Grand massif % (take first non-zero)
        if (!foundMassif) {
          const massif = this.pick(p, ['Grand_massif_pct', 'grandMassifPct', 'GRAND_MASSIF_PCT', 'GRAND_MASSIF']);
          const mv = this.n(massif);
          if (mv > 0) {
            this.indicateursTerritoire.grandMassifPct = mv;
            foundMassif = true;
          }
        }

        // Plaine Souss % (take first non-zero)
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
  style: (feature: any) => {
    const isLaayoune = feature.properties?.CODE_REGIO === '11';

    return {
      color: '#263238',
      weight: 2,
      fillOpacity: 0.65,
      fillColor: isLaayoune ? '#7e89b3' : '#e6dbdb'
    };
  },

  onEachFeature: (feature: any, layer: L.Layer) => {
    const polygon = layer as L.Path;

    // 👉 CLICK
    polygon.on('click', () => {
      const codeRegion = feature.properties?.CODE_REGIO;

      if (codeRegion === '11') {
        // ✅ navigation vers users list
        this.router.navigate(['/users/list']);
      }
    });

    // (optionnel) hover
    polygon.on('mouseover', () => {
      polygon.setStyle({
        weight: 3,
        fillOpacity: 0.85
      });
    });

    polygon.on('mouseout', () => {
      communesLayer.resetStyle(polygon);
    });
  }
}).addTo(this.map);



      /* =========================
         3️⃣ SANTÉ (HIDDEN)
      ========================= */
      this.mapService.getCHRs().subscribe(chrs => {
        L.geoJSON(chrs, {
          pointToLayer: (_feature, latlng) =>
            L.marker(latlng, { icon: this.hopitauxExistantsIcon }),
          onEachFeature: (feature, layer) => {
            layer.bindPopup(`<b>CHR</b><br>${(feature.properties as any)?.nom || ''}`);
          }
        }).addTo(this.santeLayer);
      });

      this.mapService.getSanteExistants().subscribe(cs => {
        L.geoJSON(cs, {
          pointToLayer: (_feature, latlng) =>
            L.marker(latlng, { icon: this.chrIcon }),
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
          pointToLayer: (_feature, latlng) =>
            L.marker(latlng, { icon: this.educationIcon }),
          onEachFeature: (feature, layer) => {
            const nom = (feature.properties as any)?.nom || (feature.properties as any)?.name || '';
            layer.bindPopup(`<b>${label}</b><br>${nom}`);
          }
        }).addTo(this.educationLayer);
      };

      this.mapService.getEducationExistants1().subscribe(fc => addEducation(fc, 'Education 1'));
      this.mapService.getEducationExistants2().subscribe(fc => addEducation(fc, 'Education 2'));
      this.mapService.getEducationExistants3().subscribe(fc => addEducation(fc, 'Education 3'));
      this.mapService.getEducationExistants4().subscribe(fc => addEducation(fc, 'Education 4'));

      /* =========================
         3️⃣ter EAU POTABLE (HIDDEN)
      ========================= */
      this.mapService.getEauPotable().subscribe((fc: GeoJSON.FeatureCollection) => {
        L.geoJSON(fc, {
          pointToLayer: (_feature, latlng) =>
            L.marker(latlng, { icon: this.eauIcon }),
          onEachFeature: (feature, layer) => {
            const nom = (feature.properties as any)?.nom || (feature.properties as any)?.name || '';
            layer.bindPopup(`<b>Eau potable</b><br>${nom}`);
          }
        }).addTo(this.eauPotableLayer);
      });

      /* =========================
         3️⃣quater EMPLOI (HIDDEN)
      ========================= */
      const addEmploi = (fc: GeoJSON.FeatureCollection, label: string) => {
        L.geoJSON(fc, {
          pointToLayer: (_feature, latlng) =>
            L.marker(latlng, { icon: this.emploiIcon }),
          onEachFeature: (feature, layer) => {
            const nom = (feature.properties as any)?.nom || (feature.properties as any)?.name || '';
            layer.bindPopup(`<b>${label}</b><br>${nom}`);
          }
        }).addTo(this.emploiLayer);
      };

      this.mapService.getEmploi1().subscribe(fc => addEmploi(fc, 'Emploi 1'));
      this.mapService.getEmploi2().subscribe(fc => addEmploi(fc, 'Emploi 2'));
      this.mapService.getEmploi3().subscribe(fc => addEmploi(fc, 'Emploi 3'));

      /* =========================
         3️⃣quinquies MISE A NIVEAU (HIDDEN)
      ========================= */
      const addMise = (fc: GeoJSON.FeatureCollection, label: string) => {
        L.geoJSON(fc, {
          pointToLayer: (_feature, latlng) =>
            L.marker(latlng, { icon: this.miseIcon }),
          onEachFeature: (feature, layer) => {
            const nom = (feature.properties as any)?.nom || (feature.properties as any)?.name || '';
            layer.bindPopup(`<b>${label}</b><br>${nom}`);
          }
        }).addTo(this.miseLayer);
      };

      this.mapService.getMise1().subscribe(fc => addMise(fc, 'Mise à niveau 1'));
      this.mapService.getMise2().subscribe(fc => addMise(fc, 'Mise à niveau 2'));
      this.mapService.getMise3().subscribe(fc => addMise(fc, 'Mise à niveau 3'));

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

      data.features.forEach(f => {
        const g = f.geometry;
        if (!g) return;

        if (g.type === 'Polygon') g.coordinates.forEach(r => provinceRings.push(r));
        if (g.type === 'MultiPolygon') g.coordinates.forEach(p => p.forEach(r => provinceRings.push(r)));
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
/* =========================
   6️⃣ ZOOM (CORRECT)
========================= */

// zoom strict sur les communes uniquement
const bounds = communesLayer.getBounds();

this.map.fitBounds(bounds, {
  padding: [20, 20],
  maxZoom: 8
});

// 🔍 petit zoom en plus pour le rendu
setTimeout(() => {

  this.map.invalidateSize();
}, 200);


// 🔍 zoom supplémentaire

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
      case '1080204': return '#7e89b3';//boucraa
      case '1080202': return '#7e89b3';//elmarsa
      case '1080206': return '#7e89b3';//Foumelouad
      case '1080203': return '#7e89b3';//laayoune
      case '1080205': return '#7e89b3';//dcheira
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
