import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';
import { AuthService } from '@serv/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import * as moment from 'moment';

export interface Filtros {
  fecha_ini: Date;
  fecha_fin: Date;
  region: string;
  manzana: string;
  tipo: number;
  alcaldia: number;
  colonia: number;
}
@Component({
  selector: 'app-investigacion-mercado',
  templateUrl: './investigacion-mercado.component.html',
  styleUrls: ['./investigacion-mercado.component.css']
})
export class InvestigacionMercadoComponent implements OnInit {
  endpoint = environment.endpoint;
  pagina = 1;
  total = 0;
  loading = false;
  dataSource = [];
  displayedColumns: string[] = ['alcaldia', 'colonia', 'region', 'manzana', 'ubicacion', 'descripcion', 'precios_solicitados', 'superficie', 'vu', 'tipo'];
  httpOptions;
  filtros: Filtros = {} as Filtros;
  isBusqueda;
  queryParamFiltros;
  @ViewChild('paginator') paginator: MatPaginator;
  canSearch = false;

  constructor() { }

  ngOnInit(): void {
    this.filtros.fecha_ini = new Date((new Date().getTime()));
  }

  validateDate(){
    if(moment(this.filtros.fecha_ini).format('YYYY-MM-DD') > moment(this.filtros.fecha_fin).format('YYYY-MM-DD')){
      this.canSearch = false;        
    }else{
      this.canSearch = true;
    }
  }

  clean(): void{
    console.log("limpiar");
  }

  getData(isSearch): void {
    console.log(isSearch);
  }

}
