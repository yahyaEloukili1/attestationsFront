import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { UserProfileService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-region-laayoune',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './region-laayoune.component.html',
  styleUrl: './region-laayoune.component.scss'
})
export class RegionLaayouneComponent implements AfterViewInit, OnDestroy {

  @ViewChild('mapContainer', { static: true })
  mapContainer!: ElementRef<HTMLDivElement>;

  map!: L.Map;

  constructor(
    private router: Router,
    private mapService: UserProfileService
  ) {}

  ngAfterViewInit(): void {

    /* =========================
       MAP SANS BACKGROUND
    ========================= */
    this.map = L.map(this.mapContainer.nativeElement, {
      zoomControl: false,
      attributionControl: false,
      zoomSnap: 0.1
    });

    /* ❌ PAS DE TILELAYER */
    /* ❌ PAS DE MASK */

    /* =========================
       LOAD REGION
    ========================= */
    this.mapService.getRegionLaayoune().subscribe(
      (data: GeoJSON.FeatureCollection) => {

       const regionLayer = L.geoJSON(data, {
  style: (feature: any) => {
    const province = feature.properties?.Province_F?.toUpperCase()?.trim();

    return {
      color: '#6b7280',        // contour
      weight: 1.5,
      fillColor:
        province === 'LAAYOUNE'
          ? '#0b3d6e'           // 🔵 Laâyoune (bleu foncé)
          : '#9bbce6',          // 🔹 autres provinces
      fillOpacity: 1
    };
  },

  onEachFeature: (feature: any, layer: L.Layer) => {
    const polygon = layer as L.Path;

    /* ===== LABEL ===== */
    const center = (polygon as any).getBounds().getCenter();

    L.tooltip({
      permanent: true,
      direction: 'center',
      className: 'province-label'
    })
      .setContent(feature.properties?.Province_F || '')
      .setLatLng(center)
      .addTo(this.map);

    /* ===== HOVER ===== */
    polygon.on('mouseover', () => {
      polygon.setStyle({
        weight: 3,
        fillOpacity: 1
      });
    });

    polygon.on('mouseout', () => {
      polygon.setStyle({
        weight: 1.5,
        fillOpacity: 1
      });
    });

    /* ===== CLICK ===== */
    polygon.on('click', () => {
      const province =
        feature.properties?.Province_F
          ?.toUpperCase()
          ?.trim();

      if (province === 'LAAYOUNE') {
        this.router.navigate(['/users/list']);
      }
    });
  }
}).addTo(this.map);

        /* =========================
           ZOOM SUR REGION
        ========================= */
        this.map.fitBounds(regionLayer.getBounds(), {
          padding: [20, 20]
        });

        setTimeout(() => this.map.invalidateSize(), 0);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.map) this.map.remove();
  }
}
