import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { restApiService } from 'src/app/core/services/rest-api.service copy';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss'
})
export class UserDetailComponent {
  url
  currentResource
  roles
   role
  constructor(private restService: restApiService,private activatedRoute: ActivatedRoute){

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
}
