import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ZanqaListComponent } from './zanqa-list/zanqa-list.component';
import { ZanqaAddComponent } from './zanqa-add/zanqa-add.component';
import { ZanqaEditComponent } from './zanqa-edit/zanqa-edit.component';


const routes: Routes = [ {
  path: "list",
  component: ZanqaListComponent
},
{
  path: "add",
  component: ZanqaAddComponent
},
{
  path: "edit/:id",
  component: ZanqaEditComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ZanqaRoutingModule { }
