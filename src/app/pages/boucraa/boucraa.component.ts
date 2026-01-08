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
  selector: 'app-boucraa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './boucraa.component.html',
  styleUrl: './boucraa.component.scss'
})
export class BoucraaComponent implements AfterViewInit, OnDestroy {

  @ViewChild('mapContainer', { static: true })
  mapContainer!: ElementRef<HTMLDivElement>;

  map!: L.Map;

  constructor(private mapService: UserProfileService) {}

  ngAfterViewInit(): void {
    // init map WITHOUT basemap
    this.map = L.map(this.mapContainer.nativeElement, {
      zoomControl: false,
      attributionControl: false
    });

    const normalize = (value?: string): string =>
      value
        ? value
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/-/g, ' ')
            .toUpperCase()
            .trim()
        : '';

    const target = normalize('BOUKRAA');

    this.mapService.getCommunes().subscribe((data: FeatureCollection) => {
      const features: Feature[] = data.features.filter(
        f => normalize((f.properties as any)?.Nom_Com_Ol) === target
      );

      if (!features.length) {
        console.error('❌ Boucraa not found in GeoJSON');
        return;
      }

      const boucraaFC: FeatureCollection = { type: 'FeatureCollection', features };

      // draw ONLY boucraa
      const boucraaLayer = L.geoJSON(boucraaFC, {
        style: {
          color: '#263238',
          weight: 3,
          fillColor: '#f6edb1',
          fillOpacity: 0.9
        }
      }).addTo(this.map);

      // label
      const b = boucraaLayer.getBounds();
      L.tooltip({
        permanent: true,
        direction: 'center',
        className: 'commune-label'
      })
        .setContent('بوكراع')
        .setLatLng(b.getCenter())
        .addTo(this.map);

      // fit
      this.map.fitBounds(b, { padding: [40, 40] });

      setTimeout(() => this.map.invalidateSize(), 0);
    });
  }

  ngOnDestroy(): void {
    if (this.map) this.map.remove();
  }
}
