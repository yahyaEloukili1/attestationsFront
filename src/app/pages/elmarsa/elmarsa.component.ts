import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { FeatureCollection, Feature, Point } from 'geojson';
import { UserProfileService } from '../../../app/core/services/user.service';

@Component({
  selector: 'app-elmarsa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './elmarsa.component.html',
  styleUrl: './elmarsa.component.scss'
})
export class ElmarsaComponent implements AfterViewInit, OnDestroy {

  /* =========================
     MAP
  ========================= */
  @ViewChild('mapContainer', { static: true })
  mapContainer!: ElementRef<HTMLDivElement>;

  map!: L.Map;

  /* =========================
     POPUP + CHARTS
  ========================= */
  showEducationCharts = false;
  private charts: any[] = [];

  /* =========================
     POLYGON COMMUNE
  ========================= */
  private communePolygonLatLngs:
    | L.LatLngExpression[]
    | L.LatLngExpression[][]
    | L.LatLngExpression[][][] = [];

  /* =========================
     LAYERS + STATES
  ========================= */
  santeLayer = L.layerGroup();
  educationLayer = L.layerGroup();
  eauPotableLayer = L.layerGroup();
  emploiLayer = L.layerGroup();
  miseLayer = L.layerGroup();

  santeVisible = false;
  educationVisible = false;
  eauPotableVisible = false;
  emploiVisible = false;
  miseVisible = false;

  constructor(private mapService: UserProfileService) {}

  /* =========================
     ICONS (comme Laayoune)
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

  /* =========================
     INIT MAP
  ========================= */
  ngAfterViewInit(): void {

    this.map = L.map(this.mapContainer.nativeElement, {
      zoomControl: false,
      attributionControl: false
    });

    const normalize = (v?: string): string =>
      v
        ? v.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/-/g, ' ')
            .toUpperCase()
            .trim()
        : '';

    const target = normalize('EL MARSA');

    this.mapService.getCommunes().subscribe((data: FeatureCollection) => {

      const features: Feature[] = data.features.filter(
        f => normalize((f.properties as any)?.COMMUNE) === target
      );

      if (!features.length) {
        console.error('❌ EL MARSA not found in GeoJSON');
        return;
      }

      const elmarsaFC: FeatureCollection = { type: 'FeatureCollection', features };

      const elmarsaLayer = L.geoJSON(elmarsaFC, {
        style: {
          color: '#263238',
          weight: 3,
          fillColor: '#b8d9f2',
          fillOpacity: 0.9
        }
      }).addTo(this.map);

      // ✅ Extract polygon latlngs for filtering
      const leafLayer: any = elmarsaLayer.getLayers()[0];
      this.communePolygonLatLngs = leafLayer.getLatLngs();

      const bounds = elmarsaLayer.getBounds();

      L.tooltip({
        permanent: true,
        direction: 'center',
        className: 'commune-label'
      })
        .setContent('المرسى')
        .setLatLng(bounds.getCenter())
        .addTo(this.map);

      this.map.fitBounds(bounds, { padding: [40, 40] });
      setTimeout(() => this.map.invalidateSize(), 0);

      // ✅ IMPORTANT: charger toutes les couches (cachées)
      this.loadAllCommuneLayers();
    });
  }

  ngOnDestroy(): void {
    this.charts.forEach(c => c.destroy());
    this.map?.remove();
  }

  /* =========================
     POPUP CONTROLS
  ========================= */
  openEducationCharts() {
    this.showEducationCharts = true;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.initEducationCharts();
      });
    });
  }

  closeEducationCharts() {
    this.showEducationCharts = false;
    this.charts.forEach(c => c.destroy());
    this.charts = [];
  }

  /* =========================
     CHARTS
  ========================= */
  private initEducationCharts() {
    this.charts.forEach(c => c.destroy());
    this.charts = [];

    const labels = ['Primaire', 'Collégial', 'Qualifiant'];

    this.charts.push(
      new (window as any).Chart('encombrementChart', {
        type: 'bar',
        data: {
          labels,
          datasets: [
            { label: 'Provincial', data: [3.98, 0.25, 3.07], backgroundColor: '#e6b89c' },
            { label: 'El Marsa', data: [22.58, 0.25, 3.45], backgroundColor: '#3fa7d6' }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: "Taux d’encombrement",
              font: { size: 16, weight: 'bold' },
              padding: { top: 10, bottom: 20 }
            }
          }
        }
      })
    );

    this.charts.push(
      new (window as any).Chart('abandonChart', {
        type: 'bar',
        data: {
          labels,
          datasets: [
            { label: 'Provincial', data: [1.28, 3.85, 6.03], backgroundColor: '#e6b89c' },
            { label: 'El Marsa', data: [1.09, 5.75, 6.96], backgroundColor: '#3fa7d6' }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: "Taux d’abandon scolaire",
              font: { size: 16, weight: 'bold' },
              padding: { top: 10, bottom: 20 }
            }
          }
        }
      })
    );

    this.charts.push(
      new (window as any).Chart('redoublementChart', {
        type: 'bar',
        data: {
          labels,
          datasets: [
            { label: 'Provincial', data: [4.42, 9.98, 11.34], backgroundColor: '#e6b89c' },
            { label: 'El Marsa', data: [5.47, 9.54, 15.34], backgroundColor: '#3fa7d6' }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: "Taux de redoublement",
              font: { size: 16, weight: 'bold' },
              padding: { top: 10, bottom: 20 }
            }
          }
        }
      })
    );
  }

  /* =========================
     LOAD + FILTER POINTS INSIDE COMMUNE
     (comme Laayoune)
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

    const filtered = fc.features.filter((f): f is Feature<Point> => {
      if (!f.geometry || f.geometry.type !== 'Point') return false;
      const [lng, lat] = f.geometry.coordinates;
      return this.isLatLngInsideCommune(lat, lng);
    });

    if (!filtered.length) return;

    const filteredFC: FeatureCollection = { type: 'FeatureCollection', features: filtered };

    L.geoJSON(filteredFC, {
      pointToLayer: (_, latlng) => L.marker(latlng, { icon }),
      onEachFeature: (feature, layer) => {
        const props: any = feature.properties || {};
        const nom = props.nom || props.name || props.type || '';
        layer.bindPopup(`<b>${label}</b><br>${nom}`);
      }
    }).addTo(targetLayer);
  }

  /* =========================
     POINT IN POLYGON
  ========================= */
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
     TOGGLES (comme Laayoune)
  ========================= */
  toggleMise() { this.toggle(this.miseLayer, 'miseVisible'); }
  toggleEducation() { this.toggle(this.educationLayer, 'educationVisible'); }
  toggleSante() { this.toggle(this.santeLayer, 'santeVisible'); }
  toggleEauPotable() { this.toggle(this.eauPotableLayer, 'eauPotableVisible'); }
  toggleEmploi() { this.toggle(this.emploiLayer, 'emploiVisible'); }

  private toggle(layer: L.LayerGroup, prop: keyof ElmarsaComponent) {
    this[prop] ? this.map.removeLayer(layer) : layer.addTo(this.map);
    this[prop] = !this[prop] as any;
  }
}
