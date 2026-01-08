import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { FeatureCollection, Feature } from 'geojson';
import { UserProfileService } from '../../../app/core/services/user.service';

@Component({
  selector: 'app-decheira',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './decheira.component.html',
  styleUrl: './decheira.component.scss'
})
export class DecheiraComponent implements AfterViewInit, OnDestroy {

  @ViewChild('mapContainer', { static: true })
  mapContainer!: ElementRef<HTMLDivElement>;

  map!: L.Map;

  constructor(private mapService: UserProfileService) {}

  ngAfterViewInit(): void {

    /* =========================
       INIT MAP (NO BACKGROUND)
    ========================= */
    this.map = L.map(this.mapContainer.nativeElement, {
      zoomControl: false,
      attributionControl: false
    });

    const normalize = (value?: string): string =>
      value
        ? value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().trim()
        : '';

    const target = normalize('DCHEIRA');

    this.mapService.getCommunes().subscribe((data: FeatureCollection) => {

      const features: Feature[] = data.features.filter(
        f => normalize((f.properties as any)?.Nom_Com_Ol) === target
      );

      if (!features.length) {
        console.error('❌ Dcheira not found in GeoJSON');
        return;
      }

      const dcheiraFC: FeatureCollection = {
        type: 'FeatureCollection',
        features
      };

      /* =========================
         DRAW DCHEIRA ONLY
      ========================= */
      const dcheiraLayer = L.geoJSON(dcheiraFC, {
        style: {
          color: '#263238',
          weight: 3,
          fillColor: '#dbc6e8',
          fillOpacity: 0.9
        }
      }).addTo(this.map);

      /* =========================
         LABEL
      ========================= */
      const bounds = dcheiraLayer.getBounds();

      L.tooltip({
        permanent: true,
        direction: 'center',
        className: 'commune-label'
      })
        .setContent('الدشيرة')
        .setLatLng(bounds.getCenter())
        .addTo(this.map);

      /* =========================
         FIT
      ========================= */
      this.map.fitBounds(bounds, { padding: [40, 40] });
      setTimeout(() => this.map.invalidateSize(), 0);
    });
  }

  ngOnDestroy(): void {
    if (this.map) this.map.remove();
  }
}
