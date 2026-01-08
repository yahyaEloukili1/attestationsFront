import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoucraaComponent } from './boucraa.component';

const routes: Routes = [
  {
    path: "",
    component: BoucraaComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersTestRoutingModule { }
