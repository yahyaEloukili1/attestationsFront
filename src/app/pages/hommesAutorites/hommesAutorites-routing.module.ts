import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { AddHommesAutoritesComponent } from './add-hommes-autorites/add-hommes-autorites.component';
import { HommeAutoritesComponent } from './homme-autorites/homme-autorites.component';



const routes: Routes = [
  {
    path: "list",
    component: HommeAutoritesComponent
  },
  {
    path: "add",
    component: AddHommesAutoritesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HommeAutoritesRoutingModule { }
