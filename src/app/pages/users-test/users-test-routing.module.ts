import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersTestListComponent } from './users-test-list/users-test-list.component';

const routes: Routes = [
  {
    path: "",
    component: UsersTestListComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersTestRoutingModule { }
