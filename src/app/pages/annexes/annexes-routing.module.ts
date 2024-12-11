import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnnexesListComponent } from './annexes-list/annexes-list.component';
import { AnnexesAddComponent } from './annexes-add/annexes-add.component';
import { AnnexesEditComponent } from './annexes-edit/annexes-edit.component';
import { WilayaOrAnnexeOrAdminGuard } from 'src/app/core/guards/wilayaOrAnnexeOrAdminGuard';
import { WilayaOrAdminGuard } from 'src/app/core/guards/wilayaOrAdmin.guard';

const routes: Routes = [
  {
    path: "list",
    component: AnnexesListComponent,
    canActivate: [WilayaOrAnnexeOrAdminGuard]
  },
  {
    path: "add",
    component: AnnexesAddComponent,
    canActivate: [WilayaOrAdminGuard]
  },
  {
    path: "edit/:id",
    component: AnnexesEditComponent,
    canActivate: [WilayaOrAdminGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnnexesRoutingModule { }
