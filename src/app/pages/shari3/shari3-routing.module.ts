import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Shari3ListComponent } from './shari3-list/shari3-list.component';
import { Shari3AddComponent } from './shari3-add/shari3-add.component';
import { Shari3EditComponent } from './shari3-edit/shari3-edit.component';
import { WilayaOrAdminGuard } from 'src/app/core/guards/wilayaOrAdmin.guard';

const routes: Routes = [ {
  path: "list",
  component: Shari3ListComponent
},
{
  path: "add",
  component: Shari3AddComponent,
  canActivate: [WilayaOrAdminGuard]
},
{
  path: "edit/:id",
  component: Shari3EditComponent,
  canActivate: [WilayaOrAdminGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Shari3RoutingModule { }
