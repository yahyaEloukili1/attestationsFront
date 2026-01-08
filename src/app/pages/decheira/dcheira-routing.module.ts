import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DecheiraComponent } from './decheira.component';

const routes: Routes = [
  {
    path: "",
    component: DecheiraComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersTestRoutingModule { }
