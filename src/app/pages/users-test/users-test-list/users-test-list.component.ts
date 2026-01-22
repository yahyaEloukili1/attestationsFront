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
import * as proj4 from 'proj4';

import type { FeatureCollection, Feature, Polygon, Position } from 'geojson';

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

  constructor(private router: Router, private mapService: UserProfileService) {}

  // =========================
  // ✅ INDICATEURS (STATE)
  // =========================
  indicateursDemo = {
    population: 0,
    hommes: 0,
    femmes: 0,
    marocains: 0,
    etrangers: 0,
    menages: 0
  };

  indicateursTerritoire = {
    superficieKm2: 0,
    communesTerritoriales: 0,
    grandMassifPct: 0,
    plaineSoussPct: 0,
    littoralKm: 0
  };

  // =========================
  // ✅ RESET INDICATORS
  // =========================
  resetIndicators() {
    this.indicateursDemo = {
      population: 0,
      hommes: 0,
      femmes: 0,
      marocains: 0,
      etrangers: 0,
      menages: 0
    };

    this.indicateursTerritoire = {
      superficieKm2: 0,
      communesTerritoriales: 0,
      grandMassifPct: 0,
      plaineSoussPct: 0,
      littoralKm: 0
    };
  }

  // =========================
  // ✅ LAYERS + STATES
  // =========================

  // ✅ Santé (menu)
  santeNouveauxLayer = L.layerGroup(); // getCHRs + getCHR2s + getCHR3s
  santeHopitauxLayer = L.layerGroup(); // getSanteExistants
  santeESSPLayer = L.layerGroup(); // getSanteESSPExistants
  santeDouiratLayer = L.layerGroup(); // getZoneDouirat

  activeSanteProject:
    | 'NOUVEAUX'
    | 'HOPITAUX_EXISTANTS'
    | 'ESSP_EXISTANTS'
    | 'DOUIRAT'
    | null = null;

  get santeProjectsVisible(): boolean {
    return this.activeSanteProject !== null;
  }

  // Education
  educationLayer = L.layerGroup();
  educationVisible = false;

  // Mise à niveau
  miseLayer = L.layerGroup();
  miseVisible = false;

  // ✅ Emploi (points + zones)
  emploiLayer = L.layerGroup(); // points
  emploiZonesLayer = L.layerGroup(); // Zone1
  emploiHizamLayer = L.layerGroup(); // Hizam
  atelierArtisanauxLayer = L.layerGroup(); // CRS84 / Auto
  sitesTouristiquesLayer = L.layerGroup(); // CRS84 / Auto

  // =========================
  // ✅ EAU POTABLE (MENU PROJECTS)
  // =========================
  eauP1Layer = L.layerGroup();
  eauP2Layer = L.layerGroup();
  eauP3Layer = L.layerGroup();
  eauP4Layer = L.layerGroup();
  eauP5Layer = L.layerGroup();
  eauP6Layer = L.layerGroup();

  activeEauProject: 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6' | null = null;

  get eauPotableVisible(): boolean {
    return this.activeEauProject !== null;
  }

  // =========================
  // ✅ EMPLOI: 1 projet à la fois
  // =========================
  activeEmploiProject: 'ZONE1' | 'HIZAM' | 'ATELIERS' | 'SITES' | 'POINTS' | null = null;

  get emploiProjectsVisible(): boolean {
    return this.activeEmploiProject !== null;
  }

  // =========================
  // ✅ ICONS
  // =========================
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
  // ✅ HELPERS
  // =========================
  private n(v: any): number {
    const x = Number(v);
    return Number.isFinite(x) ? x : 0;
  }

  private pick(p: any, keys: string[]): any {
    for (const k of keys) {
      if (p && p[k] !== undefined && p[k] !== null && p[k] !== '') return p[k];
    }
    return undefined;
  }

  private normalizeAssetUrl(path: string | undefined): string | null {
    if (!path) return null;
    const p = String(path).trim();
    if (!p) return null;

    // ignore windows local paths
    if (p.includes(':\\') || p.startsWith('\\')) return null;

    if (p.startsWith('http://') || p.startsWith('https://')) return p;
    if (p.startsWith('assets/')) return p;
    return `assets/${p}`;
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

  // =========================
  // ✅ PROJECTIONS
  // =========================
  private readonly CRS_26194 =
    '+proj=lcc +lat_1=26.1 +lat_0=26.1 +lon_0=-5.4 +k_0=0.999616304 ' +
    '+x_0=1200000 +y_0=400000 +ellps=clrk80ign +towgs84=31,146,47,0,0,0,0 ' +
    '+units=m +no_defs';

  private meters26194ToLatLngObj(coords: [number, number] | [number, number, number]): L.LatLng {
    const fn = (proj4 as any).default ?? (proj4 as any);
    const x = Number(coords[0]);
    const y = Number(coords[1]);
    const [lng, lat] = fn(this.CRS_26194, 'WGS84', [x, y]) as [number, number];
    return L.latLng(lat, lng);
  }

  // =========================
  // ✅ BUILD ZONE LAYER (EAU)
  // =========================
  private buildEauZoneLayer(fc: FeatureCollection, zoneName: string): L.GeoJSON {
    return L.geoJSON(fc as any, {
      style: () => ({
        color: '#ffffff',
        weight: 3,
        dashArray: '8 6',
        fillColor: '#ef4444',
        fillOpacity: 0.22
      }),

      onEachFeature: (feature: any, layer) => {
        const p = feature?.properties || {};
        const imgUrl = this.normalizeAssetUrl(p?.Lien_Image);

        const html = `
          <div style="min-width:240px">
            <div style="font-weight:800; margin-bottom:6px">${this.escapeHtml(zoneName)}</div>
            <div style="font-size:12px; opacity:.85; margin-bottom:8px">
              Début: ${this.escapeHtml(p?.begin)} &nbsp;|&nbsp; Fin: ${this.escapeHtml(p?.end)}
            </div>
            ${
              imgUrl
                ? `<img src="${imgUrl}"
                        style="width:100%; max-width:280px; border-radius:12px; display:block"
                        onerror="this.style.display='none'"/>`
                : ''
            }
          </div>
        `;

        layer.bindPopup(html);

        layer.on('mouseover', () => {
          (layer as any).setStyle?.({ fillOpacity: 0.35, weight: 4 });
          (layer as any).bringToFront?.();
        });

        layer.on('mouseout', () => {
          (layer as any).setStyle?.({ fillOpacity: 0.22, weight: 3 });
        });
      }
    });
  }

  // =========================
  // ✅ BUILD ZONE LAYER (GENERIC)
  // ✅ CRS84 (lon/lat) OR EPSG:26194 (meters)
  // =========================
  private buildZoneLayerAuto(fc: FeatureCollection, title: string, fillColor = '#f59e0b'): L.GeoJSON {
    return L.geoJSON(fc as any, {
      coordsToLatLng: (coords: any) => {
        const x = Number(coords[0]);
        const y = Number(coords[1]);

        // CRS84
        if (Math.abs(x) <= 180 && Math.abs(y) <= 90) return L.latLng(y, x);

        // EPSG:26194
        return this.meters26194ToLatLngObj(coords);
      },

      style: () => ({
        color: '#ffffff',
        weight: 3,
        dashArray: '8 6',
        fillColor,
        fillOpacity: 0.22
      }),

      onEachFeature: (feature: any, layer) => {
        const p = feature?.properties || {};
        const imgUrl = this.normalizeAssetUrl(p?.Lien_Image);

        const html = `
          <div style="min-width:140px">
            <div style="margin-bottom:6px">${this.escapeHtml(title)}</div>
            ${
              imgUrl
                ? `<img src="${imgUrl}"
                        style="width:100%; max-width:280px; border-radius:12px; display:block"
                        onerror="this.style.display='none'"/>`
                : ''
            }
          </div>
        `;

        layer.bindPopup(html);

        layer.on('mouseover', () => {
          (layer as any).setStyle?.({ fillOpacity: 0.35, weight: 4 });
          (layer as any).bringToFront?.();
        });

        layer.on('mouseout', () => {
          (layer as any).setStyle?.({ fillOpacity: 0.22, weight: 3 });
        });
      }
    });
  }

  // =========================
  // ✅ MAIN
  // =========================
  ngAfterViewInit(): void {
    this.map = L.map(this.mapContainer.nativeElement, {
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap & CartoDB'
    }).addTo(this.map);

    this.mapService.getCommunes().subscribe((data: FeatureCollection) => {
      this.resetIndicators();
      this.indicateursTerritoire.communesTerritoriales = data.features.length;

      let foundMassif = false;
      let foundPlaine = false;

      data.features.forEach((feature: any) => {
        const p = feature.properties || {};

        this.indicateursDemo.population += this.n(p.Population);
        this.indicateursDemo.hommes += this.n(p.Hommes);
        this.indicateursDemo.femmes += this.n(p.Femmes);
        this.indicateursDemo.marocains += this.n(p.Marocains);
        this.indicateursDemo.etrangers += this.n(p.Etrangers);
        this.indicateursDemo.menages += this.n(p.Nb_Menages);

        const sup = this.pick(p, ['Superficie', 'superficie', 'Area_km2', 'area_km2', 'SUP_KM2']);
        this.indicateursTerritoire.superficieKm2 += this.n(sup);

        const lit = this.pick(p, ['Littoral_km', 'littoral_km', 'LITTORAL_KM', 'longueur_littoral', 'LITTORAL']);
        this.indicateursTerritoire.littoralKm += this.n(lit);

        if (!foundMassif) {
          const massif = this.pick(p, ['Grand_massif_pct', 'grandMassifPct', 'GRAND_MASSIF_PCT', 'GRAND_MASSIF']);
          const mv = this.n(massif);
          if (mv > 0) {
            this.indicateursTerritoire.grandMassifPct = mv;
            foundMassif = true;
          }
        }

        if (!foundPlaine) {
          const plaine = this.pick(p, ['Plaine_souss_pct', 'plaineSoussPct', 'PLAINE_SOUS_PCT', 'PLAINE_SOUS']);
          const pv = this.n(plaine);
          if (pv > 0) {
            this.indicateursTerritoire.plaineSoussPct = pv;
            foundPlaine = true;
          }
        }
      });

      const communesLayer = L.geoJSON(data as any, {
        style: (feature: any) => ({
          color: '#888',
          weight: 1,
          fillColor: this.getCommuneColor(feature.properties.id_objet),
          fillOpacity: 0.55
        }),

        onEachFeature: (feature: any, layer: L.Layer) => {
          const polygon = layer as L.Path;
          const bounds = (polygon as any).getBounds?.();

          if (bounds) {
            const area = bounds.getNorthEast().distanceTo(bounds.getSouthWest());
            if (area > 15000) {
              L.tooltip({
                permanent: true,
                direction: 'center',
                className: 'commune-label'
              })
                .setContent(feature.properties.COMMUNE)
                .setLatLng(bounds.getCenter())
                .addTo(this.map);
            }
          }

          polygon.on('mouseover', () => {
            if (this.selectedLayer) {
              this.selectedLayer.setStyle({
                color: '#888',
                weight: 1,
                fillOpacity: 0.55
              } as any);
            }

            polygon.setStyle({
              color: '#1565c0',
              weight: 3,
              fillOpacity: 0.85
            } as any);

            this.selectedLayer = polygon;
          });

          polygon.on('mouseout', () => this.map.closePopup());

          const routes: Record<string, string> = {
            DCHEIRA: '/dcheira',
            BOUKRAA: '/boucraa',
            'FOUM EL OUED': '/foumelouad',
            LAAYOUNE: '/laayoune',
            'EL MARSA': '/elmarsa'
          };

          polygon.on('click', () => {
            const key = feature.properties.COMMUNE?.toUpperCase().trim();
            if (routes[key]) this.router.navigate([routes[key]]);
          });
        }
      }).addTo(this.map);

      // =========================
      // ✅ LOAD LAYERS (HIDDEN)
      // =========================

      // =========================
      // ✅ SANTÉ - LOAD (HIDDEN)
      // =========================

      // Centres nouveaux de santé (3 services)
      this.mapService.getCHRs().subscribe({
        next: (chrs: any) => {
          L.geoJSON(chrs, {
            pointToLayer: (_f, latlng) => L.marker(latlng, { icon: this.hopitauxExistantsIcon }),
            onEachFeature: (f: any, layer) =>
              layer.bindPopup(`<b>Extension CHR</b><br>${f?.properties?.nom || ''}`)
          }).addTo(this.santeNouveauxLayer);
        },
        error: (e) => console.error('getCHRs error', e)
      });

      this.mapService.getCHR2s().subscribe({
        next: (chrs: any) => {
          L.geoJSON(chrs, {
            pointToLayer: (_f, latlng) => L.marker(latlng, { icon: this.hopitauxExistantsIcon }),
            onEachFeature: (f: any, layer) =>
              layer.bindPopup(`<b>Construction ESSP - Douirat</b><br>${f?.properties?.nom || ''}`)
          }).addTo(this.santeNouveauxLayer);
        },
        error: (e) => console.error('getCHR2s error', e)
      });

      this.mapService.getCHR3s().subscribe({
        next: (chrs: any) => {
          L.geoJSON(chrs, {
            pointToLayer: (_f, latlng) => L.marker(latlng, { icon: this.hopitauxExistantsIcon }),
            onEachFeature: (_f: any, layer) =>
              layer.bindPopup(`<b>Aménagement et équipement UCCV – Hôpital Hassan II</b>`)
          }).addTo(this.santeNouveauxLayer);
        },
        error: (e) => console.error('getCHR3s error', e)
      });

      // Hôpitaux existants
      this.mapService.getSanteExistants().subscribe({
        next: (cs: any) => {
          L.geoJSON(cs, {
            pointToLayer: (_f, latlng) => L.marker(latlng, { icon: this.chrIcon }),
            onEachFeature: (f: any, layer) => layer.bindPopup(`${f?.properties?.Hopital || ''}`)
          }).addTo(this.santeHopitauxLayer);
        },
        error: (e) => console.error('getSanteExistants error', e)
      });

      // ESSP existants
      this.mapService.getSanteESSPExistants().subscribe({
        next: (cs: any) => {
          L.geoJSON(cs, {
            pointToLayer: (_f, latlng) => L.marker(latlng, { icon: this.chrIcon }),
            onEachFeature: (f: any, layer) => layer.bindPopup(`${f?.properties?.ESSP || ''}`)
          }).addTo(this.santeESSPLayer);
        },
        error: (e) => console.error('getSanteESSPExistants error', e)
      });

      // Zone Douirat
      this.mapService.getZoneDouirat().subscribe({
        next: (fc: any) => {
          this.buildZoneLayerAuto(fc, 'Zone Douirat', '#22c55e').addTo(this.santeDouiratLayer);
        },
        error: (e) => console.error('getZoneDouirat error', e)
      });

      // =========================
      // ✅ EDUCATION
      // =========================
      const addEducation = (fc: FeatureCollection, label: string) => {
        L.geoJSON(fc as any, {
          pointToLayer: (_f, latlng) => L.marker(latlng, { icon: this.educationIcon }),
          onEachFeature: (f: any, layer) => {
            const nom = f?.properties?.nom || f?.properties?.name || '';
            layer.bindPopup(`<b>${label}</b><br>${nom}`);
          }
        }).addTo(this.educationLayer);
      };

      this.mapService.getEducationExistants1().subscribe({
        next: (fc: any) => addEducation(fc, 'Education 1'),
        error: (e) => console.error(e)
      });
      this.mapService.getEducationExistants2().subscribe({
        next: (fc: any) => addEducation(fc, 'Education 2'),
        error: (e) => console.error(e)
      });
      this.mapService.getEducationExistants3().subscribe({
        next: (fc: any) => addEducation(fc, 'Education 3'),
        error: (e) => console.error(e)
      });
      this.mapService.getEducationExistants4().subscribe({
        next: (fc: any) => addEducation(fc, 'Education 4'),
        error: (e) => console.error(e)
      });

      // =========================
      // ✅ EMPLOI
      // =========================
      const addEmploiPoints = (fc: FeatureCollection, label: string) => {
        L.geoJSON(fc as any, {
          pointToLayer: (_f, latlng) => L.marker(latlng, { icon: this.emploiIcon }),
          onEachFeature: (f: any, layer) => {
            const nom = f?.properties?.nom || f?.properties?.name || '';
            layer.bindPopup(`<b>${label}</b><br>${nom}`);
          }
        }).addTo(this.emploiLayer);
      };

      this.mapService.getEmploi1().subscribe({
        next: (fc: any) => addEmploiPoints(fc, 'Unités de valorization'),
        error: (e) => console.error('getEmploi1 error', e)
      });

      this.mapService.getEmploiZone1().subscribe({
        next: (fc: any) =>
          this.buildZoneLayerAuto(fc, "Extension de la zone d'activité - 52Ha", '#f59e0b').addTo(this.emploiZonesLayer),
        error: (e) => console.error('getEmploiZone1 error', e)
      });

      this.mapService.getEmploiZoneHizam().subscribe({
        next: (fc: any) =>
          this.buildZoneLayerAuto(fc, "Zone d'activité Al Hizam - 70ha", '#f59e0b').addTo(this.emploiHizamLayer),
        error: (e) => console.error('getEmploiZoneHizam error', e)
      });

      this.mapService.getAtelierArtisonaux().subscribe({
        next: (fc: any) => this.buildZoneLayerAuto(fc, 'Ateliers artisanaux', '#f59e0b').addTo(this.atelierArtisanauxLayer),
        error: (e) => console.error('getAtelierArtisonaux error', e)
      });

      this.mapService.getSitesTouristiques().subscribe({
        next: (fc: any) => this.buildZoneLayerAuto(fc, 'Sites touristiques', '#f59e0b').addTo(this.sitesTouristiquesLayer),
        error: (e) => console.error('getSitesTouristiques error', e)
      });

      // =========================
      // ✅ MISE À NIVEAU
      // =========================
      const addMise = (fc: FeatureCollection, label: string) => {
        L.geoJSON(fc as any, {
          pointToLayer: (_f, latlng) => L.marker(latlng, { icon: this.miseIcon }),
          onEachFeature: (f: any, layer) => {
            const nom = f?.properties?.nom || f?.properties?.name || '';
            layer.bindPopup(`<b>${label}</b><br>${nom}`);
          }
        }).addTo(this.miseLayer);
      };

      this.mapService.getMise1().subscribe({ next: (fc: any) => addMise(fc, 'Mise à niveau 1'), error: (e) => console.error(e) });
      this.mapService.getMise2().subscribe({ next: (fc: any) => addMise(fc, 'Mise à niveau 2'), error: (e) => console.error(e) });
      this.mapService.getMise3().subscribe({ next: (fc: any) => addMise(fc, 'Mise à niveau 3'), error: (e) => console.error(e) });

      // =========================
      // ✅ EAU POTABLE (ZONES)
      // =========================
      this.mapService.getEauPotable7().subscribe({
        next: (fc: any) => this.buildEauZoneLayer(fc, 'P1 – Eau potable').addTo(this.eauP1Layer),
        error: (e) => console.error(e)
      });
      this.mapService.getEauPotable6().subscribe({
        next: (fc: any) => this.buildEauZoneLayer(fc, 'P2 – Eau potable').addTo(this.eauP2Layer),
        error: (e) => console.error(e)
      });
      this.mapService.getEauPotable5().subscribe({
        next: (fc: any) => this.buildEauZoneLayer(fc, 'P3 – Eau potable').addTo(this.eauP3Layer),
        error: (e) => console.error(e)
      });
      this.mapService.getEauPotable4().subscribe({
        next: (fc: any) => this.buildEauZoneLayer(fc, 'P4 – Eau potable').addTo(this.eauP4Layer),
        error: (e) => console.error(e)
      });
      this.mapService.getEauPotable3().subscribe({
        next: (fc: any) => this.buildEauZoneLayer(fc, 'P5 – Renforcement du stockage d’eau').addTo(this.eauP5Layer),
        error: (e) => console.error(e)
      });
      this.mapService.getEauPotable2().subscribe({
        next: (fc: any) => this.buildEauZoneLayer(fc, 'P6 – Assainissement – Foum El Oued').addTo(this.eauP6Layer),
        error: (e) => console.error(e)
      });

      // =========================
      // ✅ MASK + OUTLINE
      // =========================
      const worldRing: Position[] = [
        [-180, -90],
        [-180, 90],
        [180, 90],
        [180, -90],
        [-180, -90]
      ];

      const provinceRings: Position[][] = [];
      (data.features as any).forEach((f: any) => {
        const g = f.geometry;
        if (!g) return;

        if (g.type === 'Polygon') g.coordinates.forEach((r: any) => provinceRings.push(r));
        if (g.type === 'MultiPolygon') g.coordinates.forEach((p: any) => p.forEach((r: any) => provinceRings.push(r)));
      });

      const maskFeature: Feature<Polygon> = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [worldRing, ...provinceRings] as any
        }
      };

      L.geoJSON(maskFeature as any, {
        style: { fillColor: '#f5f7fa', fillOpacity: 0.85, stroke: false },
        interactive: false
      }).addTo(this.map);

      L.geoJSON(data as any, {
        style: { color: '#263238', weight: 3, fillOpacity: 0 },
        interactive: false
      }).addTo(this.map);

      // Zoom
      this.map.fitBounds((communesLayer as any).getBounds(), {
        paddingTopLeft: [80, 40],
        paddingBottomRight: [40, 40]
      });

      setTimeout(() => this.map.invalidateSize(), 0);
    });
  }

  ngOnDestroy(): void {
    if (this.map) this.map.remove();
  }

  // =========================
  // ✅ TOGGLES (SECTEURS)
  // =========================

  // ✅ SANTÉ (menu + 1 projet à la fois)
  toggleSante() {
    if (this.activeSanteProject) this.hideAllSanteProjects();
  }

  showSanteNouveaux() {
    if (!this.map) return;
    if (this.activeSanteProject === 'NOUVEAUX') {
      this.hideAllSanteProjects();
      return;
    }
    this.hideAllSanteProjects();
    this.santeNouveauxLayer.addTo(this.map);
    this.activeSanteProject = 'NOUVEAUX';
  }

  showSanteHopitauxExistants() {
    if (!this.map) return;
    if (this.activeSanteProject === 'HOPITAUX_EXISTANTS') {
      this.hideAllSanteProjects();
      return;
    }
    this.hideAllSanteProjects();
    this.santeHopitauxLayer.addTo(this.map);
    this.activeSanteProject = 'HOPITAUX_EXISTANTS';
  }

  showSanteESSPExistants() {
    if (!this.map) return;
    if (this.activeSanteProject === 'ESSP_EXISTANTS') {
      this.hideAllSanteProjects();
      return;
    }
    this.hideAllSanteProjects();
    this.santeESSPLayer.addTo(this.map);
    this.activeSanteProject = 'ESSP_EXISTANTS';
  }

  showSanteZoneDouirat() {
    if (!this.map) return;
    if (this.activeSanteProject === 'DOUIRAT') {
      this.hideAllSanteProjects();
      return;
    }
    this.hideAllSanteProjects();
    this.santeDouiratLayer.addTo(this.map);
    this.activeSanteProject = 'DOUIRAT';
  }

  hideAllSanteProjects() {
    if (!this.map) return;

    if (this.map.hasLayer(this.santeNouveauxLayer)) this.map.removeLayer(this.santeNouveauxLayer);
    if (this.map.hasLayer(this.santeHopitauxLayer)) this.map.removeLayer(this.santeHopitauxLayer);
    if (this.map.hasLayer(this.santeESSPLayer)) this.map.removeLayer(this.santeESSPLayer);
    if (this.map.hasLayer(this.santeDouiratLayer)) this.map.removeLayer(this.santeDouiratLayer);

    this.activeSanteProject = null;
  }

  // Education toggle (simple)
  toggleEducation() {
    if (!this.map) return;
    if (this.educationVisible) this.map.removeLayer(this.educationLayer);
    else this.educationLayer.addTo(this.map);
    this.educationVisible = !this.educationVisible;
  }

  // Mise toggle (simple)
  toggleMise() {
    if (!this.map) return;
    if (this.miseVisible) this.map.removeLayer(this.miseLayer);
    else this.miseLayer.addTo(this.map);
    this.miseVisible = !this.miseVisible;
  }

  // =========================
  // ✅ EAU POTABLE
  // =========================
  toggleEauPotable() {
    if (this.activeEauProject) this.hideAllEauProjects();
  }

  showEauP1() {
    if (!this.map) return;
    if (this.activeEauProject === 'P1') {
      this.hideAllEauProjects();
      return;
    }
    this.hideAllEauProjects();
    this.eauP1Layer.addTo(this.map);
    this.activeEauProject = 'P1';
  }

  showEauP2() {
    if (!this.map) return;
    if (this.activeEauProject === 'P2') {
      this.hideAllEauProjects();
      return;
    }
    this.hideAllEauProjects();
    this.eauP2Layer.addTo(this.map);
    this.activeEauProject = 'P2';
  }

  showEauP3() {
    if (!this.map) return;
    if (this.activeEauProject === 'P3') {
      this.hideAllEauProjects();
      return;
    }
    this.hideAllEauProjects();
    this.eauP3Layer.addTo(this.map);
    this.activeEauProject = 'P3';
  }

  showEauP4() {
    if (!this.map) return;
    if (this.activeEauProject === 'P4') {
      this.hideAllEauProjects();
      return;
    }
    this.hideAllEauProjects();
    this.eauP4Layer.addTo(this.map);
    this.activeEauProject = 'P4';
  }

  showEauP5() {
    if (!this.map) return;
    if (this.activeEauProject === 'P5') {
      this.hideAllEauProjects();
      return;
    }
    this.hideAllEauProjects();
    this.eauP5Layer.addTo(this.map);
    this.activeEauProject = 'P5';
  }

  showEauP6() {
    if (!this.map) return;
    if (this.activeEauProject === 'P6') {
      this.hideAllEauProjects();
      return;
    }
    this.hideAllEauProjects();
    this.eauP6Layer.addTo(this.map);
    this.activeEauProject = 'P6';
  }

  hideAllEauProjects() {
    if (!this.map) return;

    if (this.map.hasLayer(this.eauP1Layer)) this.map.removeLayer(this.eauP1Layer);
    if (this.map.hasLayer(this.eauP2Layer)) this.map.removeLayer(this.eauP2Layer);
    if (this.map.hasLayer(this.eauP3Layer)) this.map.removeLayer(this.eauP3Layer);
    if (this.map.hasLayer(this.eauP4Layer)) this.map.removeLayer(this.eauP4Layer);
    if (this.map.hasLayer(this.eauP5Layer)) this.map.removeLayer(this.eauP5Layer);
    if (this.map.hasLayer(this.eauP6Layer)) this.map.removeLayer(this.eauP6Layer);

    this.activeEauProject = null;
  }

  // =========================
  // ✅ EMPLOI: menu + 1 projet à la fois
  // =========================
  toggleEmploi() {
    if (this.activeEmploiProject) this.hideAllEmploiProjects();
  }

  showEmploiZone1() {
    if (!this.map) return;
    if (this.activeEmploiProject === 'ZONE1') {
      this.hideAllEmploiProjects();
      return;
    }
    this.hideAllEmploiProjects();
    this.emploiZonesLayer.addTo(this.map);
    this.activeEmploiProject = 'ZONE1';
  }

  showEmploiHizam() {
    if (!this.map) return;
    if (this.activeEmploiProject === 'HIZAM') {
      this.hideAllEmploiProjects();
      return;
    }
    this.hideAllEmploiProjects();
    this.emploiHizamLayer.addTo(this.map);
    this.activeEmploiProject = 'HIZAM';
  }

  showEmploiAteliers() {
    if (!this.map) return;
    if (this.activeEmploiProject === 'ATELIERS') {
      this.hideAllEmploiProjects();
      return;
    }
    this.hideAllEmploiProjects();
    this.atelierArtisanauxLayer.addTo(this.map);
    this.activeEmploiProject = 'ATELIERS';
  }

  showEmploiSites() {
    if (!this.map) return;
    if (this.activeEmploiProject === 'SITES') {
      this.hideAllEmploiProjects();
      return;
    }
    this.hideAllEmploiProjects();
    this.sitesTouristiquesLayer.addTo(this.map);
    this.activeEmploiProject = 'SITES';
  }

  showEmploiPoints() {
    if (!this.map) return;
    if (this.activeEmploiProject === 'POINTS') {
      this.hideAllEmploiProjects();
      return;
    }
    this.hideAllEmploiProjects();
    this.emploiLayer.addTo(this.map);
    this.activeEmploiProject = 'POINTS';
  }

  hideAllEmploiProjects() {
    if (!this.map) return;

    if (this.map.hasLayer(this.emploiZonesLayer)) this.map.removeLayer(this.emploiZonesLayer);
    if (this.map.hasLayer(this.emploiHizamLayer)) this.map.removeLayer(this.emploiHizamLayer);
    if (this.map.hasLayer(this.atelierArtisanauxLayer)) this.map.removeLayer(this.atelierArtisanauxLayer);
    if (this.map.hasLayer(this.sitesTouristiquesLayer)) this.map.removeLayer(this.sitesTouristiquesLayer);
    if (this.map.hasLayer(this.emploiLayer)) this.map.removeLayer(this.emploiLayer);

    this.activeEmploiProject = null;
  }

  // =========================
  // ✅ COLORS
  // =========================
  getCommuneColor(nom: string): string {
    switch (nom) {
      case '1080204':
        return '#7e89b3';
      case '1080202':
        return '#7e89b3';
      case '1080206':
        return '#7e89b3';
      case '1080203':
        return '#7e89b3';
      case '1080205':
        return '#7e89b3';
      default:
        return '#e6dbdb';
    }
  }

  // =========================
  // ✅ NAV
  // =========================
  goToElmarsa(e: Event) {
    e.preventDefault();
    this.router.navigate(['/elmarsa']);
  }
  goToBoucraa(e: Event) {
    e.preventDefault();
    this.router.navigate(['/boucraa']);
  }
  goToLaayoune(e: Event) {
    e.preventDefault();
    this.router.navigate(['/laayoune']);
  }
  goToDcheira(e: Event) {
    e.preventDefault();
    this.router.navigate(['/dcheira']);
  }
  goToFoumelouad(e: Event) {
    e.preventDefault();
    this.router.navigate(['/foumelouad']);
  }
}
