import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { restApiService } from 'src/app/core/services/rest-api.service copy';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { number } from 'echarts';

@Component({
  selector: 'app-annexes-list',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './annexes-list.component.html',
  styleUrl: './annexes-list.component.scss'
})
export class AnnexesListComponent {

  size:number = 10;
  currentPage:number = 0;
  totalPages: number;
  communes 
  provinces
  pages: Array<number>
  selected: boolean
  annexes
  selectedDistrict:any = ""
  districts
  districtSelected = false
  selectedE
  totalCount
  districtName: string;
  constructor(private rnpService: restApiService,private router: Router) { }

  ngOnInit(): void {
    this.getAnnexes(this.currentPage)
    this.getDistricts()
}
getDistricts(){
  this.rnpService.getResourceAll('districts').subscribe(data=>{
    this.districts = data['_embedded'].districts
})

}
getAnnexes(page){
  
 this.setTotalCount()
 this.rnpService.getResource("annexes",page,this.size).subscribe(data=>{
  this.annexes = data['_embedded'].annexes
  console.log(data,"rorfo")
  console.log(this.annexes,"szszsz")
  this.totalPages = data['page'].totalPages
  this.pages = new Array<number>(this.totalPages);
 },err=>{
   console.log(err)
 })
}
setTotalCount(){
 
  this.rnpService.getResourceAll('annexes').subscribe(data=>{
    let annexes = data['_embedded'].annexes
   
    if(annexes){
    this.totalCount = annexes.length

  }
})
}
addResource(){
  this.router.navigateByUrl("annexes/add")

}
logique(e){
  let d;

  d= this.selectedDistrict == 0 || this.selectedDistrict == ""? undefined : this.selectedDistrict;
  
    let url = `${this.rnpService.host}/annexes/search/findAnnexesByDistrictId2?`;

  if (d !== undefined) {
    url += `districtId=${d}`;
  }
  
 
    

  
     this.rnpService.getOneResource(url).subscribe(
      data => {
       let annexes = data['_embedded'].annexes
      
       if(annexes){
       this.totalCount = annexes.length
      
      }
      },
      err => {
       console.log(err);
      }
      );
      
}

logique2(){

  let d;
 
  d= this.selectedDistrict == 0 || this.selectedDistrict == ""? undefined : this.selectedDistrict;
  
    let url = `${this.rnpService.host}/annexes/search/findAnnexesByDistrictId?`;

 if (d !== undefined) {
   url += `districtId=${d}`;
 }
 
  
  
 
 
    
    url+=`&page=${this.currentPage}&size=${this.size}`
    console.log(url,this.currentPage,'szszszq')
    
  this.rnpService.getOneResource(url).subscribe(
  data => {
   this.annexes = data['_embedded'].annexes;
   console.log(data,"szszeedrr")
   this.totalPages = data['page'].totalPages
   this.pages = new Array<number>(this.totalPages);

  },
  err => {
   console.log(err);
  }
  );
}
onDistrictClicked(e, page = 0) {
  this.getAnnexes(e)
  if(e!=0){
    this.rnpService.getOneResourceById("districts",e).subscribe(data=>{
      console.log(data.designation,"jhjjhjhh")
      this.districtName = data.designation

    })
  }else{
    this.districtName = ""
  
  }
  this.setTotalCountForDistrictSelected(e)
 
  this.selectedDistrict = e;

 
  this.districtSelected =true

  this.currentPage = page;
 this.logique2()
 
  
 }
 setTotalCountForDistrictSelected(e){

  this.selectedDistrict = e;
  
  this.districtSelected = true;
  
 this.logique(e)

 
 
}
onPageClicked(i:number){

  console.log(this.districtSelected,'district selected')
  
    this.currentPage = i;
  
  if(this.districtSelected==false)
  {this.getAnnexes(i)
    console.log("rfrfrfrf")
  }
  else{

    if(this.districtSelected ==true){
      this.onDistrictClicked(this.selectedDistrict,this.currentPage)
      console.log("districtt")
    }
  
  
  }
  
  }

  onSelectedSize(e){
    this.size = e.target.value
    this.getDisplayRange()
    this.selectedDistrict=""
    
    // this.getUsers(0) 

      if(this.districtSelected==false)
      {this.getAnnexes(0)
      }
      else{
    
        if(this.districtSelected ==true){
          this.onDistrictClicked(this.selectedDistrict,0)
          console.log("districtt")
        }
        
      }
    }
    

    getDisplayRange(): string {
      console.log('size',this.size)
      console.log('cureet page ',this.currentPage)
      console.log('Total count ',this.totalCount)
      let startEntry = ((Number(this.currentPage) - 1) * Number(this.size) + 1)+Number(this.size);
      let start = startEntry+this.size
      console.log(startEntry,"ssssssssssssssss")
      console.log(this.size,"size")
       let endEntry = (Math.min((Number(this.currentPage) * Number(this.size))+Number(this.size), Number(this.totalCount)));
     console.log(this.currentPage,'mmmmmmmmmmmmmm')
      if (this.annexes?.length==0) {
        return `No entries to display`;
    }
    
      return ` إظهار ${Number(startEntry)} إلى ${Number(endEntry)} من أصل   ${Number(this.totalCount)}`;
    }
    
    goToPreviousPage() {
      if (this.currentPage > 0) {
          this.currentPage--;
          // You can add logic here to update data based on the new current page
      }
      this.onPageClicked(this.currentPage)
      this.getDisplayRange()
  }
  goToNextPage() {
    if (this.currentPage < this.pages.length - 1) {
        this.currentPage++;
        // You can add logic here to update data based on the new current page
    }
    this.onPageClicked(this.currentPage)
   
  }
  
}

