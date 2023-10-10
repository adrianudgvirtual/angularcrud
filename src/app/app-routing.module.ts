import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserManagementComponent } from './user-management/user-management.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: "inicio" , component: HomeComponent },  
  { path: 'usuarios', component: UserManagementComponent },
  { path: '**', redirectTo: 'inicio' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
