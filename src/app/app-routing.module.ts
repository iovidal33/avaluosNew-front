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
import { AcuseAvaluoComponent } from '@comp/acuse-avaluo/acuse-avaluo.component';
import { InvestigacionMercadoComponent } from '@comp/investigacion-mercado/investigacion-mercado.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  // { path: '', component: LoginFirmaComponent },
  {
    path: 'main', component: MainComponent, canActivate: [GuardService],
    children: [
       { path: 'bandeja-entrada', component: BandejaEntradaComponent, canActivate: [GuardService], data: {rol: 'revisor'} },
       { path: 'bandeja-entrada-perito', component: BandejaEntradaPeritoComponent, canActivate: [GuardService], data: {rol: 'perito'} },
       { path: 'subir-avaluo', component: SubirAvaluoComponent, canActivate: [GuardService] },
       { path: 'avaluos-proximos/:no_unico', component: AvaluosProximosComponent, canActivate: [GuardService] },
       { path: 'acuse-avaluo/:no_unico', component: AcuseAvaluoComponent, canActivate: [GuardService] },
       { path: 'investigacion-mercado', component: InvestigacionMercadoComponent, canActivate: [GuardService] },
    ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
