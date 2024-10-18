import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { restApiService } from 'src/app/core/services/rest-api.service copy';
import { ActivatedRoute } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users-change-password',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './users-change-password.component.html',
  styleUrl: './users-change-password.component.scss'
})
export class UsersChangePasswordComponent {
id
user
formSubmitted: boolean = false;
  constructor(private http: HttpClient,private restService: restApiService,private activatedRoute: ActivatedRoute) { }
  ngOnInit(): void {
  this.getUser()
  }
  getUser(){
    this.id = this.activatedRoute.snapshot.params['id']
    //  this.restService.getOneResourceById("appUsers",this.id).subscribe(data=>{
    //   this.user = data
    //  })
  }
  changePassword(f:NgForm){
    this.formSubmitted = true;
    if(!f.valid || f.value.password!=f.value.confirmPassword){
    this.modelError( 'يرجى التأكد من البيانات وإعادة المحاولة')
    }else{
 
      this.formSubmitted  = false
      console.log(f.value)
      this.restService.updatePassword(this.id, f.value.password).subscribe(data=>{
        console.log(data)
      }
      
      );
      this.reset(f)
    }
 

  }
  modelError(error) {
    Swal.fire({
    
      title: error,
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
  modelSuccess(text) {
    Swal.fire({
      
      position: 'center',
      icon: 'success',
      title: text,
      showConfirmButton: true,
      confirmButtonColor: '#364574',
      customClass:{
        title: 'kuffi',
        confirmButton: 'kuffi',
        container: 'kuffi'
      }
    });
    
  }
  reset(f){
    f.reset()

  }
}
