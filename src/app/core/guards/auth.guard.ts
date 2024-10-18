import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// Auth Services
import { AuthenticationService } from '../services/auth.service';
import { AuthfakeauthenticationService } from '../services/authfake.service';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthGuard  {
 
    constructor(private authenticationService: AuthenticationService,private router: Router){}
    canActivate(state: RouterStateSnapshot){
      if(this.authenticationService.loggedIn() ){
        return true
      }
      else{
        this.router.navigate(['/error'], { queryParams: { returnUrl: state.url } });
        return false
      }
    }
    getConnectedUser(){
      if(this.authenticationService.loadToken())
         return JSON.parse(atob(this.authenticationService.loadToken().split('.')[1])).sub;
    }
}
