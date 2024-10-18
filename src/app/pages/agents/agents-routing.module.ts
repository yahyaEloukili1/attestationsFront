import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { AddAagentComponent } from './add-aagent/add-aagent.component';
import { AgentsComponent } from './agents-list/agents.component';



const routes: Routes = [
  {
    path: "list",
    component: AgentsComponent
  },
  {
    path: "add",
    component: AddAagentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentsRoutingModule { }
