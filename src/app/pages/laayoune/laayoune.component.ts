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

type MenuKey = 'emploi' | 'eau' | 'sante' | 'education' | 'mise' | 'routes';

type SanteProject =
  | 'TOUT'
  | 'TOUT_EXISTANTS'
  | 'NOUVEAUX'
  | 'HOPITAUX_EXISTANTS'
  | 'ESSP_EXISTANTS'
  | 'DOUIRAT';
type EducationProject = 'E1' | 'E2' | 'E3' | 'E4';
type EauProject = 'TOUT' | 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6' | 'P7';
type EmploiProject = 'TOUT' | 'ZONE1' | 'HIZAM' | 'ATELIERS' | 'SITES' | 'POINTS';
type MiseProject = 'M1' | 'M2' | 'M3';
type RoutesProject = 'R1';

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

  private communePolygonLatLngs:
    | L.LatLngExpression[]
    | L.LatLngExpression[][]
    | L.LatLngExpression[][][] = [];

  openMenu: MenuKey | null = null;

  activeSanteProject: SanteProject | null = null;
  activeEducationProject: EducationProject | null = null;
  showEducationAll = false;
  showEducationOverlay = false;
  activeEauProject: EauProject | null = null;
  showEauOverlay = false;
  activeEmploiProject: EmploiProject | null = null;
  showEmploiOverlay = false;
  activeMiseProject: MiseProject | null = null;
  showMiseOverlay = false;
  activeRoutesProject: RoutesProject | null = null;

  showSanteActive = false;
  showEmploiActive = false;
  showEauActive = false;
  showSanteOverlay = false;

  santeNouveauxCount = 0;
  santeHopitauxCount = 0;
  santeESSPCount = 0;
  santeDouiratCount = 0;

  emploiZone1Count = 0;
  emploiHizamCount = 0;
  emploiAteliersCount = 0;
  emploiSitesCount = 0;
  emploiPointsCount = 0;

  eauP1Count = 0;
  eauP2Count = 0;
  eauP3Count = 0;
  eauP4Count = 0;
  eauP5Count = 0;
  eauP6Count = 0;
  eauP7Count = 0;

  get santeTotalCount(): number {
    return this.santeNouveauxCount + this.santeHopitauxCount + this.santeESSPCount + this.santeDouiratCount;
  }

  get emploiTotalCount(): number {
    return this.emploiZone1Count + this.emploiHizamCount + this.emploiAteliersCount + this.emploiSitesCount + this.emploiPointsCount;
  }

  get eauTotalCount(): number {
    return this.eauP1Count + this.eauP2Count + this.eauP3Count + this.eauP4Count + this.eauP5Count + this.eauP6Count + this.eauP7Count;
  }

  // Santé
  santeNouveauxLayer = L.layerGroup();
  santeHopitauxLayer = L.layerGroup();
  santeESSPLayer = L.layerGroup();
  santeDouiratLayer = L.layerGroup();
  santeAp1Layer = L.layerGroup();
  santeAp2Layer = L.layerGroup();
  santeAp3Layer = L.layerGroup();
  santeAp4Layer = L.layerGroup();
  activeSanteAp: 'AP1' | 'AP2' | 'AP3' | 'AP4' | null = null;

  // Education
  education1Layer = L.layerGroup();
  education2Layer = L.layerGroup();
  education3Layer = L.layerGroup();
  education4Layer = L.layerGroup();
  educationAp1Layer = L.layerGroup();
  educationAp2Layer = L.layerGroup();
  educationAp3Layer = L.layerGroup();
  educationAp4Layer = L.layerGroup();
  educationAp5Layer = L.layerGroup();
  educationAp6Layer = L.layerGroup();
  activeEducationAp: 'AP1' | 'AP2' | 'AP3' | 'AP4' | 'AP5' | 'AP6' | null = null;

  // Eau potable
  eauP1Layer = L.layerGroup();
  eauP2Layer = L.layerGroup();
  eauP3Layer = L.layerGroup();
  eauP4Layer = L.layerGroup();
  eauP5Layer = L.layerGroup();
  eauP6Layer = L.layerGroup();
  eauP7Layer = L.layerGroup();
  eauAp1Layer = L.layerGroup();
  eauAp3Layer = L.layerGroup();
  eauAp6Layer = L.layerGroup();
  activeEauAp: 'AP1' | 'AP3' | 'AP6' | null = null;

  // Emploi
  emploiPointsLayer = L.layerGroup();
  emploiZone1Layer = L.layerGroup();
  emploiHizamLayer = L.layerGroup();
  emploiAteliersLayer = L.layerGroup();
  emploiSitesLayer = L.layerGroup();
  emploiAp1Layer = L.layerGroup();
  emploiAp2Layer = L.layerGroup();
  emploiAp3Layer = L.layerGroup();
  emploiAp4Layer = L.layerGroup();
  emploiAp5Layer = L.layerGroup();
  activeEmploiAp: 'AP1' | 'AP2' | 'AP3' | 'AP4' | 'AP5' | null = null;

  // Mise
  mise1Layer = L.layerGroup();
  mise2Layer = L.layerGroup();
  mise3Layer = L.layerGroup();
  miseAp1Layer = L.layerGroup();
  miseAp2Layer = L.layerGroup();
  activeMiseAp: 'AP1' | 'AP2' | null = null;

  // Routes
  routesLaayouneLayer = L.layerGroup();

  constructor(
    private mapService: UserProfileService,
    private router: Router
  ) {}

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

  hopitalIcon = L.icon({
    iconUrl: 'assets/icons/hospitale.png',
    iconSize: [32, 32],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28]
  });

  hopital1Icon = L.icon({
    iconUrl: 'assets/icons/hopital1.png',
    iconSize: [32, 32],
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

  private readonly CRS_26194 =
    '+proj=lcc +lat_1=26.1 +lat_0=26.1 +lon_0=-5.4 +k_0=0.999616304 ' +
    '+x_0=1200000 +y_0=400000 +ellps=clrk80ign +towgs84=31,146,47,0,0,0,0 ' +
    '+units=m +no_defs';

  private toLatLngAuto(coords: any): L.LatLng {
    const x = Number(coords[0]);
    const y = Number(coords[1]);

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

      const laayouneLayer = L.geoJSON(laayouneFC as any, {
        style: {
          color: '#263238',
          weight: 3,
          fillColor: '#f2b6b6',
          fillOpacity: 0.9
        }
      }).addTo(this.map);

      const leafLayer: any = laayouneLayer.getLayers()[0];
      this.communePolygonLatLngs = leafLayer.getLatLngs();

      const bounds = (laayouneLayer as any).getBounds();
      L.tooltip({ permanent: true, direction: 'center', className: 'commune-label' })
        .setContent('Laâyoune')
        .setLatLng(bounds.getCenter())
        .addTo(this.map);

      this.map.fitBounds(bounds, { padding: [5, 5] });
      setTimeout(() => this.map.invalidateSize(), 0);

      this.loadAllProjects();
    });
  }

  ngOnDestroy(): void {
    if (this.map) this.map.remove();
  }

  goToProvince() {
    this.router.navigate(['/provinceLaayoune']);
  }

  @HostListener('document:click')
  onDocClick() {
    this.openMenu = null;
  }

  hasActive(menu: MenuKey): boolean {
    if (menu === 'sante') return this.activeSanteProject !== null;
    if (menu === 'education') {
      return this.activeEducationProject !== null || this.showEducationAll || this.showEducationOverlay;
    }
    if (menu === 'eau') return this.activeEauProject !== null || this.showEauOverlay;
    if (menu === 'emploi') return this.activeEmploiProject !== null || this.showEmploiOverlay;
    if (menu === 'mise') return this.activeMiseProject !== null || this.showMiseOverlay;
    if (menu === 'routes') return this.activeRoutesProject !== null;
    return false;
  }

  getMenuLeftIcon(menu: MenuKey): string {
    if (this.hasActive(menu)) return 'bi-check-circle-fill';

    const normal: Record<MenuKey, string> = {
      sante: 'bi-hospital',
      education: 'bi-mortarboard',
      eau: 'bi-droplet',
      emploi: 'bi-briefcase',
      mise: 'bi-tools',
      routes: 'bi-signpost-2'
    };
    return normal[menu];
  }

  toggleMenu(key: MenuKey, ev?: MouseEvent) {
    ev?.stopPropagation();
    this.openMenu = this.openMenu === key ? null : key;
  }

  hideMenu(menu: MenuKey, ev?: MouseEvent) {
    ev?.stopPropagation();

    if (menu === 'sante') this.hideAllSanteProjects();
    if (menu === 'education') this.hideAllEducationProjects();
    if (menu === 'eau') this.hideAllEauProjects();
    if (menu === 'emploi') this.hideAllEmploiProjects();
    if (menu === 'mise') this.hideAllMiseProjects();
    if (menu === 'routes') this.hideAllRoutesProjects();

    this.openMenu = null;
  }

  toggleSanteMode(ev?: MouseEvent) {
    ev?.stopPropagation();
    this.showSanteActive = !this.showSanteActive;
    if (this.showSanteActive) {
      this.showEmploiActive = false;
      this.showEauActive = false;
      this.hideAllEmploiProjects();
      this.hideAllEauProjects();
      this.openMenu = null;
    } else {
      this.hideAllSanteProjects();
    }
  }

  toggleEmploiMode(ev?: MouseEvent) {
    ev?.stopPropagation();
    this.showEmploiActive = !this.showEmploiActive;
    if (this.showEmploiActive) {
      this.showSanteActive = false;
      this.showEauActive = false;
      this.hideAllSanteProjects();
      this.hideAllEauProjects();
      this.openMenu = null;
    } else {
      this.hideAllEmploiProjects();
    }
  }

  toggleEauMode(ev?: MouseEvent) {
    ev?.stopPropagation();
    this.showEauActive = !this.showEauActive;
    if (this.showEauActive) {
      this.showSanteActive = false;
      this.showEmploiActive = false;
      this.hideAllSanteProjects();
      this.hideAllEmploiProjects();
      this.openMenu = null;
    } else {
      this.hideAllEauProjects();
    }
  }

  showAllSanteProjects() { this.showSante('TOUT'); }
  showAllEmploiProjects() { this.showEmploi('TOUT'); }
  showAllEauProjects() { this.showEau('TOUT'); }

  selectSante(p: SanteProject, ev?: MouseEvent) { ev?.stopPropagation(); this.showSante(p); this.openMenu = null; }
  selectEducation(p: EducationProject, ev?: MouseEvent) { ev?.stopPropagation(); this.showEducation(p); this.openMenu = null; }
  selectEau(p: EauProject, ev?: MouseEvent) { ev?.stopPropagation(); this.showEau(p); this.openMenu = null; }
  selectEmploi(p: EmploiProject, ev?: MouseEvent) { ev?.stopPropagation(); this.showEmploi(p); this.openMenu = null; }
  selectMise(p: MiseProject, ev?: MouseEvent) { ev?.stopPropagation(); this.showMise(p); this.openMenu = null; }
  selectRoutes(p: RoutesProject, ev?: MouseEvent) { ev?.stopPropagation(); this.showRoutes(p); this.openMenu = null; }

  private loadAllProjects() {
    // ---------- SANTÉ ----------
  // ---------- SANTÉ EXISTANTS VERSION 3 ----------
(this.mapService as any).getExistantsLaayouneESSP?.().subscribe((fc: any) => {
  this.santeESSPCount = this.addFilteredPointsToLayer(
    fc,
    this.santeESSPLayer,
    this.chrIcon,
    'ESSP existant'
  );
});

(this.mapService as any).getExistantsCentreRegionalOncologie?.().subscribe((fc: any) => {
  this.santeHopitauxCount += this.addFilteredPointsToLayer(
    fc,
    this.santeHopitauxLayer,
    this.hopital1Icon,
    'Centre Régional d’Oncologie'
  );
});

(this.mapService as any).getExistantsChu?.().subscribe((fc: any) => {
  this.santeHopitauxCount += this.addFilteredPointsToLayer(
    fc,
    this.santeHopitauxLayer,
    this.hopital1Icon,
    'CHU'
  );
});

(this.mapService as any).getExistantsHassanBelmehdi?.().subscribe((fc: any) => {
  this.santeHopitauxCount += this.addFilteredPointsToLayer(
    fc,
    this.santeHopitauxLayer,
    this.hopital1Icon,
    'Hôpital Hassan Ben Al Mehdi'
  );
});

(this.mapService as any).getExistantsHassan2?.().subscribe((fc: any) => {
  this.santeHopitauxCount += this.addFilteredPointsToLayer(
    fc,
    this.santeHopitauxLayer,
    this.hopital1Icon,
    'Hôpital Hassan II'
  );
});

(this.mapService as any).getExistantsHassanMilitaireHassan2?.().subscribe((fc: any) => {
  this.santeHopitauxCount += this.addFilteredPointsToLayer(
    fc,
    this.santeHopitauxLayer,
    this.hopital1Icon,
    'Hôpital Militaire Hassan II'
  );
});

// ---------- NOUVEAUX LAAYOUNE SANTE (AP) ----------
(this.mapService as any).getNouveauxLaayouneSanteAP1?.().subscribe((fc: any) => {
  this.addFilteredPointsToLayer(
    fc,
    this.santeAp1Layer,
    this.hopitalIcon,
    'AP1 : Construction et équipement du ESSP (CSU-1) Douirat'
  );
});
(this.mapService as any).getNouveauxLaayouneSanteAP2?.().subscribe((fc: any) => {
  this.addFilteredPointsToLayer(
    fc,
    this.santeAp2Layer,
    this.hopitalIcon,
    'AP2 : Équipement de l’hôpital Hassan II'
  );
});
(this.mapService as any).getNouveauxLaayouneSanteAP3?.().subscribe((fc: any) => {
  this.addFilteredPointsToLayer(
    fc,
    this.santeAp3Layer,
    this.hopitalIcon,
    'AP3 : Extension et équipement du CHR'
  );
});
(this.mapService as any).getNouveauxLaayouneSanteAP4?.().subscribe((fc: any) => {
  this.addFilteredPointsToLayer(
    fc,
    this.santeAp4Layer,
    this.hopitalIcon,
    'AP4 : Aménagement et équipement UCCV - CHR'
  );
});

    // ---------- EDUCATION ----------
    (this.mapService as any).getExistantsLaayouneEducationPrimaires?.().subscribe((fc: any) =>
      this.addFilteredPointsToLayer(
        fc,
        this.education1Layer,
        this.educationIcon,
        'Écoles primaires'
      )
    );
    (this.mapService as any).getExistantsLaayouneEducationPrescolaires?.().subscribe((fc: any) =>
      this.addFilteredPointsToLayer(
        fc,
        this.education1Layer,
        this.educationIcon,
        'Préscolaire'
      )
    );
    (this.mapService as any).getExistantsLaayouneEducationColleges?.().subscribe((fc: any) =>
      this.addFilteredPointsToLayer(
        fc,
        this.education2Layer,
        this.educationIcon,
        'Lycées collégiaux'
      )
    );
    (this.mapService as any).getExistantsLaayouneEducationQualifiant?.().subscribe((fc: any) =>
      this.addFilteredPointsToLayer(
        fc,
        this.education3Layer,
        this.educationIcon,
        'Lycées qualifiants'
      )
    );
    (this.mapService as any).getExistantsLaayouneEducationSuperieur?.().subscribe((fc: any) =>
      this.addFilteredPointsToLayer(
        fc,
        this.education4Layer,
        this.educationIcon,
        'Établissements supérieurs'
      )
    );

    // ---------- NOUVEAUX LAAYOUNE EDUCATION (AP) ----------
    (this.mapService as any).getNouveauxLaayouneCollegeAP1?.().subscribe((fc: any) =>
      this.buildFilteredPolygonLayer(
        fc,
        'AP1 : Construction lycée collégial (Lot Al Khayr)',
        '#16a34a'
      ).addTo(this.educationAp1Layer)
    );
    (this.mapService as any).getNouveauxLaayounePrimaireAP2?.().subscribe((fc: any) =>
      this.buildFilteredPolygonLayer(
        fc,
        'AP2 : Construction 1ère école primaire (Lot Addoha)',
        '#16a34a'
      ).addTo(this.educationAp2Layer)
    );
    (this.mapService as any).getNouveauxLaayounePrimaireAP3?.().subscribe((fc: any) =>
      this.buildFilteredPolygonLayer(
        fc,
        'AP3 : Construction école primaire (Lot ATTADAMONE)',
        '#16a34a'
      ).addTo(this.educationAp3Layer)
    );
    (this.mapService as any).getNouveauxLaayounePrimaireAP4?.().subscribe((fc: any) =>
      this.buildFilteredPolygonLayer(
        fc,
        'AP4 : Construction 2ème école primaire (Lot Addoha)',
        '#16a34a'
      ).addTo(this.educationAp4Layer)
    );
    (this.mapService as any).getNouveauxLaayouneCollegeAP5?.().subscribe((fc: any) =>
      this.buildFilteredPolygonLayer(
        fc,
        'AP5 : Construction lycée collégial (Lot ATTADAMONE)',
        '#16a34a'
      ).addTo(this.educationAp5Layer)
    );
    (this.mapService as any).getNouveauxLaayouneQualifiantAP6?.().subscribe((fc: any) =>
      this.buildFilteredPolygonLayer(
        fc,
        'AP6 : Construction lycée qualifiant (Lot ATTADAMONE)',
        '#16a34a'
      ).addTo(this.educationAp6Layer)
    );

    // ---------- EAU ----------
    (this.mapService as any).getEauPotable7?.().subscribe((fc: any) =>
      this.buildFilteredPolygonLayer(fc, 'P1 – Réhabilitation du réseau AEP', '#ef4444', (n) => (this.eauP1Count = n))
        .addTo(this.eauP1Layer)
    );
    (this.mapService as any).getEauPotable6?.().subscribe((fc: any) =>
      this.buildFilteredPolygonLayer(fc, 'P2 – AEP – Zone Industrielle El Marsa', '#ef4444', (n) => (this.eauP2Count = n))
        .addTo(this.eauP2Layer)
    );
    (this.mapService as any).getEauPotable5?.().subscribe((fc: any) =>
      this.buildFilteredPolygonLayer(fc, 'P3 – STEP – Zone Industrielle El Marsa', '#ef4444', (n) => (this.eauP3Count = n))
        .addTo(this.eauP3Layer)
    );
    (this.mapService as any).getEauPotable4?.().subscribe((fc: any) =>
      this.buildFilteredPolygonLayer(fc, 'P4 – Assainissement – Ville de Laâyoune', '#ef4444', (n) => (this.eauP4Count = n))
        .addTo(this.eauP4Layer)
    );
    (this.mapService as any).getEauPotable3?.().subscribe((fc: any) =>
      this.buildFilteredPolygonLayer(fc, 'P5 – Renforcement du stockage d’eau', '#ef4444', (n) => (this.eauP5Count = n))
        .addTo(this.eauP5Layer)
    );
    (this.mapService as any).getEauPotable2?.().subscribe((fc: any) =>
      this.buildFilteredPolygonLayer(fc, 'P6 – Assainissement – Foum El Oued', '#ef4444', (n) => (this.eauP6Count = n))
        .addTo(this.eauP6Layer)
    );
    (this.mapService as any).getEauPotable?.().subscribe((fc: any) =>
      this.buildFilteredPolygonLayer(fc, 'P7 – Extension de la station de dessalement', '#ef4444', (n) => (this.eauP7Count = n))
        .addTo(this.eauP7Layer)
    );

    // ---------- NOUVEAUX LAAYOUNE EAU (AP) ----------
    (this.mapService as any).getNouveauxLaayouneAP1?.().subscribe((fc: any) =>
      this.buildFilteredPolygonLayer(
        fc,
        'AP1 : Renforcement et réhabilitation des ouvrages de stockage',
        '#ef4444'
      ).addTo(this.eauAp1Layer)
    );
    (this.mapService as any).getNouveauxLaayouneAP3?.().subscribe((fc: any) =>
      this.buildFilteredPolygonLayer(
        fc,
        "AP3 : Mise à niveau et extension des ouvrages d'assainissement liquide 2ème tranche",
        '#ef4444'
      ).addTo(this.eauAp3Layer)
    );
    (this.mapService as any).getNouveauxLaayouneAP6?.().subscribe((fc: any) =>
      this.buildFilteredPolygonLayer(
        fc,
        'AP6 : Réhabilitation du réseau AEP',
        '#ef4444'
      ).addTo(this.eauAp6Layer)
    );

    // ---------- EMPLOI ----------
    this.mapService.getEmploi1().subscribe((fc: any) => {
      this.emploiPointsCount = this.addFilteredPointsToLayer(fc, this.emploiPointsLayer, this.emploiIcon, 'Emploi');
    });

    (this.mapService as any).getEmploiZone1?.().subscribe((fc: any) =>
      this.buildFilteredPolygonLayer(fc, "Extension zone d’activité", '#f59e0b', (n) => (this.emploiZone1Count = n))
        .addTo(this.emploiZone1Layer)
    );
    (this.mapService as any).getEmploiZoneHizam?.().subscribe((fc: any) =>
      this.buildFilteredPolygonLayer(fc, "Zone d’activité Al Hizam", '#f59e0b', (n) => (this.emploiHizamCount = n))
        .addTo(this.emploiHizamLayer)
    );
    (this.mapService as any).getAtelierArtisonaux?.().subscribe((fc: any) =>
      this.buildFilteredPolygonLayer(fc, "Ateliers artisanaux", '#f59e0b', (n) => (this.emploiAteliersCount = n))
        .addTo(this.emploiAteliersLayer)
    );
    (this.mapService as any).getSitesTouristiques?.().subscribe((fc: any) =>
      this.buildFilteredPolygonLayer(fc, "Sites touristiques", '#f59e0b', (n) => (this.emploiSitesCount = n))
        .addTo(this.emploiSitesLayer)
    );

    // ---------- NOUVEAUX LAAYOUNE EMPLOI (AP) ----------
    (this.mapService as any).getNouveauxLaayouneEmploiAP1?.().subscribe((fc: any) =>
      this.buildFilteredPolygonLayer(
        fc,
        "AP1 : Aménagement et équipement des ateliers artisanaux",
        '#f59e0b'
      ).addTo(this.emploiAp1Layer)
    );
    (this.mapService as any).getNouveauxLaayouneEmploiAP2?.().subscribe((fc: any) =>
      this.buildFilteredPolygonLayer(
        fc,
        "AP2 : Aménagement des accès touristiques 10 Km",
        '#f59e0b',
        undefined,
        true
      ).addTo(this.emploiAp2Layer)
    );
    (this.mapService as any).getNouveauxLaayouneEmploiAP3?.().subscribe((fc: any) =>
      this.buildFilteredPolygonLayer(
        fc,
        "AP3 : Restructuration zone d'activité AL Hizam (70 ha)",
        '#f59e0b'
      ).addTo(this.emploiAp3Layer)
    );
    (this.mapService as any).getNouveauxLaayouneEmploiAP4?.().subscribe((fc: any) =>
      this.buildFilteredPolygonLayer(
        fc,
        "AP4 : Extension de la zone d'activité (52,3 ha)",
        '#f59e0b'
      ).addTo(this.emploiAp4Layer)
    );
    (this.mapService as any).getNouveauxLaayouneEmploiAP5?.().subscribe((fc: any) =>
      this.buildFilteredPolygonLayer(
        fc,
        "AP5 : Viabilisation des unités de valorisation des produits agricoles",
        '#f59e0b'
      ).addTo(this.emploiAp5Layer)
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

    // ---------- NOUVEAUX LAAYOUNE MISE (AP) ----------
    (this.mapService as any).getNouveauxLaayouneMiseAP1?.().subscribe((fc: any) =>
      this.buildFilteredRoutesLayer(
        fc,
        'AP1 : Construction de la voie de contournement Est Laâyoune - 17 km',
        '#2563eb',
        true
      ).addTo(this.miseAp1Layer)
    );
    (this.mapService as any).getNouveauxLaayouneMiseAP2?.().subscribe((fc: any) =>
      this.buildFilteredRoutesLayer(
        fc,
        'AP2 : Construction et aménagement de la route de la berge Sakia El Hamra - 5 km',
        '#16a34a',
        true
      ).addTo(this.miseAp2Layer)
    );

    // ---------- ROUTES ----------
   (this.mapService as any).getRoutesLaayoune?.().subscribe((fc: any) => {
  this.buildFilteredRoutesLayer(fc, 'Routes de Laâyoune', '#000000')
    .addTo(this.routesLaayouneLayer);

  this.routesLaayouneLayer.addTo(this.map);
  this.activeRoutesProject = 'R1';
});
  }

  private addFilteredPointsToLayer(
    fc: FeatureCollection,
    targetLayer: L.LayerGroup,
    icon: L.Icon,
    label: string,
    filterFn?: (feature: Feature) => boolean
  ): number {
    if (!fc?.features?.length) return 0;

    const kept: Feature[] = [];

    for (const f of fc.features as Feature[]) {
      if (!f.geometry || f.geometry.type !== 'Point') continue;
      if (filterFn && !filterFn(f)) continue;
      const coords = f.geometry.coordinates as any;
      const ll = this.toLatLngAuto(coords);

      if (this.isLatLngInsideCommune(ll.lat, ll.lng)) kept.push(f);
    }

    if (!kept.length) return 0;

    const filteredFC: FeatureCollection = { type: 'FeatureCollection', features: kept };

    L.geoJSON(filteredFC as any, {
      coordsToLatLng: (coords: any) => this.toLatLngAuto(coords),
      pointToLayer: (_feature, latlng) => L.marker(latlng, { icon }),
      onEachFeature: (feature, layer) => {
        const props: any = feature.properties || {};
        const esspName = props['Nom ESSP'];
        if (esspName) {
          const commune = props.Commune || '';
          const typeEssp = props['Type ESSP'] || '';
          const habitantsEssp = props['Habitants/ESSP'] || '';
          layer.bindPopup(`
            <div style="min-width:240px">
              <div style="display:grid; grid-template-columns:120px 1fr; gap:6px 10px">
                <div><b>Commune</b></div>
                <div>${this.escapeHtml(commune)}</div>
                <div><b>Nom ESSP</b></div>
                <div>${this.escapeHtml(esspName)}</div>
                <div><b>Type ESSP</b></div>
                <div>${this.escapeHtml(typeEssp)}</div>
                <div><b>Habitants/ESSP</b></div>
                <div>${this.escapeHtml(habitantsEssp)}</div>
              </div>
            </div>
          `);
          return;
        }

        const nbEleves =
          props['Nombre des élèves'] ??
          props['Nombre des eleves'] ??
          props['Nombre eleves'] ??
          props['Nb élèves'] ??
          props['Nb eleves'];
        if (nbEleves !== undefined) {
          const commune = props.Commune || '';
          const nomEtablissement =
            props['Nom établissement'] ||
            props['Nom etablissement'] ||
            props.NOM_ETABL ||
            props.NOM ||
            '';
          const fille = props.Fille ?? props.Filles ?? '';
          const garcon = props.Garçon ?? props.Garcon ?? props.Garcons ?? '';
          const typeEtablissement =
            props['Type Etablissement'] ||
            props['Type établissement'] ||
            props['Type Etab'] ||
            props['Type'] ||
            '';
          layer.bindPopup(`
            <div style="min-width:240px">
              <div style="display:grid; grid-template-columns:140px 1fr; gap:6px 10px">
                <div><b>Commune</b></div>
                <div>${this.escapeHtml(commune)}</div>
                <div><b>Nom établissement</b></div>
                <div>${this.escapeHtml(nomEtablissement)}</div>
                <div><b>Nombre des élèves</b></div>
                <div>${this.escapeHtml(String(nbEleves))}</div>
                <div><b>Fille</b></div>
                <div>${this.escapeHtml(String(fille))}</div>
                <div><b>Garçon</b></div>
                <div>${this.escapeHtml(String(garcon))}</div>
                <div><b>Type Etablissement</b></div>
                <div>${this.escapeHtml(typeEtablissement)}</div>
              </div>
            </div>
          `);
          return;
        }

        const nom =
          props.nom ||
          props.name ||
          props.type ||
          props.Hopital ||
          props.ESSP ||
          props.NOM_ETABL ||
          '';
        const labelText = String(label || '');
        const nomText = String(nom || '');
        if (labelText.trim().toLowerCase() === nomText.trim().toLowerCase()) {
          layer.bindPopup(`<b>${this.escapeHtml(labelText)}</b>`);
          return;
        }
        layer.bindPopup(`<b>${this.escapeHtml(labelText)}</b><br>${this.escapeHtml(nomText)}`);
      }
    }).addTo(targetLayer);
    return kept.length;
  }

  private buildFilteredPolygonLayer(
    fc: FeatureCollection,
    title: string,
    fillColor = '#ef4444',
    onCount?: (n: number) => void,
    includeOutside = false
  ): L.GeoJSON {
    const kept: Feature[] = [];

    for (const f of (fc?.features || []) as Feature[]) {
      if (!f.geometry) continue;
      const c = this.getGeometryCentroidLatLng(f.geometry);
      if (!c) continue;

      if (includeOutside || this.isLatLngInsideCommune(c.lat, c.lng)) kept.push(f);
    }

    const filteredFC: FeatureCollection = { type: 'FeatureCollection', features: kept };
    onCount?.(kept.length);

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
              ${img ? '' : '&nbsp;'}
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

private buildFilteredRoutesLayer(
  fc: FeatureCollection,
  title: string,
  color = '#000000',
  includeOutside = false
): L.GeoJSON {
  const kept: Feature[] = [];

  for (const f of (fc?.features || []) as Feature[]) {
    if (!f.geometry) continue;
    const c = this.getGeometryCentroidLatLngExtended(f.geometry);
    if (!c) continue;

    if (includeOutside || this.isLatLngInsideCommune(c.lat, c.lng)) kept.push(f);
  }

  const filteredFC: FeatureCollection = { type: 'FeatureCollection', features: kept };

  return L.geoJSON(filteredFC as any, {
    coordsToLatLng: (coords: any) => this.toLatLngAuto(coords),
    style: () => {
      const isDefault = color === '#000000';
      return {
        color,
        weight: isDefault ? 1 : 8,
        opacity: isDefault ? 0.8 : 0.9
      };
    },
    onEachFeature: (feature: any, layer) => {
      const p = feature?.properties || {};
      const nom = p.nom || p.name || p.Nom || p.type || title;

      layer.bindPopup(`
        <div style="min-width:220px">
          <div style="font-weight:800; margin-bottom:6px">${this.escapeHtml(nom)}</div>
        </div>
      `);

      const isDefault = color === '#000000';
      const baseWeight = isDefault ? 1 : 8;
      const baseOpacity = isDefault ? 0.8 : 0.9;

      (layer as any).on('mouseover', () => {
        (layer as any).setStyle?.({ weight: baseWeight, opacity: 1 });
        (layer as any).bringToFront?.();
      });

      (layer as any).on('mouseout', () => {
        (layer as any).setStyle?.({ weight: baseWeight, opacity: baseOpacity });
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

    if (geom.type === 'Point') {
      return this.toLatLngAuto((geom as any).coordinates);
    }

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

  private getGeometryCentroidLatLngExtended(geom: Geometry): L.LatLng | null {
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

    if (geom.type === 'LineString') {
      const pts = (geom.coordinates || []).map((c: any) => this.toLatLngAuto(c));
      return avgOf(pts);
    }

    if (geom.type === 'MultiLineString') {
      const pts = (geom.coordinates?.[0] || []).map((c: any) => this.toLatLngAuto(c));
      return avgOf(pts);
    }

    return null;
  }

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

  showSante(project: SanteProject) {
    if (!this.map) return;
    if (this.activeSanteProject === project) {
      this.hideAllSanteProjects();
      return;
    }
    this.hideAllSanteProjects();

    if (project === 'TOUT') {
      this.santeNouveauxLayer.addTo(this.map);
      this.santeHopitauxLayer.addTo(this.map);
      this.santeESSPLayer.addTo(this.map);
      this.santeDouiratLayer.addTo(this.map);
      this.activeSanteProject = 'TOUT';
      return;
    }

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
    this.showEducationAll = false;
    this.showEducationOverlay = false;
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

  toggleEducationDirect(ev?: MouseEvent) {
    ev?.stopPropagation();
    this.openMenu = null;
    if (!this.map) return;
    if (this.showEducationOverlay) {
      this.hideAllEducationApLayers();
      this.hideEducationExistants();
      this.showEducationOverlay = false;
      return;
    }
    this.hideAllEducationProjects();
    this.hideAllEducationApLayers();
    this.hideAllSanteApLayers();
    this.hideSanteExistants();
    this.showSanteOverlay = false;
    this.activeSanteProject = null;
    this.hideAllEmploiProjects();
    this.hideAllEmploiApLayers();
    this.showEmploiOverlay = false;
    this.hideAllEauProjects();
    this.hideAllEauApLayers();
    this.showEauOverlay = false;
    this.hideAllMiseProjects();
    this.hideAllMiseApLayers();
    this.showMiseOverlay = false;
    this.hideAllEauProjects();
    this.hideAllEauApLayers();
    this.showEauOverlay = false;
    this.showEducationExistants();
    this.activeEducationProject = null;
    this.showEducationOverlay = true;
  }

  private hideAllEducationProjects() {
    if (!this.map) return;
    this.map.removeLayer(this.education1Layer);
    this.map.removeLayer(this.education2Layer);
    this.map.removeLayer(this.education3Layer);
    this.map.removeLayer(this.education4Layer);
    this.activeEducationProject = null;
    this.showEducationAll = false;
  }

  showEducationAp(ap: 'AP1' | 'AP2' | 'AP3' | 'AP4' | 'AP5' | 'AP6') {
    if (!this.map) return;
    if (this.activeEducationAp === ap) {
      this.hideAllEducationApLayers();
      this.showEducationExistants();
      this.activeEducationAp = null;
      return;
    }
    this.hideAllEducationApLayers();
    this.hideEducationExistants();
    const layer = {
      AP1: this.educationAp1Layer,
      AP2: this.educationAp2Layer,
      AP3: this.educationAp3Layer,
      AP4: this.educationAp4Layer,
      AP5: this.educationAp5Layer,
      AP6: this.educationAp6Layer
    }[ap];
    layer.addTo(this.map);
    this.activeEducationAp = ap;
  }

  private hideAllEducationApLayers() {
    if (!this.map) return;
    this.map.removeLayer(this.educationAp1Layer);
    this.map.removeLayer(this.educationAp2Layer);
    this.map.removeLayer(this.educationAp3Layer);
    this.map.removeLayer(this.educationAp4Layer);
    this.map.removeLayer(this.educationAp5Layer);
    this.map.removeLayer(this.educationAp6Layer);
    this.activeEducationAp = null;
  }

  private showEducationExistants() {
    if (!this.map) return;
    this.education1Layer.addTo(this.map);
    this.education2Layer.addTo(this.map);
    this.education3Layer.addTo(this.map);
    this.education4Layer.addTo(this.map);
  }

  private hideEducationExistants() {
    if (!this.map) return;
    this.map.removeLayer(this.education1Layer);
    this.map.removeLayer(this.education2Layer);
    this.map.removeLayer(this.education3Layer);
    this.map.removeLayer(this.education4Layer);
    this.showEducationAll = false;
  }

  toggleEauDirect(ev?: MouseEvent) {
    ev?.stopPropagation();
    this.openMenu = null;
    if (!this.map) return;
    if (this.showEauOverlay) {
      this.hideAllEauApLayers();
      this.hideEauExistants();
      this.showEauOverlay = false;
      return;
    }
    this.hideAllEauProjects();
    this.hideAllEauApLayers();
    this.hideAllSanteApLayers();
    this.hideSanteExistants();
    this.showSanteOverlay = false;
    this.activeSanteProject = null;
    this.hideAllEducationApLayers();
    this.hideEducationExistants();
    this.showEducationOverlay = false;
    this.hideAllEmploiApLayers();
    this.hideEmploiExistants();
    this.showEmploiOverlay = false;
    this.hideAllMiseApLayers();
    this.hideMiseExistants();
    this.showMiseOverlay = false;
    this.hideEauExistants();
    this.activeEauProject = null;
    this.showEauOverlay = true;
  }

  toggleMiseDirect(ev?: MouseEvent) {
    ev?.stopPropagation();
    this.openMenu = null;
    if (!this.map) return;
    if (this.showMiseOverlay) {
      this.hideAllMiseApLayers();
      this.hideMiseExistants();
      this.showMiseOverlay = false;
      return;
    }
    this.hideAllMiseProjects();
    this.hideAllMiseApLayers();
    this.hideAllSanteApLayers();
    this.hideSanteExistants();
    this.showSanteOverlay = false;
    this.activeSanteProject = null;
    this.hideAllEducationApLayers();
    this.hideEducationExistants();
    this.showEducationOverlay = false;
    this.hideAllEmploiApLayers();
    this.hideEmploiExistants();
    this.showEmploiOverlay = false;
    this.hideAllEauApLayers();
    this.hideEauExistants();
    this.showEauOverlay = false;
    this.hideMiseExistants();
    this.activeMiseProject = null;
    this.showMiseOverlay = true;
  }

  showMiseAp(ap: 'AP1' | 'AP2') {
    if (!this.map) return;
    if (this.activeMiseAp === ap) {
      this.hideAllMiseApLayers();
      this.activeMiseAp = null;
      return;
    }
    this.hideAllMiseApLayers();
    this.hideMiseExistants();
    const layer = {
      AP1: this.miseAp1Layer,
      AP2: this.miseAp2Layer
    }[ap];
    layer.addTo(this.map);
    this.activeMiseAp = ap;
  }

  private hideAllMiseApLayers() {
    if (!this.map) return;
    this.map.removeLayer(this.miseAp1Layer);
    this.map.removeLayer(this.miseAp2Layer);
    this.activeMiseAp = null;
  }

  private hideMiseExistants() {
    if (!this.map) return;
    this.map.removeLayer(this.mise1Layer);
    this.map.removeLayer(this.mise2Layer);
    this.map.removeLayer(this.mise3Layer);
  }

  showEauAp(ap: 'AP1' | 'AP3' | 'AP6') {
    if (!this.map) return;
    if (this.activeEauAp === ap) {
      this.hideAllEauApLayers();
      this.activeEauAp = null;
      return;
    }
    this.hideAllEauApLayers();
    this.hideEauExistants();
    const layer = {
      AP1: this.eauAp1Layer,
      AP3: this.eauAp3Layer,
      AP6: this.eauAp6Layer
    }[ap];
    layer.addTo(this.map);
    this.activeEauAp = ap;
  }

  private hideAllEauApLayers() {
    if (!this.map) return;
    this.map.removeLayer(this.eauAp1Layer);
    this.map.removeLayer(this.eauAp3Layer);
    this.map.removeLayer(this.eauAp6Layer);
    this.activeEauAp = null;
  }

  private hideEauExistants() {
    if (!this.map) return;
    this.map.removeLayer(this.eauP1Layer);
    this.map.removeLayer(this.eauP2Layer);
    this.map.removeLayer(this.eauP3Layer);
    this.map.removeLayer(this.eauP4Layer);
    this.map.removeLayer(this.eauP5Layer);
    this.map.removeLayer(this.eauP6Layer);
    this.map.removeLayer(this.eauP7Layer);
  }

  toggleEmploiDirect(ev?: MouseEvent) {
    ev?.stopPropagation();
    this.openMenu = null;
    if (!this.map) return;
    if (this.showEmploiOverlay) {
      this.hideAllEmploiApLayers();
      this.hideEmploiExistants();
      this.showEmploiOverlay = false;
      return;
    }
    this.hideAllEmploiProjects();
    this.hideAllEmploiApLayers();
    this.hideAllSanteApLayers();
    this.hideSanteExistants();
    this.showSanteOverlay = false;
    this.activeSanteProject = null;
    this.hideAllEducationApLayers();
    this.hideEducationExistants();
    this.showEducationOverlay = false;
    this.hideAllEauApLayers();
    this.hideEauExistants();
    this.showEauOverlay = false;
    this.hideAllMiseApLayers();
    this.hideMiseExistants();
    this.showMiseOverlay = false;
    this.hideEmploiExistants();
    this.activeEmploiProject = null;
    this.showEmploiOverlay = true;
  }

  showEmploiAp(ap: 'AP1' | 'AP2' | 'AP3' | 'AP4' | 'AP5') {
    if (!this.map) return;
    if (this.activeEmploiAp === ap) {
      this.hideAllEmploiApLayers();
      this.activeEmploiAp = null;
      return;
    }
    this.hideAllEmploiApLayers();
    this.hideEmploiExistants();
    const layer = {
      AP1: this.emploiAp1Layer,
      AP2: this.emploiAp2Layer,
      AP3: this.emploiAp3Layer,
      AP4: this.emploiAp4Layer,
      AP5: this.emploiAp5Layer
    }[ap];
    layer.addTo(this.map);
    this.activeEmploiAp = ap;
  }

  private hideAllEmploiApLayers() {
    if (!this.map) return;
    this.map.removeLayer(this.emploiAp1Layer);
    this.map.removeLayer(this.emploiAp2Layer);
    this.map.removeLayer(this.emploiAp3Layer);
    this.map.removeLayer(this.emploiAp4Layer);
    this.map.removeLayer(this.emploiAp5Layer);
    this.activeEmploiAp = null;
  }

  private showEmploiExistants() {
    if (!this.map) return;
    this.emploiPointsLayer.addTo(this.map);
    this.emploiZone1Layer.addTo(this.map);
    this.emploiHizamLayer.addTo(this.map);
    this.emploiAteliersLayer.addTo(this.map);
    this.emploiSitesLayer.addTo(this.map);
  }

  private hideEmploiExistants() {
    if (!this.map) return;
    this.map.removeLayer(this.emploiPointsLayer);
    this.map.removeLayer(this.emploiZone1Layer);
    this.map.removeLayer(this.emploiHizamLayer);
    this.map.removeLayer(this.emploiAteliersLayer);
    this.map.removeLayer(this.emploiSitesLayer);
  }

  showEau(project: EauProject) {
    if (!this.map) return;
    if (this.activeEauProject === project) {
      this.hideAllEauProjects();
      return;
    }
    this.hideAllEauProjects();

    if (project === 'TOUT') {
      this.eauP1Layer.addTo(this.map);
      this.eauP2Layer.addTo(this.map);
      this.eauP3Layer.addTo(this.map);
      this.eauP4Layer.addTo(this.map);
      this.eauP5Layer.addTo(this.map);
      this.eauP6Layer.addTo(this.map);
      this.eauP7Layer.addTo(this.map);
      this.activeEauProject = 'TOUT';
      return;
    }

    const layer = {
      P1: this.eauP1Layer,
      P2: this.eauP2Layer,
      P3: this.eauP3Layer,
      P4: this.eauP4Layer,
      P5: this.eauP5Layer,
      P6: this.eauP6Layer,
      P7: this.eauP7Layer
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
    this.map.removeLayer(this.eauP7Layer);
    this.activeEauProject = null;
  }

  showEmploi(project: EmploiProject) {
    if (!this.map) return;
    if (this.activeEmploiProject === project) {
      this.hideAllEmploiProjects();
      return;
    }
    this.hideAllEmploiProjects();

    if (project === 'TOUT') {
      this.emploiPointsLayer.addTo(this.map);
      this.emploiZone1Layer.addTo(this.map);
      this.emploiHizamLayer.addTo(this.map);
      this.emploiAteliersLayer.addTo(this.map);
      this.emploiSitesLayer.addTo(this.map);
      this.activeEmploiProject = 'TOUT';
      return;
    }

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

  showRoutes(project: RoutesProject) {
    if (!this.map) return;

    if (this.activeRoutesProject === project) {
      this.hideAllRoutesProjects();
      return;
    }

    this.hideAllRoutesProjects();
    this.routesLaayouneLayer.addTo(this.map);
    this.activeRoutesProject = project;
  }

  private hideAllRoutesProjects() {
    if (!this.map) return;
    this.map.removeLayer(this.routesLaayouneLayer);
    this.activeRoutesProject = null;
  }
  toggleSanteDirect(_ev?: MouseEvent) {
    this.openMenu = null;
    // si déjà actif => masquer
    if (this.activeSanteProject === 'TOUT_EXISTANTS') {
      this.hideAllSanteProjects();
      this.hideAllSanteApLayers();
      this.hideSanteExistants();
      this.showSanteOverlay = false;
      return;
    }

    // masquer tout d'abord
    this.hideAllSanteProjects();
    this.hideAllSanteApLayers();
    this.hideAllEducationProjects();
    this.hideAllEducationApLayers();
    this.showEducationOverlay = false;
    this.hideAllEmploiProjects();
    this.hideAllEmploiApLayers();
    this.showEmploiOverlay = false;
    this.hideAllEauProjects();
    this.hideAllEauApLayers();
    this.showEauOverlay = false;
    this.hideAllMiseProjects();
    this.hideAllMiseApLayers();
    this.showMiseOverlay = false;
    this.hideAllEauProjects();
    this.hideAllEauApLayers();
    this.showEauOverlay = false;
    this.activeEducationProject = null;
    this.showEducationAll = false;
    this.activeEmploiProject = null;
    this.activeEauProject = null;
    this.activeMiseProject = null;

    // afficher seulement les existants
    this.showSanteExistants();

    // si tu veux aussi Douirat avec les existants, décommente :
    // this.santeDouiratLayer.addTo(this.map);

    this.activeSanteProject = 'TOUT_EXISTANTS' as any;
    this.showSanteOverlay = true;
  }

  showSanteAp(ap: 'AP1' | 'AP2' | 'AP3' | 'AP4') {
    if (!this.map) return;
    if (this.activeSanteAp === ap) {
      this.hideAllSanteApLayers();
      this.showSanteExistants();
      this.activeSanteAp = null;
      return;
    }

    this.hideAllSanteApLayers();
    this.hideSanteExistants();
    const layer = {
      AP1: this.santeAp1Layer,
      AP2: this.santeAp2Layer,
      AP3: this.santeAp3Layer,
      AP4: this.santeAp4Layer
    }[ap];
    layer.addTo(this.map);
    if (ap === 'AP1') {
      this.santeESSPLayer.addTo(this.map);
    } else {
      this.santeHopitauxLayer.addTo(this.map);
    }
    this.activeSanteAp = ap;
  }

  private hideAllSanteApLayers() {
    if (!this.map) return;
    this.map.removeLayer(this.santeAp1Layer);
    this.map.removeLayer(this.santeAp2Layer);
    this.map.removeLayer(this.santeAp3Layer);
    this.map.removeLayer(this.santeAp4Layer);
    this.activeSanteAp = null;
  }

  private showSanteExistants() {
    if (!this.map) return;
    this.santeHopitauxLayer.addTo(this.map);
    this.santeESSPLayer.addTo(this.map);
  }

  private hideSanteExistants() {
    if (!this.map) return;
    this.map.removeLayer(this.santeHopitauxLayer);
    this.map.removeLayer(this.santeESSPLayer);
  }
}