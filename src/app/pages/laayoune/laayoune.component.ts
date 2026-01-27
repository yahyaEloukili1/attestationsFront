// laayoune.component.ts
import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import * as proj4 from 'proj4';
import type { FeatureCollection, Feature, Geometry } from 'geojson';
import { UserProfileService } from '../../../app/core/services/user.service';

type MenuKey = 'emploi' | 'eau' | 'sante' | 'education' | 'mise';

type SanteProject = 'NOUVEAUX' | 'HOPITAUX_EXISTANTS' | 'ESSP_EXISTANTS' | 'DOUIRAT';
type EducationProject = 'E1' | 'E2' | 'E3' | 'E4';
type EauProject = 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6';
type EmploiProject = 'ZONE1' | 'HIZAM' | 'ATELIERS' | 'SITES' | 'POINTS';
type MiseProject = 'M1' | 'M2' | 'M3';

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

  // ✅ dropdown ouvert (un seul à la fois)
  openMenu: MenuKey | null = null;

  // ✅ projet sélectionné (bouton actif + icône check)
  activeSanteProject: SanteProject | null = null;
  activeEducationProject: EducationProject | null = null;
  activeEauProject: EauProject | null = null;
  activeEmploiProject: EmploiProject | null = null;
  activeMiseProject: MiseProject | null = null;

  // =========================
  // ✅ LAYERS (BY PROJECT)
  // =========================
  // Santé
  santeNouveauxLayer = L.layerGroup();
  santeHopitauxLayer = L.layerGroup();
  santeESSPLayer = L.layerGroup();
  santeDouiratLayer = L.layerGroup();

  // Education
  education1Layer = L.layerGroup();
  education2Layer = L.layerGroup();
  education3Layer = L.layerGroup();
  education4Layer = L.layerGroup();

  // Eau potable
  eauP1Layer = L.layerGroup();
  eauP2Layer = L.layerGroup();
  eauP3Layer = L.layerGroup();
  eauP4Layer = L.layerGroup();
  eauP5Layer = L.layerGroup();
  eauP6Layer = L.layerGroup();

  // Emploi
  emploiPointsLayer = L.layerGroup();
  emploiZone1Layer = L.layerGroup();
  emploiHizamLayer = L.layerGroup();
  emploiAteliersLayer = L.layerGroup();
  emploiSitesLayer = L.layerGroup();

  // Mise
  mise1Layer = L.layerGroup();
  mise2Layer = L.layerGroup();
  mise3Layer = L.layerGroup();

  constructor(
    private mapService: UserProfileService,
    private router: Router
  ) {}

  /* =========================
     ICONS (Leaflet markers)
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
  // ✅ PROJECTION (EPSG:26194 -> WGS84)
  // =========================
  private readonly CRS_26194 =
    '+proj=lcc +lat_1=26.1 +lat_0=26.1 +lon_0=-5.4 +k_0=0.999616304 ' +
    '+x_0=1200000 +y_0=400000 +ellps=clrk80ign +towgs84=31,146,47,0,0,0,0 ' +
    '+units=m +no_defs';

  private toLatLngAuto(coords: any): L.LatLng {
    const x = Number(coords[0]);
    const y = Number(coords[1]);

    // CRS84 : [lng, lat]
    if (Math.abs(x) <= 180 && Math.abs(y) <= 90) return L.latLng(y, x);

    const fn = (proj4 as any).default ?? (proj4 as any);
    const [lng, lat] = fn(this.CRS_26194, 'WGS84', [x, y]) as [number, number];
    return L.latLng(lat, lng);
  }

  private escapeHtml(s: any): string {
    const str = String(s ?? '');
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  ngAfterViewInit(): void {
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
      const features: Feature[] = (data.features || []).filter(
        (f) => normalize((f.properties as any)?.COMMUNE) === target
      );

      if (!features.length) {
        console.error('❌ Laâyoune not found in GeoJSON');
        return;
      }

      const laayouneFC: FeatureCollection = { type: 'FeatureCollection', features };

      // Draw commune polygon
      const laayouneLayer = L.geoJSON(laayouneFC as any, {
        style: {
          color: '#263238',
          weight: 3,
          fillColor: '#f2b6b6',
          fillOpacity: 0.9
        }
      }).addTo(this.map);

      // Extract polygon latlngs
      const leafLayer: any = laayouneLayer.getLayers()[0];
      this.communePolygonLatLngs = leafLayer.getLatLngs();

      // Label
      const bounds = (laayouneLayer as any).getBounds();
      L.tooltip({ permanent: true, direction: 'center', className: 'commune-label' })
        .setContent('العيون')
        .setLatLng(bounds.getCenter())
        .addTo(this.map);

      this.map.fitBounds(bounds, { padding: [40, 40] });
      setTimeout(() => this.map.invalidateSize(), 0);

      // Load all projects (hidden)
      this.loadAllProjects();
    });
  }

  ngOnDestroy(): void {
    if (this.map) this.map.remove();
  }

  goToProvince() {
    this.router.navigate(['/province']);
  }

  // ✅ fermer le dropdown si tu cliques ailleurs (MAIS garder le projet affiché)
  @HostListener('document:click')
  onDocClick() {
    this.openMenu = null;
  }

  /* =========================
     ✅ ICÔNES DES BOUTONS (comme province)
     - si projet sélectionné => check-circle-fill
     - sinon icône normale
  ========================= */
  hasActive(menu: MenuKey): boolean {
    if (menu === 'sante') return this.activeSanteProject !== null;
    if (menu === 'education') return this.activeEducationProject !== null;
    if (menu === 'eau') return this.activeEauProject !== null;
    if (menu === 'emploi') return this.activeEmploiProject !== null;
    if (menu === 'mise') return this.activeMiseProject !== null;
    return false;
  }

  getMenuLeftIcon(menu: MenuKey): string {
    if (this.hasActive(menu)) return 'bi-check-circle-fill';

    const normal: Record<MenuKey, string> = {
      sante: 'bi-hospital',
      education: 'bi-mortarboard',
      eau: 'bi-droplet',
      emploi: 'bi-briefcase',
      mise: 'bi-tools'
    };
    return normal[menu];
  }

  // =========================
  // ✅ MENU (click)
  // =========================
  toggleMenu(key: MenuKey, ev?: MouseEvent) {
    ev?.stopPropagation();
    this.openMenu = this.openMenu === key ? null : key;
  }

  // ✅ Masquer uniquement CE menu (comme province) : retire layer + reset icône/couleur
  hideMenu(menu: MenuKey, ev?: MouseEvent) {
    ev?.stopPropagation();

    if (menu === 'sante') this.hideAllSanteProjects();
    if (menu === 'education') this.hideAllEducationProjects();
    if (menu === 'eau') this.hideAllEauProjects();
    if (menu === 'emploi') this.hideAllEmploiProjects();
    if (menu === 'mise') this.hideAllMiseProjects();

    this.openMenu = null;
  }

  // ✅ sélectionner projet : afficher layer + fermer dropdown (bouton reste actif)
  selectSante(p: SanteProject, ev?: MouseEvent) { ev?.stopPropagation(); this.showSante(p); this.openMenu = null; }
  selectEducation(p: EducationProject, ev?: MouseEvent) { ev?.stopPropagation(); this.showEducation(p); this.openMenu = null; }
  selectEau(p: EauProject, ev?: MouseEvent) { ev?.stopPropagation(); this.showEau(p); this.openMenu = null; }
  selectEmploi(p: EmploiProject, ev?: MouseEvent) { ev?.stopPropagation(); this.showEmploi(p); this.openMenu = null; }
  selectMise(p: MiseProject, ev?: MouseEvent) { ev?.stopPropagation(); this.showMise(p); this.openMenu = null; }

  // ======================================================
  // ✅ LOAD ALL PROJECTS
  // ======================================================
  private loadAllProjects() {
    // ---------- SANTÉ ----------
    this.mapService.getCHRs().subscribe((fc: any) =>
      this.addFilteredPointsToLayer(fc, this.santeNouveauxLayer, this.hopitauxExistantsIcon, 'Extension CHR')
    );
    (this.mapService as any).getCHR2s?.().subscribe((fc: any) =>
      this.addFilteredPointsToLayer(fc, this.santeNouveauxLayer, this.hopitauxExistantsIcon, 'Construction ESSP - Douirat')
    );
    (this.mapService as any).getCHR3s?.().subscribe((fc: any) =>
      this.addFilteredPointsToLayer(fc, this.santeNouveauxLayer, this.hopitauxExistantsIcon, 'UCCV – Hôpital Hassan II')
    );

    this.mapService.getSanteExistants().subscribe((fc: any) =>
      this.addFilteredPointsToLayer(fc, this.santeHopitauxLayer, this.chrIcon, 'Centre de santé')
    );

    (this.mapService as any).getSanteESSPExistants?.().subscribe((fc: any) =>
      this.addFilteredPointsToLayer(fc, this.santeESSPLayer, this.chrIcon, 'ESSP existant')
    );

    (this.mapService as any).getZoneDouirat?.().subscribe((fc: any) => {
      this.buildFilteredPolygonLayer(fc, 'Zone Douirat', '#22c55e').addTo(this.santeDouiratLayer);
    });

    // ---------- EDUCATION ----------
    this.mapService.getEducationExistants1().subscribe((fc: any) =>
      this.addFilteredPointsToLayer(fc, this.education1Layer, this.educationIcon, 'Education 1')
    );
    this.mapService.getEducationExistants2().subscribe((fc: any) =>
      this.addFilteredPointsToLayer(fc, this.education2Layer, this.educationIcon, 'Education 2')
    );
    this.mapService.getEducationExistants3().subscribe((fc: any) =>
      this.addFilteredPointsToLayer(fc, this.education3Layer, this.educationIcon, 'Education 3')
    );
    this.mapService.getEducationExistants4().subscribe((fc: any) =>
      this.addFilteredPointsToLayer(fc, this.education4Layer, this.educationIcon, 'Education 4')
    );

    // ---------- EAU ----------
    (this.mapService as any).getEauPotable7?.().subscribe((fc: any) =>
      this.buildFilteredPolygonLayer(fc, 'P1 – Eau potable', '#ef4444').addTo(this.eauP1Layer)
    );
    (this.mapService as any).getEauPotable6?.().subscribe((fc: any) =>
      this.buildFilteredPolygonLayer(fc, 'P2 – Eau potable', '#ef4444').addTo(this.eauP2Layer)
    );
    (this.mapService as any).getEauPotable5?.().subscribe((fc: any) =>
      this.buildFilteredPolygonLayer(fc, 'P3 – Eau potable', '#ef4444').addTo(this.eauP3Layer)
    );
    (this.mapService as any).getEauPotable4?.().subscribe((fc: any) =>
      this.buildFilteredPolygonLayer(fc, 'P4 – Eau potable', '#ef4444').addTo(this.eauP4Layer)
    );
    (this.mapService as any).getEauPotable3?.().subscribe((fc: any) =>
      this.buildFilteredPolygonLayer(fc, 'P5 – Stockage d’eau', '#ef4444').addTo(this.eauP5Layer)
    );
    (this.mapService as any).getEauPotable2?.().subscribe((fc: any) =>
      this.buildFilteredPolygonLayer(fc, 'P6 – Assainissement', '#ef4444').addTo(this.eauP6Layer)
    );

    // ---------- EMPLOI ----------
    this.mapService.getEmploi1().subscribe((fc: any) =>
      this.addFilteredPointsToLayer(fc, this.emploiPointsLayer, this.emploiIcon, 'Emploi')
    );

    (this.mapService as any).getEmploiZone1?.().subscribe((fc: any) =>
      this.buildFilteredPolygonLayer(fc, "Extension zone d’activité", '#f59e0b').addTo(this.emploiZone1Layer)
    );
    (this.mapService as any).getEmploiZoneHizam?.().subscribe((fc: any) =>
      this.buildFilteredPolygonLayer(fc, "Zone d’activité Al Hizam", '#f59e0b').addTo(this.emploiHizamLayer)
    );
    (this.mapService as any).getAtelierArtisonaux?.().subscribe((fc: any) =>
      this.buildFilteredPolygonLayer(fc, "Ateliers artisanaux", '#f59e0b').addTo(this.emploiAteliersLayer)
    );
    (this.mapService as any).getSitesTouristiques?.().subscribe((fc: any) =>
      this.buildFilteredPolygonLayer(fc, "Sites touristiques", '#f59e0b').addTo(this.emploiSitesLayer)
    );

    // ---------- MISE ----------
    this.mapService.getMise1().subscribe((fc: any) =>
      this.addFilteredPointsToLayer(fc, this.mise1Layer, this.miseIcon, 'Mise à niveau 1')
    );
    this.mapService.getMise2().subscribe((fc: any) =>
      this.addFilteredPointsToLayer(fc, this.mise2Layer, this.miseIcon, 'Mise à niveau 2')
    );
    this.mapService.getMise3().subscribe((fc: any) =>
      this.addFilteredPointsToLayer(fc, this.mise3Layer, this.miseIcon, 'Mise à niveau 3')
    );
  }

  // ======================================================
  // ✅ FILTER POINTS INSIDE COMMUNE
  // ======================================================
  private addFilteredPointsToLayer(
    fc: FeatureCollection,
    targetLayer: L.LayerGroup,
    icon: L.Icon,
    label: string
  ) {
    if (!fc?.features?.length) return;

    const kept: Feature[] = [];

    for (const f of fc.features as Feature[]) {
      if (!f.geometry || f.geometry.type !== 'Point') continue;
      const coords = f.geometry.coordinates as any;
      const ll = this.toLatLngAuto(coords);

      if (this.isLatLngInsideCommune(ll.lat, ll.lng)) kept.push(f);
    }

    if (!kept.length) return;

    const filteredFC: FeatureCollection = { type: 'FeatureCollection', features: kept };

    L.geoJSON(filteredFC as any, {
      coordsToLatLng: (coords: any) => this.toLatLngAuto(coords),
      pointToLayer: (_feature, latlng) => L.marker(latlng, { icon }),
      onEachFeature: (feature, layer) => {
        const props: any = feature.properties || {};
        const nom = props.nom || props.name || props.type || props.Hopital || props.ESSP || '';
        layer.bindPopup(`<b>${this.escapeHtml(label)}</b><br>${this.escapeHtml(nom)}`);
      }
    }).addTo(targetLayer);
  }

  // ======================================================
  // ✅ FILTER POLYGONS INSIDE COMMUNE (centroid test)
  // ======================================================
  private buildFilteredPolygonLayer(fc: FeatureCollection, title: string, fillColor = '#ef4444'): L.GeoJSON {
    const kept: Feature[] = [];

    for (const f of (fc?.features || []) as Feature[]) {
      if (!f.geometry) continue;
      const c = this.getGeometryCentroidLatLng(f.geometry);
      if (!c) continue;

      if (this.isLatLngInsideCommune(c.lat, c.lng)) kept.push(f);
    }

    const filteredFC: FeatureCollection = { type: 'FeatureCollection', features: kept };

    return L.geoJSON(filteredFC as any, {
      coordsToLatLng: (coords: any) => this.toLatLngAuto(coords),
      style: () => ({
        color: '#ffffff',
        weight: 3,
        dashArray: '8 6',
        fillColor,
        fillOpacity: 0.22
      }),
      onEachFeature: (feature: any, layer) => {
        const p = feature?.properties || {};
        const img = p?.Lien_Image ? String(p.Lien_Image) : '';

        const html = `
          <div style="min-width:220px">
            <div style="font-weight:800; margin-bottom:6px">${this.escapeHtml(title)}</div>
            <div style="font-size:12px; opacity:.85; margin-bottom:8px">
              Début: ${this.escapeHtml(p?.begin)} &nbsp;|&nbsp; Fin: ${this.escapeHtml(p?.end)}
            </div>
            ${
              img
                ? `<img src="assets/${this.escapeHtml(img)}"
                        style="width:100%; max-width:280px; border-radius:12px; display:block"
                        onerror="this.style.display='none'"/>`
                : ''
            }
          </div>
        `;
        (layer as any).bindPopup(html);

        (layer as any).on('mouseover', () => {
          (layer as any).setStyle?.({ fillOpacity: 0.35, weight: 4 });
          (layer as any).bringToFront?.();
        });
        (layer as any).on('mouseout', () => {
          (layer as any).setStyle?.({ fillOpacity: 0.22, weight: 3 });
        });
      }
    });
  }

  private getGeometryCentroidLatLng(geom: Geometry): L.LatLng | null {
    const avgOf = (pts: L.LatLng[]) => {
      if (!pts.length) return null;
      const s = pts.reduce((acc, p) => ({ lat: acc.lat + p.lat, lng: acc.lng + p.lng }), { lat: 0, lng: 0 });
      return L.latLng(s.lat / pts.length, s.lng / pts.length);
    };

    if (geom.type === 'Polygon') {
      const ring = (geom.coordinates?.[0] || []).map((c: any) => this.toLatLngAuto(c));
      return avgOf(ring);
    }

    if (geom.type === 'MultiPolygon') {
      const ring = (geom.coordinates?.[0]?.[0] || []).map((c: any) => this.toLatLngAuto(c));
      return avgOf(ring);
    }

    return null;
  }

  // =========================
  // ✅ Point-in-polygon
  // =========================
  private isLatLngInsideCommune(lat: number, lng: number): boolean {
    const p = L.latLng(lat, lng);

    const polyAny: any = L.polygon(this.communePolygonLatLngs as any);
    if (!polyAny.getBounds().contains(p)) return false;

    const rings = this.flattenRings(this.communePolygonLatLngs as any);
    return rings.some((ring) => this.pointInRing(p, ring));
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
        (yi > p.lat) !== (yj > p.lat) &&
        (p.lng < ((xj - xi) * (p.lat - yi)) / (yj - yi + 0.0) + xi);

      if (intersect) inside = !inside;
    }
    return inside;
  }

  // ======================================================
  // ✅ SHOW/HIDE PROJECTS (affichage sur la map)
  // ======================================================
  showSante(project: SanteProject) {
    if (!this.map) return;
    this.hideAllSanteProjects();

    const layer = {
      NOUVEAUX: this.santeNouveauxLayer,
      HOPITAUX_EXISTANTS: this.santeHopitauxLayer,
      ESSP_EXISTANTS: this.santeESSPLayer,
      DOUIRAT: this.santeDouiratLayer
    }[project];

    layer.addTo(this.map);
    this.activeSanteProject = project;
  }

  private hideAllSanteProjects() {
    if (!this.map) return;
    this.map.removeLayer(this.santeNouveauxLayer);
    this.map.removeLayer(this.santeHopitauxLayer);
    this.map.removeLayer(this.santeESSPLayer);
    this.map.removeLayer(this.santeDouiratLayer);
    this.activeSanteProject = null;
  }

  showEducation(project: EducationProject) {
    if (!this.map) return;
    this.hideAllEducationProjects();

    const layer = {
      E1: this.education1Layer,
      E2: this.education2Layer,
      E3: this.education3Layer,
      E4: this.education4Layer
    }[project];

    layer.addTo(this.map);
    this.activeEducationProject = project;
  }

  private hideAllEducationProjects() {
    if (!this.map) return;
    this.map.removeLayer(this.education1Layer);
    this.map.removeLayer(this.education2Layer);
    this.map.removeLayer(this.education3Layer);
    this.map.removeLayer(this.education4Layer);
    this.activeEducationProject = null;
  }

  showEau(project: EauProject) {
    if (!this.map) return;
    this.hideAllEauProjects();

    const layer = {
      P1: this.eauP1Layer,
      P2: this.eauP2Layer,
      P3: this.eauP3Layer,
      P4: this.eauP4Layer,
      P5: this.eauP5Layer,
      P6: this.eauP6Layer
    }[project];

    layer.addTo(this.map);
    this.activeEauProject = project;
  }

  private hideAllEauProjects() {
    if (!this.map) return;
    this.map.removeLayer(this.eauP1Layer);
    this.map.removeLayer(this.eauP2Layer);
    this.map.removeLayer(this.eauP3Layer);
    this.map.removeLayer(this.eauP4Layer);
    this.map.removeLayer(this.eauP5Layer);
    this.map.removeLayer(this.eauP6Layer);
    this.activeEauProject = null;
  }

  showEmploi(project: EmploiProject) {
    if (!this.map) return;
    this.hideAllEmploiProjects();

    const layer = {
      POINTS: this.emploiPointsLayer,
      ZONE1: this.emploiZone1Layer,
      HIZAM: this.emploiHizamLayer,
      ATELIERS: this.emploiAteliersLayer,
      SITES: this.emploiSitesLayer
    }[project];

    layer.addTo(this.map);
    this.activeEmploiProject = project;
  }

  private hideAllEmploiProjects() {
    if (!this.map) return;
    this.map.removeLayer(this.emploiPointsLayer);
    this.map.removeLayer(this.emploiZone1Layer);
    this.map.removeLayer(this.emploiHizamLayer);
    this.map.removeLayer(this.emploiAteliersLayer);
    this.map.removeLayer(this.emploiSitesLayer);
    this.activeEmploiProject = null;
  }

  showMise(project: MiseProject) {
    if (!this.map) return;
    this.hideAllMiseProjects();

    const layer = {
      M1: this.mise1Layer,
      M2: this.mise2Layer,
      M3: this.mise3Layer
    }[project];

    layer.addTo(this.map);
    this.activeMiseProject = project;
  }

  private hideAllMiseProjects() {
    if (!this.map) return;
    this.map.removeLayer(this.mise1Layer);
    this.map.removeLayer(this.mise2Layer);
    this.map.removeLayer(this.mise3Layer);
    this.activeMiseProject = null;
  }
}
