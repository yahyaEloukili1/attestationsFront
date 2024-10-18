import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DistrictAddComponent } from './district-add/district-add.component';
import { DistrictsListComponent } from './districts-list/districts-list.component';
import { DistrictsEditComponent } from './districts-edit/districts-edit.component';

const routes: Routes = [
  {
    path: "add",
    component: DistrictAddComponent
  },
  {
    path: "edit/:id",
    component: DistrictsEditComponent
  },
  {
    path: "list",
    component: DistrictsListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DistrictsRoutingModule {
  
 }
