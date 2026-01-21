import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegionLaayouneComponent } from './region-laayoune.component';

const routes: Routes = [
  {
    path: "",
    component: RegionLaayouneComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegionLaayouneRoutingModule { }
