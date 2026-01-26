import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cover',
  templateUrl: './cover.component.html',
  styleUrls: ['./cover.component.scss']
})

/**
 * Cover Component
 */
export class CoverComponent implements OnInit {


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
       this.router.navigateByUrl("")
    }
    
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  /**
   * Form submit
   */
  getConnectedUserRole(){
    if(this.authenticationService.loadToken()){
      return JSON.parse(atob(this.authenticationService.loadToken().split('.')[1])).roles[0].authority
    }
   }
  onSubmit() {

    this.submitted = true;
     // Login Api
    // this.store.dispatch(login({ email: this.f['email'].value, password: this.f['password'].value }));
    
    if(this.f['name'].value!="" && this.f['password'].value!=""){
     this.authenticationService.login2({ username: this.f['name'].value, password: this.f['password'].value }).subscribe(resp=>{
      
      let jwt = resp.headers.get('Authorization')
     this.authenticationService.saveToken(jwt);
     console.log(this.getConnectedUserRole(),"vvvvvvvvvvvv")
     if(this.getConnectedUserRole()=='ADMIN'){
      this.router.navigateByUrl("maroc")
     }else if(this.getConnectedUserRole()=='USER-DSIT'){
      this.router.navigateByUrl("annexes/list")
     }else{
      this.router.navigateByUrl("citoyens/list")
     }
    
      console.log(jwt)
      
    },err=>{
   this.errAuth = 1
   this.modelTitle()
    })
  }
  }

  modelTitle() {
    Swal.fire({
      title: 'Identifiants incorrects',
      text: 'Veuillez vérifier vos informations et réessayer.',
      icon: 'error',
      confirmButtonColor: '#364574',
      confirmButtonText: 'Fermer',
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
