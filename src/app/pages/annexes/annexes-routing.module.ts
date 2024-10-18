import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnnexesListComponent } from './annexes-list/annexes-list.component';
import { AnnexesAddComponent } from './annexes-add/annexes-add.component';
import { AnnexesEditComponent } from './annexes-edit/annexes-edit.component';

const routes: Routes = [
  {
    path: "list",
    component: AnnexesListComponent
  },
  {
    path: "add",
    component: AnnexesAddComponent
  },
  {
    path: "edit/:id",
    component: AnnexesEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnnexesRoutingModule { }
