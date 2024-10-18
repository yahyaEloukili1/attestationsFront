import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CitoyensListComponent } from './citoyens-list/citoyens-list.component';
import { CitoyensAddComponent } from './citoyens-add/citoyens-add.component';
import { CitoyensEditComponent } from './citoyens-edit/citoyens-edit.component';

const routes: Routes = [
  {
    path: "list",
    component: CitoyensListComponent
  },
  {
    path: "add",
    component: CitoyensAddComponent
  },
  {
    path: "edit/:id",
    component: CitoyensEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CitoyenRoutingModule { }
