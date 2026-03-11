// user.service.ts (UserProfileService) - unchanged, but included for completeness
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/store/Authentication/auth.models';

@Injectable({ providedIn: 'root' })
export class UserProfileService {
  constructor(private http: HttpClient) {}

  /***
   * Get All User
   */
  getAll() {
    return this.http.get<User[]>(`api/users`);
  }

  /***
   * Facked User Register
   */
  register(user: User) {
    return this.http.post(`/users/register`, user);
  }

  getCommunes() {
    return this.http.get<any>('assets/communesTS.geojson');
  }

    getMaroc() {
    return this.http.get<any>('assets/region.geojson');
  }

getRegionLaayoune() {
    return this.http.get<any>('assets/regionLaayoune.geojson');
  }
  getColleges() {
    return this.http.get<GeoJSON.FeatureCollection>('assets/colleges.geojson');
  }

  getCHRs() {
    return this.http.get<GeoJSON.FeatureCollection>('assets/Hopitaux/Extension CHR.geojson');
  }
    getCHR2s() {
    return this.http.get<GeoJSON.FeatureCollection>('assets/Hopitaux/Construction ESSP - Doirat.geojson');
  }
   getCHR3s() {
    return this.http.get<GeoJSON.FeatureCollection>('assets/Hopitaux/Amenagemet et equipement.geojson');
  }

  getSanteExistants() {
    return this.http.get<GeoJSON.FeatureCollection>('assets/Hopitaux/hopitauxexistants.geojson');
  }
    getSanteESSPExistants() {
    return this.http.get<GeoJSON.FeatureCollection>('assets/Hopitaux/ESSP.geojson');
  }

  getEducationExistants1() {
    return this.http.get<GeoJSON.FeatureCollection>('assets/education1.geojson');
  }
    getZoneDouirat() {
    return this.http.get<GeoJSON.FeatureCollection>('assets/Hopitaux/Zone_DOuirat.geojson');
  }
  getEducationExistants2() {
    return this.http.get<GeoJSON.FeatureCollection>('assets/education2.geojson');
  }
  getEducationExistants3() {
    return this.http.get<GeoJSON.FeatureCollection>('assets/education3.geojson');
  }
  getEducationExistants4() {
    return this.http.get<GeoJSON.FeatureCollection>('assets/education4.geojson');
  }
    getEauPotable() {
    return this.http.get<GeoJSON.FeatureCollection>('assets/eau_potable/P7-Extension de la station dessalement.geojson');
  }
      getEauPotable2() {
    return this.http.get<GeoJSON.FeatureCollection>('assets/eau_potable/p6.geojson');
  }
     getEauPotable3() {
    return this.http.get<GeoJSON.FeatureCollection>('assets/eau_potable/p5.geojson');
  }
       getEauPotable4() {
    return this.http.get<GeoJSON.FeatureCollection>('assets/eau_potable/p4.geojson');
  }
    getEauPotable5() {
    return this.http.get<GeoJSON.FeatureCollection>('assets/eau_potable/p3.geojson');
  }

