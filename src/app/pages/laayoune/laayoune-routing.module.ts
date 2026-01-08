import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LaayouneComponent } from './laayoune.component';

const routes: Routes = [
  {
    path: "",
    component: LaayouneComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LaayouneRoutingModule { }
