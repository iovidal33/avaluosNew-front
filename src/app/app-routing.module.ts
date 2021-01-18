import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BandejaEntradaComponent } from '@comp/bandeja-entrada/bandeja-entrada.component';
import { BandejaEntradaPeritoComponent } from '@comp/bandeja-entrada-perito/bandeja-entrada-perito.component';
import { LoginFirmaComponent } from '@comp/login-firma/login-firma.component';
import { LoginComponent } from '@comp/login/login.component';
import { MainComponent } from '@comp/main/main.component';
import { SubirAvaluoComponent } from '@comp/subir-avaluo/subir-avaluo.component';
import { GuardService } from '@serv/guard.service';
import { AvaluosProximosComponent } from '@comp/avaluos-proximos/avaluos-proximos.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  // { path: '', component: LoginFirmaComponent },
  {
    path: 'main', component: MainComponent, canActivate: [GuardService],
    children: [
       { path: 'bandeja-entrada', component: BandejaEntradaComponent, canActivate: [GuardService] },
       { path: 'subir-avaluo', component: SubirAvaluoComponent, canActivate: [GuardService] },
       { path: 'bandeja-entrada-perito', component: BandejaEntradaPeritoComponent, canActivate: [GuardService] },
       { path: 'avaluos-proximos', component: AvaluosProximosComponent, canActivate: [GuardService] }
    ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