     getEauPotable6() {
    return this.http.get<GeoJSON.FeatureCollection>('assets/eau_potable/p2.geojson');
  }
    getEauPotable7() {
    return this.http.get<GeoJSON.FeatureCollection>('assets/eau_potable/p1.geojson');
  }
getEmploiZone1() {
  return this.http.get<GeoJSON.FeatureCollection>('assets/emploi/Emploi1.geojson');
}
getEmploiZoneHizam() {
  return this.http.get<GeoJSON.FeatureCollection>('assets/emploi/Hizam.geojson');
}
getAtelierArtisonaux() {
  return this.http.get<GeoJSON.FeatureCollection>('assets/emploi/Ateliers_artisonaux.geojson');
}
getSitesTouristiques() {
  return this.http.get<GeoJSON.FeatureCollection>('assets/emploi/Sites_touristiques.geojson');
}
getEmploi1() {
  return this.http.get<GeoJSON.FeatureCollection>('assets/emploi/emploi2.geojson');
}
getEmploi2() {
  return this.http.get<GeoJSON.FeatureCollection>('assets/emploi2.geojson');
}
getEmploi3() {
  return this.http.get<GeoJSON.FeatureCollection>('assets/emploi3.geojson');
}
getMise1() {
  return this.http.get<GeoJSON.FeatureCollection>('assets/mise1.geojson');
}
getMise2() {
  return this.http.get<GeoJSON.FeatureCollection>('assets/mise2.geojson');
}
getMise3() {
  return this.http.get<GeoJSON.FeatureCollection>('assets/mise3.geojson');
}
getMise4() {
  return this.http.get<GeoJSON.FeatureCollection>('assets/mise4.geojson');
}
getExistantsLaayouneSante(){
   return this.http.get<GeoJSON.FeatureCollection>('assets/version3/laayouneSante.geojson');
}



// ===============================
// EXISTANTS LAAYOUNE EDUCATION
// ===============================
getExistantsLaayouneEducationPrimaires(){
   return this.http.get<GeoJSON.FeatureCollection>('assets/version3/existants/laayouneEducation/41 Ecoles Primaires.geojson');
}

getExistantsLaayouneEducationPrescolaires(){
   return this.http.get<GeoJSON.FeatureCollection>('assets/version3/existants/laayouneEducation/41 -  Préscolaire.geojson');
}

getExistantsLaayouneEducationColleges(){
   return this.http.get<GeoJSON.FeatureCollection>('assets/version3/existants/laayouneEducation/17 Lycées Collégiaux.geojson');
}

getExistantsLaayouneEducationQualifiant(){
   return this.http.get<GeoJSON.FeatureCollection>('assets/version3/existants/laayouneEducation/14 Lycées Qualifiants.geojson');
}

getExistantsLaayouneEducationSuperieur(){
   return this.http.get<GeoJSON.FeatureCollection>('assets/version3/existants/laayouneEducation/9 Établissements Supérieurs.geojson');
}


// ===============================
// EXISTANTS LAAYOUNE SANTE
// ===============================
getExistantsLaayouneESSP(){
   return this.http.get<GeoJSON.FeatureCollection>('assets/version3/existants/laayouneSante/11 ESSP.geojson');
}

getExistantsCentreRegionalOncologie(){
   return this.http.get<GeoJSON.FeatureCollection>('assets/version3/existants/laayouneSante/Centre Régional d’Oncologie.geojson');
}

getExistantsChu(){
   return this.http.get<GeoJSON.FeatureCollection>('assets/version3/existants/laayouneSante/CHU.geojson');
}

getExistantsHassanBelmehdi(){
   return this.http.get<GeoJSON.FeatureCollection>('assets/version3/existants/laayouneSante/Hôpital Hassan Ben Al Mehdi.geojson');
}

getExistantsHassan2(){
   return this.http.get<GeoJSON.FeatureCollection>('assets/version3/existants/laayouneSante/Hôpital Hassan II.geojson');
}

getExistantsHassanMilitaireHassan2(){
   return this.http.get<GeoJSON.FeatureCollection>('assets/version3/existants/laayouneSante/Hôpital Militaire Hassan II.geojson');
}


// ===============================
// EXISTANTS ELMARSA EDUCATION
// ===============================
getExistantsElmarsaSuperieure(){
   return this.http.get<GeoJSON.FeatureCollection>('assets/version3/elmarsaEducation/1 Établissement Supérieur.geojson');
}

getExistantsElmarsaQualifiant(){
   return this.http.get<GeoJSON.FeatureCollection>('assets/version3/elmarsaEducation/1 Lycées Qualifiants.geojson');
}

getExistantsElmarsaColleges(){
   return this.http.get<GeoJSON.FeatureCollection>('assets/version3/elmarsaEducation/2 Lycées Collégiaux.geojson');
}

getExistantsElmarsaPrescolaire(){
   return this.http.get<GeoJSON.FeatureCollection>('assets/version3/elmarsaEducation/4 -  Préscolaire.geojson');
}

getExistantsElmarsaPrimaire(){
   return this.http.get<GeoJSON.FeatureCollection>('assets/version3/elmarsaEducation/4 Ecoles Primaires.geojson');
}


// ===============================
// EXISTANTS FOUM ELOUED EDUCATION
// ===============================
getExistantsFoumEleoudSuperieure(){
   return this.http.get<GeoJSON.FeatureCollection>('assets/version3/foumeleoudEducation/1 Établissement Supérieur.geojson');
}

getExistantsFoumEleoudCollege(){
   return this.http.get<GeoJSON.FeatureCollection>('assets/version3/foumeleoudEducation/1 Lycées Collégiaux.geojson');
}

getExistantsFoumEleoudPrescolaire(){
   return this.http.get<GeoJSON.FeatureCollection>('assets/version3/foumeleoudEducation/4 -  Préscolaire.geojson');
}

getExistantsFoumEleoudPrimaire(){
   return this.http.get<GeoJSON.FeatureCollection>('assets/version3/foumeleoudEducation/4 Ecoles Primaires.geojson');
}


// ===============================
// EXISTANTS BOUCRAA EDUCATION
// ===============================
getExistantsBoucraaEducationPrescolaire(){
   return this.http.get<GeoJSON.FeatureCollection>('assets/version3/boucraaEducation/1 -  Préscolaire.geojson');
}

getExistantsBoucraaEducationPrimaires(){
   return this.http.get<GeoJSON.FeatureCollection>('assets/version3/boucraaEducation/1 Ecoles Primaires.geojson');
}


// ===============================
// EXISTANTS BOUCRAA SANTE
// ===============================
getExistantsBoucraaESSP(){
   return this.http.get<GeoJSON.FeatureCollection>('assets/version3/boucraaSante/1 ESSP.geojson');
}


// ===============================
// EXISTANTS DCHEIRA EDUCATION
// ===============================
getExistantsDcheiraEducationPrescolaire(){
   return this.http.get<GeoJSON.FeatureCollection>('assets/version3/dcheiraEducation/1 -  Préscolaire.geojson');
}

getExistantsDcheiraEducationPrimaires(){
   return this.http.get<GeoJSON.FeatureCollection>('assets/version3/dcheiraEducation/1 Ecoles Primaires.geojson');
}


// ===============================
// EXISTANTS DCHEIRA SANTE
// ===============================
getExistantsDcheiraESSP(){
   return this.http.get<GeoJSON.FeatureCollection>('assets/version3/dcheiraSante/1 ESSP.geojson');
}


// ===============================
// EXISTANTS ELMARSA SANTE
// ===============================
getExistantsElmarsaESSP(){
   return this.http.get<GeoJSON.FeatureCollection>('assets/version3/elmarsaSante/1 ESSP.geojson');
}


// ===============================
// EXISTANTS FOUM ELOUED SANTE
// ===============================
getExistantsFoumEleoudESSP(){
   return this.http.get<GeoJSON.FeatureCollection>('assets/version3/foumElouedSante/3 ESSP.geojson');
}

// ===============================
// NOUVEAUX ELMARSA EAU
// ===============================
getNouveauxElmarsaAP2(){
   return this.http.get<GeoJSON.FeatureCollection>('assets/version3/nouveaux/elmarsa/eau/AP2 Extension de la station de dessalement.geojson');
}

getNouveauxElmarsaAP4(){
   return this.http.get<GeoJSON.FeatureCollection>(
   'assets/version3/nouveaux/elmarsa/eau/AP4 Alimentation en eau potable de la zone industrielle Carrefour FEO - El Marsa.geojson');
}

getNouveauxElmarsaAP5(){
   return this.http.get<GeoJSON.FeatureCollection>(
   'assets/version3/nouveaux/elmarsa/eau/AP5 STEP des eaux usées à la zone industrielle El Marsa.geojson');
}

// ===============================
// NOUVEAUX FOUM ELOUED EAU
// ===============================
getNouveauxFoumElouedAP7(){
   return this.http.get<GeoJSON.FeatureCollection>(
   'assets/version3/nouveaux/foumelouad/eau/AP7 Extension du réseau d\'assainissement liquide.geojson');
}

// ===============================
// NOUVEAUX LAAYOUNE EAU
// ===============================
getNouveauxLaayouneAP1(){
   return this.http.get<GeoJSON.FeatureCollection>('assets/version3/nouveaux/laayoune/eau/AP1  Renforcement et réhabilitation des ouvrages de stockage.geojson');
}

getNouveauxLaayouneAP3(){
   return this.http.get<GeoJSON.FeatureCollection>('assets/version3/nouveaux/laayoune/eau/AP3  Mise à niveau et extension des ouvrages d\'assainissement liquide 2ème tranche.geojson');
}

getNouveauxLaayouneAP6(){
   return this.http.get<GeoJSON.FeatureCollection>('assets/version3/nouveaux/laayoune/eau/AP6  Réhabilitation du réseau AEP.geojson');
}


// ===============================
// NOUVEAUX LAAYOUNE EDUCATION - COLLEGE
// ===============================
getNouveauxLaayouneCollegeAP1(){
   return this.http.get<GeoJSON.FeatureCollection>('assets/version3/nouveaux/laayoune/education/college/AP1  Constr lycée collégial (Lot Al Khayr).geojson');
}

getNouveauxLaayouneCollegeAP5(){
   return this.http.get<GeoJSON.FeatureCollection>('assets/version3/nouveaux/laayoune/education/college/AP5  Constr lycée collégial (Lot ATTADAMONE).geojson');
}

getNouveauxLaayouneCollegeZone(){
   return this.http.get<GeoJSON.FeatureCollection>('assets/version3/nouveaux/laayoune/education/college/Zone Lot ATTADAMONE.geojson');
}


// ===============================
// NOUVEAUX LAAYOUNE EDUCATION - PRIMAIRE
// ===============================
getNouveauxLaayounePrimaireAP2(){
   return this.http.get<GeoJSON.FeatureCollection>('assets/version3/nouveaux/laayoune/education/primaire/AP2 Constr 1ère école primaire (Lot Addoha).geojson');
}

getNouveauxLaayounePrimaireAP3(){
   return this.http.get<GeoJSON.FeatureCollection>('assets/version3/nouveaux/laayoune/education/primaire/AP3  Constr école primaire (Lot ATTADAMONE).geojson');
}

getNouveauxLaayounePrimaireAP4(){
   return this.http.get<GeoJSON.FeatureCollection>('assets/version3/nouveaux/laayoune/education/primaire/AP4 Constr 2ème école primaire (Lot Addoha).geojson');
}

getNouveauxLaayounePrimaireZoneAddoha(){
   return this.http.get<GeoJSON.FeatureCollection>('assets/version3/nouveaux/laayoune/education/primaire/Zone Addoha.geojson');
}

getNouveauxLaayounePrimaireZoneAttadamone(){
   return this.http.get<GeoJSON.FeatureCollection>('assets/version3/nouveaux/laayoune/education/primaire/Zone Lot ATTADAMONE.geojson');
}


// ===============================
// NOUVEAUX LAAYOUNE EDUCATION - QUALIFIANT
// ===============================
getNouveauxLaayouneQualifiantAP6(){
   return this.http.get<GeoJSON.FeatureCollection>('assets/version3/nouveaux/laayoune/education/qualifiant/AP6 Constr lycée qualifiant (Lot ATTADAMONE).geojson');
}

getNouveauxLaayouneQualifiantZone(){
   return this.http.get<GeoJSON.FeatureCollection>('assets/version3/nouveaux/laayoune/education/qualifiant/Zone Lot ATTADAMONE.geojson');
}












// ===============================
// NOUVEAUX LAAYOUNE EMPLOI
// ===============================
getNouveauxLaayouneEmploiAP1(){
   return this.http.get<GeoJSON.FeatureCollection>('assets/version3/nouveaux/laayoune/emploi/AP1  Aménagement et équipement des ateliers artisanaux.geojson');
}

getNouveauxLaayouneEmploiAP2(){
   return this.http.get<GeoJSON.FeatureCollection>('assets/version3/nouveaux/laayoune/emploi/AP2  Aménagement des accès touristiques 10 Km.geojson');
}

getNouveauxLaayouneEmploiAP3(){
   return this.http.get<GeoJSON.FeatureCollection>('assets/version3/nouveaux/laayoune/emploi/AP3  Restructuration de la zone d\'activité AL Hizam (70 ha).geojson');
}

getNouveauxLaayouneEmploiAP4(){
   return this.http.get<GeoJSON.FeatureCollection>('assets/version3/nouveaux/laayoune/emploi/AP4  Extension de la zone d\'activité (52,3 ha).geojson');
}

getNouveauxLaayouneEmploiAP5(){
   return this.http.get<GeoJSON.FeatureCollection>('assets/version3/nouveaux/laayoune/emploi/AP5  Viabilisation des Unités de valorisation des produits agricoles.geojson');
}

// ===============================
// NOUVEAUX LAAYOUNE MISE
// ===============================
getNouveauxLaayouneMiseAP1(){
   return this.http.get<GeoJSON.FeatureCollection>('assets/version3/nouveaux/laayoune/mise/AP1  Construction de la voie de contournement Est Laâyoune - 17 km.geojson');
}

getNouveauxLaayouneMiseAP2(){
   return this.http.get<GeoJSON.FeatureCollection>('assets/version3/nouveaux/laayoune/mise/AP2  Construction et aménagement de la route de la berge Sakia El Hamra - 5 km.geojson');
}
// ===============================
// NOUVEAUX LAAYOUNE SANTE
// ===============================
getNouveauxLaayouneSanteAP1(){
   return this.http.get<GeoJSON.FeatureCollection>(
   'assets/version3/nouveaux/laayoune/sante/AP1Construction et équipement du ESSP (CSU-1) Douirat.geojson');
}

getNouveauxLaayouneSanteAP2(){
   return this.http.get<GeoJSON.FeatureCollection>('assets/version3/nouveaux/laayoune/sante/AP2  Équipement de l\'hôpital Hassan II.geojson');
}

getNouveauxLaayouneSanteAP3(){
   return this.http.get<GeoJSON.FeatureCollection>('assets/version3/nouveaux/laayoune/sante/AP3  Extension et équipement du CHR.geojson');
}

getNouveauxLaayouneSanteAP4(){
   return this.http.get<GeoJSON.FeatureCollection>('assets/version3/nouveaux/laayoune/sante/AP4  Aménagement et équipement UCCV - CHR.geojson');
}



getRoutesLaayoune(){
   return this.http.get<GeoJSON.FeatureCollection>('assets/version3/routes/routelaayoune.geojson');
}



















}
