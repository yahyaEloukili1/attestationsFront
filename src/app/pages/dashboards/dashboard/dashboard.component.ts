import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ToastService } from './toast-service';

import { circle, latLng, tileLayer } from 'leaflet';

import { ChartType } from './dashboard.model';
import { BestSelling, Recentelling, TopSelling, statData } from 'src/app/core/data';
import { restApiService } from 'src/app/core/services/rest-api.service copy';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

/**
 * Ecommerce Component
 */
export class DashboardComponent implements OnInit {
  currentUser
  editPhoto = true
  selectedFile
  progress
  currentFileUpload
  user: { role: { id: number, roleName: string } } = { role: null };
ngOnInit(): void {
  
}
constructor(public restService: restApiService){}

onEditPhoto(u){
this.currentUser = u;
this.editPhoto = true
}
onSelectedFile(event){
this.selectedFile = event.target.files;
}

uploadPhoto(f:NgForm){
  if(this.selectedFile){

this.progress = 0;
this.currentFileUpload= this.selectedFile.item(0)
this.restService.uploadPhotoUser(this.currentFileUpload,f.value).subscribe(event=>{
   console.log(f.value,"zkkk")
 if(event.type === HttpEventType.UploadProgress){
  this.progress = Math.round(100 * event.loaded /event.total);
 } 
else if(event instanceof HttpResponse){
  Swal.fire({
    position: 'center',
    icon: 'success',
    title: 'تم حفظ المستعمل بنجاح',
    showConfirmButton: true,
    confirmButtonColor: '#364574',
    customClass:{
      title: 'kuffi',
      confirmButton: 'kuffi',
      container: 'kuffi'
    }
  });
}
},err=>{
  alert("Probleme de chargement")
})
}else{
  
    f.value.role = `${this.restService.host}/appRoles/${f.value.role.id}`
    




  this.restService.addResource("appUsers",f.value).subscribe(data=>{
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'تم حفظ المستعمل بنجاح',
      showConfirmButton: true,
      confirmButtonColor: '#364574',
      customClass:{
        title: 'kuffi',
        confirmButton: 'kuffi',
        container: 'kuffi'
      }
    });

        },err=>{
          console.log(err)
        })
 
}
}
}