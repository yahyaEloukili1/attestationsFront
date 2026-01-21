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
  selector: 'app-laayoune',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './laayoune.component.html',
  styleUrl: './laayoune.component.scss'
})
export class LaayouneComponent implements AfterViewInit, OnDestroy {

  @ViewChild('mapContainer', { static: true })
  mapContainer!: ElementRef<HTMLDivElement>;

  map!: L.Map;

  // ✅ polygon latlngs for filtering
  private communePolygonLatLngs:
    | L.LatLngExpression[]
    | L.LatLngExpression[][]
    | L.LatLngExpression[][][] = [];

  // ✅ Layers + states
  santeLayer = L.layerGroup();
  santeVisible = false;

  educationLayer = L.layerGroup();
  educationVisible = false;

  eauPotableLayer = L.layerGroup();
  eauPotableVisible = false;

  emploiLayer = L.layerGroup();
  emploiVisible = false;

  miseLayer = L.layerGroup();
  miseVisible = false;

  constructor(private mapService: UserProfileService) {}

  /* =========================
     ICONS (same as province)
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

  ngAfterViewInit(): void {

    /* =========================
       INIT MAP (NO BASEMAP)
    ========================= */
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

    const target = normalize('LAAYOUNE');

    this.mapService.getCommunes().subscribe((data: FeatureCollection) => {

      const features: Feature[] = data.features.filter(
        f => normalize((f.properties as any)?.COMMUNE) === target
      );

      if (!features.length) {
        console.error('❌ Laâyoune not found in GeoJSON');
        return;
      }

      const laayouneFC: FeatureCollection = {
        type: 'FeatureCollection',
        features
      };

      /* =========================
         DRAW LAAYOUNE ONLY
      ========================= */
      const laayouneLayer = L.geoJSON(laayouneFC, {
        style: {
          color: '#263238',
          weight: 3,
          fillColor: '#f2b6b6',
          fillOpacity: 0.9
        }
      }).addTo(this.map);

      // ✅ Extract polygon latlngs for filtering
      const leafLayer: any = laayouneLayer.getLayers()[0];
      this.communePolygonLatLngs = leafLayer.getLatLngs();

      /* =========================
         LABEL
      ========================= */
      const bounds = laayouneLayer.getBounds();

      L.tooltip({
        permanent: true,
        direction: 'center',
        className: 'commune-label'
      })
        .setContent('العيون')
        .setLatLng(bounds.getCenter())
        .addTo(this.map);

      /* =========================
         FIT MAP
      ========================= */
      this.map.fitBounds(bounds, { padding: [40, 40] });
      setTimeout(() => this.map.invalidateSize(), 0);

      // ✅ load all layers (hidden)
      this.loadAllCommuneLayers();
    });
  }

  ngOnDestroy(): void {
    if (this.map) this.map.remove();
  }

  /* =========================
     LOAD + FILTER POINTS INSIDE COMMUNE
  ========================= */
  private loadAllCommuneLayers() {
    // Santé
    this.mapService.getCHRs().subscribe(fc =>
      this.addFilteredPointsToLayer(fc, this.santeLayer, this.hopitauxExistantsIcon, 'CHR')
    );
    this.mapService.getSanteExistants().subscribe(fc =>
      this.addFilteredPointsToLayer(fc, this.santeLayer, this.chrIcon, 'Centre de santé')
    );

    // Education 1..4
    this.mapService.getEducationExistants1().subscribe(fc =>
      this.addFilteredPointsToLayer(fc, this.educationLayer, this.educationIcon, 'Education 1')
    );
    this.mapService.getEducationExistants2().subscribe(fc =>
      this.addFilteredPointsToLayer(fc, this.educationLayer, this.educationIcon, 'Education 2')
    );
    this.mapService.getEducationExistants3().subscribe(fc =>
      this.addFilteredPointsToLayer(fc, this.educationLayer, this.educationIcon, 'Education 3')
    );
    this.mapService.getEducationExistants4().subscribe(fc =>
      this.addFilteredPointsToLayer(fc, this.educationLayer, this.educationIcon, 'Education 4')
    );

    // Eau potable
    this.mapService.getEauPotable().subscribe(fc =>
      this.addFilteredPointsToLayer(fc, this.eauPotableLayer, this.eauIcon, 'Eau potable')
    );

    // Emploi 1..3
    this.mapService.getEmploi1().subscribe(fc =>
      this.addFilteredPointsToLayer(fc, this.emploiLayer, this.emploiIcon, 'Emploi 1')
    );
    this.mapService.getEmploi2().subscribe(fc =>
      this.addFilteredPointsToLayer(fc, this.emploiLayer, this.emploiIcon, 'Emploi 2')
    );
    this.mapService.getEmploi3().subscribe(fc =>
      this.addFilteredPointsToLayer(fc, this.emploiLayer, this.emploiIcon, 'Emploi 3')
    );

    // Mise 1..3
    this.mapService.getMise1().subscribe(fc =>
      this.addFilteredPointsToLayer(fc, this.miseLayer, this.miseIcon, 'Mise à niveau 1')
    );
    this.mapService.getMise2().subscribe(fc =>
      this.addFilteredPointsToLayer(fc, this.miseLayer, this.miseIcon, 'Mise à niveau 2')
    );
    this.mapService.getMise3().subscribe(fc =>
      this.addFilteredPointsToLayer(fc, this.miseLayer, this.miseIcon, 'Mise à niveau 3')
    );
  }

  private addFilteredPointsToLayer(
    fc: FeatureCollection,
    targetLayer: L.LayerGroup,
    icon: L.Icon,
    label: string
  ) {
    if (!fc?.features?.length) return;

    const filtered: Feature[] = fc.features.filter((f: Feature) => {
      if (!f.geometry) return false;
      if (f.geometry.type !== 'Point') return false;

      const coords = f.geometry.coordinates as number[];
      const lng = coords[0];
      const lat = coords[1];

      return this.isLatLngInsideCommune(lat, lng);
    });

    if (!filtered.length) return;

    const filteredFC: FeatureCollection = { type: 'FeatureCollection', features: filtered };

    L.geoJSON(filteredFC, {
      pointToLayer: (_feature, latlng) => L.marker(latlng, { icon }),
      onEachFeature: (feature, layer) => {
        const props: any = feature.properties || {};
        const nom = props.nom || props.name || props.type || '';
        layer.bindPopup(`<b>${label}</b><br>${nom}`);
      }
    }).addTo(targetLayer);
  }

  // =========================
  // Point-in-polygon (Leaflet)
  // =========================
  private isLatLngInsideCommune(lat: number, lng: number): boolean {
    const p = L.latLng(lat, lng);

    const polyAny: any = L.polygon(this.communePolygonLatLngs as any);
    if (!polyAny.getBounds().contains(p)) return false;

    const rings = this.flattenRings(this.communePolygonLatLngs as any);
    return rings.some(ring => this.pointInRing(p, ring));
  }

  private flattenRings(latlngs: any): L.LatLng[][] {
    const out: L.LatLng[][] = [];

    const walk = (arr: any) => {
      if (!Array.isArray(arr)) return;
      if (arr.length && arr[0] instanceof L.LatLng) {
        out.push(arr as L.LatLng[]);
        return;
      }
      arr.forEach(walk);
    };

    walk(latlngs);
    return out;
  }

  private pointInRing(p: L.LatLng, ring: L.LatLng[]): boolean {
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const xi = ring[i].lng, yi = ring[i].lat;
      const xj = ring[j].lng, yj = ring[j].lat;

      const intersect =
        ((yi > p.lat) !== (yj > p.lat)) &&
        (p.lng < ((xj - xi) * (p.lat - yi)) / (yj - yi + 0.0) + xi);

      if (intersect) inside = !inside;
    }
    return inside;
  }

  /* =========================
     TOGGLES
  ========================= */
  toggleMise() {
    if (this.miseVisible) this.map.removeLayer(this.miseLayer);
    else this.miseLayer.addTo(this.map);
    this.miseVisible = !this.miseVisible;
  }

  toggleEducation() {
    if (this.educationVisible) this.map.removeLayer(this.educationLayer);
    else this.educationLayer.addTo(this.map);
    this.educationVisible = !this.educationVisible;
  }

  toggleSante() {
    if (this.santeVisible) this.map.removeLayer(this.santeLayer);
    else this.santeLayer.addTo(this.map);
    this.santeVisible = !this.santeVisible;
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
}
