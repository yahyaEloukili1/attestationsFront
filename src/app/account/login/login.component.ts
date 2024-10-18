import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Login Auth
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../core/services/authfake.service';
import { first } from 'rxjs/operators';
import { ToastService } from './toast-service';
import { Store } from '@ngrx/store';
import { login } from 'src/app/store/Authentication/authentication.actions';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

/**
 * Login Component
 */
export class LoginComponent implements OnInit {

  // Login Form
  loginForm!: UntypedFormGroup;
  submitted = false;
  fieldTextType!: boolean;
  error = '';
  returnUrl!: string;
  // set the current year
  year: number = new Date().getFullYear();
  // Carousel navigation arrow show
  showNavigationArrows: any;
errAuth=0
  constructor(private formBuilder: UntypedFormBuilder,private authenticationService: AuthenticationService,private router: Router) { }

  ngOnInit(): void {

    /**
     * Form Validatyion
     */
     this.loginForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      password: ['', Validators.required],
    });
    if(this.authenticationService.loadToken()){
      console.log("okkkkkk")
       this.router.navigateByUrl("pages")
    }
    
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  /**
   * Form submit
   */
  onSubmit() {

    this.submitted = true;
     // Login Api
    // this.store.dispatch(login({ email: this.f['email'].value, password: this.f['password'].value }));
    
    if(this.f['name'].value!="" && this.f['password'].value!=""){
     this.authenticationService.login2({ username: this.f['name'].value, password: this.f['password'].value }).subscribe(resp=>{
      
      let jwt = resp.headers.get('Authorization')
     this.authenticationService.saveToken(jwt);
     console.log(resp)
     this.router.navigateByUrl("pages")
      console.log(jwt)
      
    },err=>{
   this.errAuth = 1
   this.modelTitle()
    })
  }
  }

  modelTitle() {
    Swal.fire({
      title: 'بيانات الدخول غير صحيحة ',
      text: ' يرجى التأكد من البيانات وإعادة المحاولة',
      icon: 'error',
      confirmButtonColor: '#364574',
      confirmButtonText: 'إغلاق',
      customClass:{
        title: 'kuffi',
        confirmButton: 'kuffi',
        container: 'kuffi'
      }
    });
    
  }
  /**
   * Password Hide/Show
   */
   toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

}
