import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Observable,pipe, tap } from 'rxjs';
import { AuthenticationService } from './core/services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  
  constructor(private injector: Injector,private router: Router,private pdiServcie:AuthenticationService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  
    if(req.url==`http://localhost:8087/login`){

      return next.handle(req)
    }else{
      let pdiService = this.injector.get(AuthenticationService)
      
      let tokenizedRequest = req.clone({
        setHeaders: {
          Authorization: pdiService.loadToken()
        }
      })
      return next.handle(tokenizedRequest).pipe(
        tap(
          succ=>{},
          err=>{
            if(err.status===403){
              pdiService.logout()
              this.router.navigateByUrl('/auth/signin/cover')
            }
          }
        )
      )
    }

  }
  }

