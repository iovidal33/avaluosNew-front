import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';
import { AuthService } from '@serv/auth.service';
import * as moment from 'moment';

export interface Filtros {
  fecha_ini: Date;
  fecha_fin: Date;
  no_avaluo: string;
  no_unico: string;
  region: string;
  manzana: string;
  lote: string;
  unidad: string;
  estado: string;
  vigencia: string;
}

@Component({
  selector: 'app-bandeja-entrada-perito',
  templateUrl: './bandeja-entrada-perito.component.html',
  styleUrls: ['./bandeja-entrada-perito.component.css']
})
export class BandejaEntradaPeritoComponent implements OnInit {

  endpoint = environment.endpoint + 'bandeja-entrada/avaluos';
  pagina = 1;
  total = 0;
  loading = false;
  displayedColumns: string[] = ['no_unico','no_avaluo', 'cuenta_cat', 'fecha_pres',
  'estado', 'perito', 'sociedad', 'notario', 'tipo', 'dict', 'select'];
  dataSource = [];
  httpOptions;
  filtros: Filtros = {} as Filtros;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private auth: AuthService,
  ) { }

  ngOnInit(): void {
    this.filtros.estado = '';
    this.filtros.vigencia = '';
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: this.auth.getSession().token
      })
    };
    this.getData();
  }

  paginado(evt): void{
    this.pagina = evt.pageIndex + 1;
    this.getData();
  }

  getData(): void {
    this.loading = true;
    let filtros = '';
    if(this.filtros.fecha_fin && this.filtros.fecha_ini){
      filtros = filtros + '&fecha_ini=' + moment(this.filtros.fecha_ini).format('YYYY-MM-DD') +
      '&fecha_fin=' + moment(this.filtros.fecha_fin).format('YYYY-MM-DD');
    }
    if(this.filtros.no_avaluo){
      filtros = filtros + '&no_avaluo=' + this.filtros.no_avaluo; 
    }
    if(this.filtros.no_unico){
      filtros = filtros + '&no_unico=' + this.filtros.no_unico;
    }
    if(this.filtros.region && this.filtros.manzana && this.filtros.lote && this.filtros.unidad){
      filtros = filtros + '&cta_catastral=' + this.filtros.region
      + '-' + this.filtros.manzana + '-' + this.filtros.lote + '-' +  this.filtros.unidad;
    }
    if(this.filtros.estado){
      filtros = filtros + '&estado=' + this.filtros.estado;
    }
    if(this.filtros.vigencia){
      filtros = filtros + '&vigencia=' + this.filtros.vigencia;
    }
    this.http.get(this.endpoint + '?page=' + this.pagina + filtros,
      this.httpOptions).subscribe(
        (res: any) => {
          this.loading = false;
          this.dataSource = res.data;
          this.total = res.total;
        },
        (error) => {
          this.loading = false;
          this.snackBar.open(error.error.mensaje, 'Cerrar', {
            duration: 10000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        });
  }

  clean(): void{
    this.filtros = {} as Filtros;
    this.filtros.estado = '';
    this.filtros.vigencia = '';
  }

}
