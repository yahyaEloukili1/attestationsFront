import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttestationsEditComponent } from './attestations-edit/attestations-edit.component';


const routes: Routes = [

  {
    path: "edit/:id",
    component: AttestationsEditComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttestationsRoutingModule {
  
 }
