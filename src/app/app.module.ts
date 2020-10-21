import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { MaterialModule } from './material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AvatarModule } from 'ngx-avatar';
import { registerLocaleData } from '@angular/common';
import localeEsMx from '@angular/common/locales/es-MX';
registerLocaleData(localeEsMx, 'es-Mx');

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
import { BandejaEntradaComponent } from './components/bandeja-entrada/bandeja-entrada.component';
import { MainComponent } from './components/main/main.component';

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
    MainComponent
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
  providers: [
    { provide: LOCALE_ID, useValue: 'es-Mx' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
