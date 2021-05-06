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
  pageSize = 15;
  pagina = 1;
  total = 0;
  loading = false;
  dataSource = [];
  dataInforme = [];
  displayedColumns: string[] = ['alcaldia', 'colonia', 'region', 'manzana', 'ubicacion', 'descripcion', 'precios_solicitados', 'superficie', 'vu', 'tipo'];
  httpOptions;
  filtros: Filtros = {} as Filtros;
  isBusqueda;
  queryParamFiltros;
  canSearch = true;
  formato;
  @ViewChild('paginator') paginator: MatPaginator;
  

  constructor(
    private auth: AuthService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.clean();

    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: this.auth.getSession().token
      })
    };
  }

  getData(): void {
    this.loading = true;
    this.isBusqueda = true;
    this.pagina = 1;
    this.queryParamFiltros = '';

    this.loading = false;
  }

  paginado(evt): void{
    this.pagina = evt.pageIndex + 1;
    this.dataSource = this.paginate(this.dataInforme, this.pageSize, this.pagina);
  }

  paginate(array, page_size, page_number) {
    return array.slice((page_number - 1) * page_size, page_number * page_size);
  }

  clean(): void{
    this.filtros = {} as Filtros;
    this.filtros.fecha_ini = new Date((new Date().getTime() - 2592000000));
    this.filtros.fecha_fin = new Date((new Date().getTime()));
    this.filtros.tipo = 0;
    this.filtros.alcaldia = 0;
    this.filtros.colonia = 0;
    this.pagina = 1;
    this.total = 0;   
    this.dataInforme = [];
    this.isBusqueda = false;
    this.formato = 0;
  }

  validateDate(){
    if(moment(this.filtros.fecha_ini).format('YYYY-MM-DD') > moment(this.filtros.fecha_fin).format('YYYY-MM-DD')){
      this.canSearch = false;        
    }else{
      this.canSearch = true;
    }
  }

  keyPressAlphaNumeric(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  focusNextInput(event, input) {
    if(event.srcElement.value.length === event.srcElement.maxLength){
      input.focus();
    }
  }

  downloadInforme(): void {
    console.log(this.formato);
  }

}
