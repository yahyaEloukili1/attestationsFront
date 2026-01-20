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
    return this.http.get<any>('assets/communes.geojson');
  }

  getColleges() {
    return this.http.get<GeoJSON.FeatureCollection>('assets/colleges.geojson');
  }

  getCHRs() {
    return this.http.get<GeoJSON.FeatureCollection>('assets/CHR.geojson');
  }

  getSanteExistants() {
    return this.http.get<GeoJSON.FeatureCollection>('assets/santeExistant.geojson');
  }

  getEducationExistants1() {
    return this.http.get<GeoJSON.FeatureCollection>('assets/education1.geojson');
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
    return this.http.get<GeoJSON.FeatureCollection>('assets/eaupotable.geojson');
  }
getEmploi1() {
  return this.http.get<GeoJSON.FeatureCollection>('assets/emploi1.geojson');
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
