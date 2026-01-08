import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FoumelouadComponent } from './foumelouad.component';

const routes: Routes = [
  {
    path: "",
    component: FoumelouadComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FoumelouadRoutingModule { }
