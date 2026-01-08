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

  constructor(
    private router: Router,
    private mapService: UserProfileService
  ) {}

  /* =========================
     ICONS
  ========================= */
  collegeIcon = L.icon({
    iconUrl: 'assets/icons/college.png',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28]
  });

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
console.log(data,"oeooooo");
      const communesLayer = L.geoJSON(data, {
        style: (feature: any) => ({
          color: '#888',
          weight: 1,
          fillColor: this.getCommuneColor(feature.properties.Nom_Comm_1),
          fillOpacity: 0.55
        }),

        onEachFeature: (feature: any, layer: L.Layer) => {
          const polygon = layer as L.Path;

          /* LABEL */
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

          /* POPUP */
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

          /* ROUTING */
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
         3️⃣ CHR LAYER (CORRECT)
      ========================= */
      this.mapService.getCHRs().subscribe(chrs => {
        L.geoJSON(chrs, {
          pointToLayer: (feature, latlng) =>
            L.marker(latlng, { icon: this.hopitauxExistantsIcon }),

          onEachFeature: (feature, layer) => {
            layer.bindPopup(`
              <b>Centre Hospitalier Régional</b><br>
              ${feature.properties?.nom || ''}
            `);
          }
        }).addTo(this.map);
      });

        this.mapService.getSanteExistants().subscribe(chrs => {
        L.geoJSON(chrs, {
          pointToLayer: (feature, latlng) =>
            L.marker(latlng, { icon: this.chrIcon }),

          onEachFeature: (feature, layer) => {
            layer.bindPopup(`
              <b>Centre Hospitalier Régional</b><br>
              ${feature.properties?.nom || ''}
            `);
          }
        }).addTo(this.map);
      });
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

        if (g.type === 'Polygon') {
          g.coordinates.forEach(r => provinceRings.push(r));
        }

        if (g.type === 'MultiPolygon') {
          g.coordinates.forEach(p =>
            p.forEach(r => provinceRings.push(r))
          );
        }
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
        style: {
          fillColor: '#f5f7fa',
          fillOpacity: 0.85,
          stroke: false
        },
        interactive: false
      }).addTo(this.map);

      /* =========================
         5️⃣ OUTLINE
      ========================= */
      L.geoJSON(data, {
        style: {
          color: '#263238',
          weight: 3,
          fillOpacity: 0
        },
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
