import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginFirmaComponent } from '@comp/login-firma/login-firma.component';
import { LoginComponent } from '@comp/login/login.component';

const routes: Routes = [
 // { path: '', component: LoginComponent },
  { path: '', component: LoginFirmaComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
