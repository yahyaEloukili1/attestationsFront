import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersListComponent } from './users-list/users-list.component';
import { UsersAddComponent } from './users-add/users-add.component';
import { UsersEditComponent } from './users-edit/users-edit.component';
import { UsersChangePasswordComponent } from './users-change-password/users-change-password.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { DeleteUserComponent } from './delete-user/delete-user.component';



const routes: Routes = [
  {
    path: "list",
    component: UsersListComponent
  },
  {
    path: "add",
    component: UsersAddComponent
  },
  {
    path: "edit/:id",
    component: UsersEditComponent
  },
  {
    path: "detail/:id",
    component: UserDetailComponent
  },
  {
    path: "changePassword/:id",
    component: UsersChangePasswordComponent
  },
  {
    path: "delete/:id",
    component: DeleteUserComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
