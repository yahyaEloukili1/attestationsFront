import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Component pages
import { DashboardComponent } from "./dashboards/dashboard/dashboard.component";
import { AdminGuard } from '../core/guards/admin.guard';
import { WilayaOrAdminGuard } from '../core/guards/wilayaOrAdmin.guard';
import { AuthGuard } from '../core/guards/auth.guard';
import { ErrorComponent } from './error/error.component';
import { CoverComponent } from '../account/auth/signin/cover/cover.component';
import { WilayaOrAnnexeGuard } from '../core/guards/wilayaOrAnnexe.guard copy';
import { WilayaOrAnnexeOrAdminGuard } from '../core/guards/wilayaOrAnnexeOrAdminGuard';
import { AnnexeGuard } from '../core/guards/AnnexeGuard';


const routes: Routes = [
    {
        path: "",
        redirectTo : "error",
        pathMatch: 'full'
    },
    {
      path: "error",
      component: ErrorComponent
  },
  
    {
      path: '', loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule)
    },
    {
      path: 'boucraa', loadChildren: () => import('./boucraa/boucraa.module').then(m => m.BoucraaModule),canActivate:[AdminGuard]
    },
      {
      path: 'dcheira', loadChildren: () => import('./decheira/dcheira.module').then(m => m.DcheiraModule),canActivate:[AdminGuard]
    },
        {
      path: 'laayoune', loadChildren: () => import('./laayoune/laayoune.module').then(m => m.LaayouneModule),canActivate:[AdminGuard]
    },
       {
      path: 'maroc', loadChildren: () => import('./region/region.module').then(m => m.RegionModule),canActivate:[AdminGuard]
    },
      {
      path: 'regionLaayoune', loadChildren: () => import('./region-laayoune/regionLaayoune.module').then(m => m.RegionLaayouneModule),canActivate:[AdminGuard]
    },
     {
      path: 'foumelouad', loadChildren: () => import('./foumelouad/foumelouad-routing.module').then(m => m.FoumelouadRoutingModule),canActivate:[AdminGuard]
    },
     {
      path: 'elmarsa', loadChildren: () => import('./elmarsa/elmarsa-routing.module').then(m => m.ElmarsaRoutingModule),canActivate:[AdminGuard]
    },
        {
      path: 'annexes', loadChildren: () => import('./annexes/annexes.module').then(m => m.AnnexesModule),canActivate:[WilayaOrAnnexeOrAdminGuard]
    },
    {
      path: 'agents', loadChildren: () => import('./agents/agents.module').then(m => m.AgentsModule),canActivate:[WilayaOrAnnexeOrAdminGuard]
    },
    {
      path: 'citoyens', loadChildren: () => import('./citoyens/citoyen.module').then(m => m.CitoyenModule),canActivate:[WilayaOrAnnexeOrAdminGuard]
    },
    {
      path: 'attestations', loadChildren: () => import('./attestations/attestations.module').then(m => m.AttetstationsModule),canActivate:[AnnexeGuard]
    },
    {
      path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule), canActivate: [AdminGuard]
    },
    {
      path: 'usersTest', loadChildren: () => import('./users-test/users-test.module').then(m => m.UsersTestModule), canActivate: [AdminGuard]
    },
    {
      path: 'districts', loadChildren: () => import('./districts/districts.module').then(m => m.DistrictsModule),canActivate:[WilayaOrAnnexeOrAdminGuard]
    },
    {
      path: 'quartiers', loadChildren: () => import('./hay/hay.module').then(m => m.HayModule),canActivate:[WilayaOrAnnexeOrAdminGuard]
    },
    {
      path: 'rues', loadChildren: () => import('./shari3/shari3.module').then(m => m.Shari3Module),canActivate:[WilayaOrAnnexeOrAdminGuard]
    },
    {
      path: 'ruelles', loadChildren: () => import('./zanqa/zanqa.module').then(m => m.ZanqaModule),canActivate:[WilayaOrAnnexeOrAdminGuard]
    },
    {
      path: 'hommesAutorites', loadChildren: () => import('./hommesAutorites/hommesAutorites.module').then(m => m.HommeAutoritesModule),canActivate:[WilayaOrAnnexeOrAdminGuard]
    }
   
   ,
    // {
    //   path: 'apps', loadChildren: () => import('./apps/apps.module').then(m => m.AppsModule)
    // },
    // {
    //   path: 'ecommerce', loadChildren: () => import('./ecommerce/ecommerce.module').then(m => m.EcommerceModule)
    // },
    // {
    //   path: 'projects', loadChildren: () => import('./projects/projects.module').then(m => m.ProjectsModule)
    // },
    // {
    //   path: 'tasks', loadChildren: () => import('./tasks/tasks.module').then(m => m.TasksModule)
    // },
    // {
    //   path: 'crm', loadChildren: () => import('./crm/crm.module').then(m => m.CrmModule)
    // },
    // {
    //   path: 'crypto', loadChildren: () => import('./crypto/crypto.module').then(m => m.CryptoModule)
    // },
    // {
    //   path: 'invoices', loadChildren: () => import('./invoices/invoices.module').then(m => m.InvoicesModule)
    // },
    // {
    //   path: 'tickets', loadChildren: () => import('./tickets/tickets.module').then(m => m.TicketsModule)
    // },
    {
      path: 'pages', loadChildren: () => import('./extrapages/extraspages.module').then(m => m.ExtraspagesModule)
    },
    // { path: 'ui', loadChildren: () => import('./ui/ui.module').then(m => m.UiModule) },
    // {
    //   path: 'advance-ui', loadChildren: () => import('./advance-ui/advance-ui.module').then(m => m.AdvanceUiModule)
    // },
    // {
    //   path: 'forms', loadChildren: () => import('./form/form.module').then(m => m.FormModule)
    // },
    // {
    //   path: 'users', loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule)
    // },
    // {
    //   path: 'charts', loadChildren: () => import('./charts/charts.module').then(m => m.ChartsModule)
    // },
    // {
    //   path: 'icons', loadChildren: () => import('./icons/icons.module').then(m => m.IconsModule)
    // },
    // {
    //   path: 'maps', loadChildren: () => import('./maps/maps.module').then(m => m.MapsModule)
    // },
    // {
    //   path: 'marletplace', loadChildren: () => import('./nft-marketplace/nft-marketplace.module').then(m => m.NftMarketplaceModule)
    // }
  
   
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
