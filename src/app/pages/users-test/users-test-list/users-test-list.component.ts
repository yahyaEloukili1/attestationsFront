// users-test-list.component.ts
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
    iconUrl: 'assets/icons/way.png', // ✅ add this icon (or change path)
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28]
  });

  ngAfterViewInit(): void {
    /* =========================
       1️⃣ INIT MAP
    ========================= */
    this.map = L.map(this.mapContainer.nativeElement, {
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      { attribution: '&copy; OpenStreetMap & CartoDB' }
    ).addTo(this.map);

    /* =========================
       2️⃣ LOAD COMMUNES
    ========================= */
    this.mapService.getCommunes().subscribe((data: GeoJSON.FeatureCollection) => {

      const communesLayer = L.geoJSON(data, {
        style: (feature: any) => ({
          color: '#888',
          weight: 1,
          fillColor: this.getCommuneColor(feature.properties.Nom_Comm_1),
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
              .setContent(feature.properties.Nom_Comm_1)
              .setLatLng(bounds.getCenter())
              .addTo(this.map);
          }

          const popup = L.popup({ closeButton: false, offset: [0, -5] })
            .setContent(`
              <div class="popup-content">
                <b>${feature.properties.Nom_Com_Ol}</b><hr>
                👥 Population : ${feature.properties.Population}<br>
                🏠 Ménages : ${feature.properties.Nb_Menages}<br>
                🇲🇦 Marocains : ${feature.properties.Marocains}<br>
                🌍 Étrangers : ${feature.properties.Etrangers}
              </div>
            `);

          polygon.on('mouseover', (e: any) => {
            popup.setLatLng(e.latlng);
            popup.openOn(this.map);

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
            'DCHEIRA': '/dcheira',
            'BOUKRAA': '/boucraa',
            'FOUM EL OUAD': '/foumelouad',
            'LAAYOUNE': '/laayoune',
            'EL MARSA': '/elmarsa'
          };

          polygon.on('click', () => {
            const key = feature.properties.Nom_Com_Ol?.toUpperCase().trim();
            if (routes[key]) {
              this.router.navigate([routes[key]]);
            }
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
            layer.bindPopup(`<b>CHR</b><br>${feature.properties?.nom || ''}`);
          }
        }).addTo(this.santeLayer);
      });

      this.mapService.getSanteExistants().subscribe(cs => {
        L.geoJSON(cs, {
          pointToLayer: (_feature, latlng) =>
            L.marker(latlng, { icon: this.chrIcon }),
          onEachFeature: (feature, layer) => {
            layer.bindPopup(`<b>Centre de santé</b><br>${feature.properties?.nom || ''}`);
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
      case 'العيون': return '#f2b6b6';
      case 'المرسى': return '#b8d9f2';
      case 'فم الواد': return '#c7e3c1';
      case 'بوكراع': return '#f6edb1';
      case 'الدشيرة': return '#dbc6e8';
      default: return '#e0e0e0';
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
