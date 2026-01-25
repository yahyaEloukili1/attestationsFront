import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { restApiService } from 'src/app/core/services/rest-api.service copy';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-delete-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-user.component.html',
  styleUrl: './delete-user.component.scss'
})
export class DeleteUserComponent {
  url
  currentResource
  roles
   role
  constructor(private restService: restApiService,private activatedRoute: ActivatedRoute,private router: Router){

  }
  ngOnInit(): void {
    this.getReources()
    this.url = atob(this.activatedRoute.snapshot.params['id'])
    console.log(this.url,'xxxxxxxxxx')
   this.restService.getOneResource(this.url).subscribe(data=>{
     this.currentResource = data;
     console.log(this.currentResource,",,,,,,,,,,,,,")
     let inputString = this.currentResource._links.role.href


     // Use the replace method to remove "{?projection}"
     let outputString = inputString.replace('{?projection}', '');
     
     console.log(outputString);
     
      this.getId(outputString)
   },err=>{
     console.log(err)
   })

 }
 getReources(){
  this.restService.getResourceAll('appRoles').subscribe(data=>{
    this.roles = data['_embedded'].appRoles  
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
modelWarning(){
  return   Swal.fire({
    title: 'هل أنت متأكد؟',
    text: 'سوف يتم الحذف بصفة نهائية!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#364574',
    cancelButtonColor: 'rgb(243, 78, 78)',
    cancelButtonText: 'إلغاء',
    customClass:{
      title: 'kuffi',
      confirmButton: 'kuffi',
      container: 'kuffi'
    },
    confirmButtonText: 'حذف'
  })
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
onDeleteResource(p){
 console.log(p['_links'].self.href)
this.modelWarning().then(result => {
    if (result.value) {
   
 
        
        this.restService.deleteResource('appUsers',`${this.restService.host}/appUsers/${p.id}`).subscribe(data=>{
        
          this.modelSuccess('لقد تم حذف المستعمل')
          this.router.navigateByUrl("/provinceLaayoune")
           },err=>{
            this.modelError('لا يمكن حدف المستعمل')
           })
      
      }
  
    
    }
  );
      
  }
}
