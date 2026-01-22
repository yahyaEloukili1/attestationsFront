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
}
