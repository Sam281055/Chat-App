import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login/login.component';
import { NoAuthGuard } from './guards/no-auth.guard';
import { AuthGuard } from './guards/auth.guard';
import { MainComponent } from './main/main.component';
import { Sala1Component } from './sala1/sala1.component';

const routes: Routes = [
  {
    path: "login",
    // loadChildren: () => import('./login/login/login.module').then(m => m.loginModule),
    component: LoginComponent,
    canActivate: [NoAuthGuard]
  },
  {
    path: 'main/home',
    component:MainComponent,
    canActivate: [AuthGuard]
  },{
    path: 'sala1',
    component:Sala1Component,
    canActivate: [AuthGuard]
  },{
    path: "",
    redirectTo: "login",
    pathMatch: "full"
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
