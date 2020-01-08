import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContentComponent } from './content.component';
import { LoginComponent } from './login.component';
import { BaseFlightComponent } from './base-flight.component';
import { AuthGuardService } from './auth-guard.service';


const routes: Routes = [
  { path: '', component: BaseFlightComponent, canActivate: [ AuthGuardService ], data: {animation: 'base'} },
  { path: 'login', component: LoginComponent, data: {animation: 'login'} },
  { path: 'person', component: ContentComponent, canActivate: [ AuthGuardService ], data: {animation: 'content'} },
  { path: 'strength', component: ContentComponent, canActivate: [ AuthGuardService ], data: {animation: 'content'} },
  { path: 'projects', component: ContentComponent, canActivate: [ AuthGuardService ], data: {animation: 'content'} },
  { path: 'technologies', component: ContentComponent, canActivate: [ AuthGuardService ], data: {animation: 'content'} },
  { path: 'interests', component: ContentComponent, canActivate: [ AuthGuardService ], data: {animation: 'content'} },
  { path: '*', redirectTo: '/', canActivate: [ AuthGuardService ], data: {animation: 'base'} }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
