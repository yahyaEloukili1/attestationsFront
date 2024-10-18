import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';

// Calendar option
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { EventInput } from '@fullcalendar/core';

// BootStrap
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormBuilder, Validators, UntypedFormGroup, NgForm } from '@angular/forms';
// Sweet Alert
import Swal from 'sweetalert2';

// Calendar Services
import { restApiService } from "../../../../core/services/rest-api.service copy";

import { DatePipe } from '@angular/common';
import { calendarEvents, category } from 'src/app/core/data';
import { createEventId } from 'src/app/core/data/calendar';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})

/**
 * Calendar Component
 */
export class CalendarComponent implements OnInit {
  currentUser
  editPhoto = true
  url
  selectedFile
  progress
  currentFileUpload
  currentResource
  user: { role: { id: number, roleName: string } } = { role: { id: 2, roleName: 'USER-DSIT'} };
  // user: { role: { id: number, roleName: string } }= { role: {id: 1, roleName: 'ADMIN'} };
  role = { id: 1, roleName: 'ADMIN'}; 

  selectedRole
  onRowClick(e){
  this.selectedRole = e.id
  }
  compareRoles(role1: any, role2: any): boolean {
    return role1 && role2 ? role1.id === role2.id : role1 === role2;
  }
ngOnInit(): void {


  this.url = this.restService.host+'/appUsers/'+this.activatedRoute.snapshot.params['id']
     this.restService.getOneResource(this.url).subscribe(data=>{
       this.currentResource = data;
       
       this.getId(this.currentResource._links.role.href)
     },err=>{
       console.log(err)
     })
}
getId(url: string) {
  console.log(url, "eiiiiii");
  // let u = url.slice(0,-9)
  console.log(url, '11111111111111&');

  this.restService.getOneResource(url).subscribe(data => {
    // Destructure the received data and create a new object without the _links property
    const { _links, ...newRole } = data;
this.role = newRole
    // Assign the new object to this.role
    console.log(this.role,"dddd")
   
  });
}

constructor(public restService: restApiService,private activatedRoute: ActivatedRoute){}

onEditPhoto(u){
this.currentUser = u;
this.editPhoto = true
}
onSelectedFile(event){
this.selectedFile = event.target.files;
}

uploadPhoto(f:NgForm){
  
this.progress = 0;
if(this.selectedFile){
 this.currentFileUpload= this.selectedFile.item(0)
console.log(this.selectedFile,'rrrrrr')
this.restService.uploadPhotoUser(this.currentFileUpload,f.value).subscribe(event=>{
   console.log(f.value,"zkkk")
 if(event.type === HttpEventType.UploadProgress){
  this.progress = Math.round(100 * event.loaded /event.total);
 } 
else if(event instanceof HttpResponse){
  Swal.fire({
    position: 'center',
    icon: 'success',
    title: 'تم تبديل المستعمل بنجاح',
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
  if(this.selectedRole){
    f.value.role = `${this.restService.host}/appRoles/${this.selectedRole}`
  }else{
    f.value.role = `${this.restService.host}/appRoles/${this.role.id}`
  }
  this.restService.updateResource(this.url,f.value).subscribe(data=>{
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'تم تبديل المستعمل بنجاح',
      showConfirmButton: true,
      confirmButtonColor: '#364574',
      customClass:{
        title: 'kuffi',
        confirmButton: 'kuffi',
        container: 'kuffi'
      }
    });
  },err=>{
    console.log(err,"errrrrrrrrrrrrrrrrrrrrrrrrrrrr")
  })
}
}
}
