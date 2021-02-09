import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { MaterialModule } from './material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AvatarModule } from 'ngx-avatar';
import { registerLocaleData } from '@angular/common';
import localeEsMx from '@angular/common/locales/es-MX';
registerLocaleData(localeEsMx, 'es-Mx');
import { BnNgIdleService } from 'bn-ng-idle';

import { AppRoutingModule } from './app-routing.module';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CardElevationDirective } from './card-elevation.directive';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { MenuComponent } from './components/menu/menu.component';
import { LoginFirmaComponent } from './components/login-firma/login-firma.component';
import { BandejaEntradaComponent, DialogPeritoSociedad, DialogAsignaNotarioRevisor, DialogDescargaJustificante } from './components/bandeja-entrada/bandeja-entrada.component';
import { MainComponent } from './components/main/main.component';
import { SubirAvaluoComponent, DialogProgresoUpload } from './components/subir-avaluo/subir-avaluo.component';
import { BandejaEntradaPeritoComponent, DialogAsignaNotario, DialogDescargaJustificantePerito } from './components/bandeja-entrada-perito/bandeja-entrada-perito.component';
import { DialogoConfirmacionComponent } from './components/dialogo-confirmacion/dialogo-confirmacion.component';
import { AvaluosProximosComponent } from './components/avaluos-proximos/avaluos-proximos.component';
import { AcuseAvaluoComponent } from './components/acuse-avaluo/acuse-avaluo.component';
import { DialogValidacionesXML } from "@serv/file-upload.service";

@NgModule({
  declarations: [
    AppComponent,
    CardElevationDirective,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    MenuComponent,
    LoginFirmaComponent,
    BandejaEntradaComponent,
    DialogPeritoSociedad,
    DialogAsignaNotarioRevisor,
    MainComponent,
    SubirAvaluoComponent,
    DialogValidacionesXML,
    DialogProgresoUpload,
    BandejaEntradaPeritoComponent,
    DialogoConfirmacionComponent,
    AvaluosProximosComponent,
    DialogAsignaNotario,
    AcuseAvaluoComponent,
    DialogDescargaJustificantePerito,
    DialogDescargaJustificante,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AvatarModule,
    NgxMatFileInputModule,
  ],
  entryComponents: [
    DialogPeritoSociedad,
    DialogoConfirmacionComponent,
    DialogAsignaNotario,
    DialogAsignaNotarioRevisor,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-Mx' },
    BnNgIdleService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
