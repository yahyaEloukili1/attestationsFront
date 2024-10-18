import { Component } from '@angular/core';
import { AuthenticationService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'velzon';
  token
constructor(private authService: AuthenticationService){

}
ngOnInit(){
  
}
  met(){
    this.token = this.authService.loadToken()
    console.log(this.token,"ksksksksksk")
   }
}
