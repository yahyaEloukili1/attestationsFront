import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';

import { GlobalComponent } from "../../global-component";
import { Observable, groupBy, mergeMap, toArray } from 'rxjs';
import { saveAs } from 'file-saver';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('token')}` })
};


@Injectable({
  providedIn: 'root'
})
export class restApiService {
  host= 'http://localhost:8087'
  // host ='//10.39.6.25:8088'
  jwtToken = null;
 constructor(private http: HttpClient) { }

 getResourceAll(resource: String):Observable<any[]>{
   if(this.jwtToken ==null)
   this.loadToken()
   return this.http.get<any[]>(`${this.host}/${resource}?size=1000000000`);
}

getResourceAll2(resource: String):Observable<any[]>{
  if(this.jwtToken ==null)
  this.loadToken()
  return this.http.get<any[]>(`${this.host}/${resource}`);
}
getResourceAll3(resource: String):Observable<any[]>{
  if(this.jwtToken ==null)
  this.loadToken()
  return this.http.get<any[]>(`${this.host}/allAAL
  `);
}
 getResource(resource: String,page:number,size:number):Observable<any[]>{ if(this.jwtToken ==null)
   this.loadToken()
     return this.http.get<any[]>(`${this.host}/${resource}?page=${page}&size=${size}`);
 }

 getLast():Observable<any[]>{ if(this.jwtToken ==null)
  this.loadToken()
    return this.http.get<any[]>(`${this.host}/getLast`);
}

 addResource(resource: string,value:any):Observable<any>{ if(this.jwtToken ==null)
   this.loadToken()
   return this.http.post<any>(`${this.host}/${resource}`,value);
}
updatePassword(userId: number, newPassword: string): Observable<any> {
  const url = `${this.host}/update-password/${userId}`;
  return this.http.post<any>(url, newPassword, { responseType: 'text' as 'json' });
}
 getResourceByKeyword(resource: String,page:number,size:number,mc:string,source:string):Observable<any[]>{ if(this.jwtToken ==null)
   this.loadToken()
   console.log(`${this.host}/${resource}/search/by${source}Page?mc=${mc}&page=${page}&size=${size}`,"aaaaaaaaaaaaaaaaaaaaa")
   return this.http.get<any[]>(`${this.host}/${resource}/search/findBy${source}?cin=${mc}&page=${page}&size=${size}`);

}

getResourceByKeywordNoPage(resource: String,size:number,mc:string,source:string):Observable<any[]>{ if(this.jwtToken ==null)
 this.loadToken()
 return this.http.get<any[]>(`${this.host}/${resource}/search/by${source}Page?mc=${mc}&size=${size}`);
}


deleteResource(resource:string,url:string){ if(this.jwtToken ==null)
 this.loadToken()
return this.http.delete(url);
}
deleteResourceById(url:string){ if(this.jwtToken ==null)
  this.loadToken()
 return this.http.delete(url);
 }
 deleteResourceById2(url:string){ if(this.jwtToken ==null)
  this.loadToken()
 return this.http.delete(url);
 }
getOneResource(url:string):Observable<any>{ if(this.jwtToken ==null)
 this.loadToken()
return this.http.get<any>(url)
}
getOneResource3(url: string, params: any): Observable<any> {
  this.loadToken()
  const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    params: new HttpParams({ fromObject: params }) // Convert params to HttpParams
  };

  return this.http.get(url, httpOptions);
}



getOneResourceById(resource:string,id:number):Observable<any>{ if(this.jwtToken ==null)
 this.loadToken()
 return this.http.get<any>(`${this.host}/${resource}/${id}`)
}




updateResource(url:string,data:any){ if(this.jwtToken ==null)
 this.loadToken()
 console.log(url)
 return this.http.patch(url,data)
}
login(user){ 
  return this.http.post(this.host+"/login",user,{observe: 'response'})
}

saveToken(jwt){
  localStorage.setItem('token',jwt);
}
loadToken(){
  this.jwtToken = localStorage.getItem('token');
  return this.jwtToken
}
downloadAll(url){
  console.log(this.host+url,"azazazzaazzzzzzzzzzzzz")
  return this.http.get(this.host+url)
}
uploadFile1(format: string) {
  const url = `${this.host}/report/${format}`;
  return this.http.get(url, {
    responseType: 'blob' // set the response type to 'blob'
  }).subscribe((blob: Blob) => {
    saveAs(blob, `report.${format}`); // download the blob as a file
  });
}

// uploadFileWithData( data: any) {
//   const url = `${this.host}/report4/`;
  
//   // Send a POST request with data in the request body
//   return this.http.post(url, data, {
//     responseType: 'blob'
//   }).subscribe((blob: Blob) => {
//     saveAs(blob, `report.pdf`);
//   });
// }

uploadFileWithData(role: string,pachalik: string,district: string,annexe: string, data: any) {
  const url = `${this.host}/report5`;

let newData = data.map(item => {
  // Create a new object without the _links property
  let { _links, ...newItem } = item;
  return newItem;
});
let count = 'المجموع: '+newData.length;
console.log(newData,"zazazazazazazazazazzzezfff")
  const body = {
    role: role,
    pachalik: pachalik,
    district: district,
    count: count,
    annexe: annexe,
    data: JSON.stringify(newData) // Convert data to a JSON string
  };

  // Send a POST request with data in the request body
  return this.http.post(url, body, {
    responseType: 'blob'
  }).subscribe((blob: Blob) => {
    saveAs(blob, `report.pdf`);
  });
}



uploadFileArchive(format: string) {
  const url = `${this.host}/reportArchive/${format}`;
  return this.http.get(url, {
    responseType: 'blob' // set the response type to 'blob'
  }).subscribe((blob: Blob) => {
    saveAs(blob, `report.${format}`); // download the blob as a file
  });
}
uploadFile2(format: string) {
  const url = `${this.host}/report2/${format}`;
  return this.http.get(url, {
    responseType: 'blob' // set the response type to 'blob'
  }).subscribe((blob: Blob) => {
    saveAs(blob, `report.${format}`); // download the blob as a file
  });
}
getAllBenificiairesGroupedByCin(resource): Observable<any> {
  return this.http.get(`${this.host}/${resource}`).pipe(
    groupBy((b: any) => b.cin),
    mergeMap(group => group.pipe(toArray()))
  );
}


// uploadFile1(){
//   return this.http.get(this.host+'/report/pdf/')
// }




logout(){
  this.jwtToken = null
  localStorage.removeItem('token')

}
loggedIn(){
  return !!localStorage.getItem('token')
}
// uploadPhotoUser(file: File,idUser):Observable<HttpEvent<{}>>{
// let formData: FormData = new FormData();
// formData.append('file',file);
// const req  = new HttpRequest('POST',this.host+'/uploadPhoto/'+idUser,formData,{
//   reportProgress: true,
//   responseType: 'text'
// });
// return this.http.request(req);
// }
uploadPhotoUser(file: File, userObject: any): Observable<HttpEvent<{}>> {
  let formData: FormData = new FormData();
  formData.append('file', file);
  formData.append('userObject', JSON.stringify(userObject)); // Convert userObject to JSON and append to formData

  const req = new HttpRequest('POST', this.host + '/uploadPhoto/', formData, {
    reportProgress: true,
    responseType: 'text'
  });

  return this.http.request(req);
}

uploadPhotoCitoyen(file: File,fileExtrait: File,fileCin1: File, fileCin2: File, userObject: any): Observable<HttpEvent<{}>> {
  let formData: FormData = new FormData();
  formData.append('file', file);
  formData.append('fileExtrait', fileExtrait);
  formData.append('fileCin1', fileCin1);
  formData.append('fileCin2', fileCin2);
  formData.append('userObject', JSON.stringify(userObject)); // Convert userObject to JSON and append to formData

  const req = new HttpRequest('POST', this.host + '/uploadPhotoCitoyen/', formData, {
    reportProgress: true,
    responseType: 'text'
  });

  return this.http.request(req);
}

}
