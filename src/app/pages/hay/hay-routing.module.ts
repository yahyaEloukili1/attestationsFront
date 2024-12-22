import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HayListComponent } from './hay-list/hay-list.component';
import { HayAddComponent } from './hay-add/hay-add.component';
import { HayEditComponent } from './hay-edit/hay-edit.component';
import { WilayaOrAdminGuard } from 'src/app/core/guards/wilayaOrAdmin.guard';

const routes: Routes = [ {
  path: "list",
  component: HayListComponent
},
{
  path: "add",
  component: HayAddComponent,
  canActivate: [WilayaOrAdminGuard]
},
{
  path: "edit/:id",
  component: HayEditComponent,
  canActivate: [WilayaOrAdminGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HayRoutingModule { 
 
}
