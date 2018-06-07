import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { GoodsComponent } from './goods/goods.component';
import { UsersComponent } from './users/users.component';
import { ContractorsComponent } from './contractors/contractors.component';
import { SigninComponent } from './signin/signin.component';
import { NotfoundComponent } from './notfound/notfound.component';
import {AuthGuard} from './auth-guard.service';

const appRoutes: Routes = [
  { path: '',  redirectTo: '/goods', pathMatch: 'full'},
  { path: 'goods',  component: GoodsComponent},
  { path: 'users',  component: UsersComponent, canActivate: [AuthGuard]},
  { path: 'contractors',  component: ContractorsComponent, canActivate: [AuthGuard]},
  { path: 'login', component: SigninComponent},
  { path: '**', component: NotfoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
