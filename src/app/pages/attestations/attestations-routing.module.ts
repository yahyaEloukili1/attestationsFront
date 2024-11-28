import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttestationsEditComponent } from './attestations-edit/attestations-edit.component';
import { AddAttestationComponent } from './add-attestation/add-attestation.component';
import { AttestationsListComponent } from './attestations-list/attestations-list.component';


const routes: Routes = [

  {
    path: "edit/:id",
    component: AttestationsEditComponent
  }
,
{
  path: "add",
  component: AddAttestationComponent
},
{
  path: "list",
  component: AttestationsListComponent
}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttestationsRoutingModule {
  
 }
