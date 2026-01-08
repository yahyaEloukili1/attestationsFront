import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/store/Authentication/auth.models';

@Injectable({ providedIn: 'root' })
export class UserProfileService {
    constructor(private http: HttpClient) { }
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
  return this.http.get<GeoJSON.FeatureCollection>(
    'assets/colleges.geojson'
  );
}
getCHRs() {
  return this.http.get<GeoJSON.FeatureCollection>(
    'assets/CHR.geojson'
  );
}
getSanteExistants() {
  return this.http.get<GeoJSON.FeatureCollection>(
    'assets/santeExistant.geojson'
  );
}

}
