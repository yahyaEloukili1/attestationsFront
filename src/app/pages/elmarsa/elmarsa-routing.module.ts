import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ElmarsaComponent } from './elmarsa.component';

const routes: Routes = [
  {
    path: "",
    component: ElmarsaComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ElmarsaRoutingModule { }
