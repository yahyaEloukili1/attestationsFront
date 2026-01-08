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
  selector: 'app-foumelouad',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './foumelouad.component.html',
  styleUrl: './foumelouad.component.scss'
})
export class FoumelouadComponent implements AfterViewInit, OnDestroy {

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
        ? value.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toUpperCase()
            .trim()
        : '';

    const target = normalize('FOUM EL OUAD');

    this.mapService.getCommunes().subscribe((data: FeatureCollection) => {

      const features: Feature[] = data.features.filter(
        f => normalize((f.properties as any)?.Nom_Com_Ol) === target
      );

      if (!features.length) {
        console.error('❌ Foum El Oued not found in GeoJSON');
        return;
      }

      const foumFC: FeatureCollection = {
        type: 'FeatureCollection',
        features
      };

      /* =========================
         DRAW FOUM EL OUED ONLY
      ========================= */
      const foumLayer = L.geoJSON(foumFC, {
        style: {
          color: '#263238',
          weight: 3,
          fillColor: '#c7e3c1',
          fillOpacity: 0.9
        }
      }).addTo(this.map);

      /* =========================
         LABEL
      ========================= */
      const bounds = foumLayer.getBounds();

      L.tooltip({
        permanent: true,
        direction: 'center',
        className: 'commune-label'
      })
        .setContent('فم الواد')
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
