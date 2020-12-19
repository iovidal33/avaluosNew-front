import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';
import { AuthService } from '@serv/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';

export interface Filtros {
  fecha_ini: Date;
  fecha_fin: Date;
  no_avaluo: string;
  perito_sociedad: string;
  no_unico: string;
  region: string;
  manzana: string;
  lote: string;
  unidad: string;
  estado: string;
  vigencia: string;
}

@Component({
  selector: 'app-bandeja-entrada',
  templateUrl: './bandeja-entrada.component.html',
  styleUrls: ['./bandeja-entrada.component.css']
})

export class BandejaEntradaComponent implements OnInit {

  endpoint = environment.endpoint + 'bandeja-entrada/avaluos';
  pagina = 1;
  total = 0;
  loading = false;
  displayedColumns: string[] = ['no_unico','no_avaluo', 'cuenta_cat', 'fecha_pres',
  'estado', 'perito', 'sociedad', 'notario', 'tipo', 'dict', 'select'];
  dataSource = [];
  httpOptions;
  filtros: Filtros = {} as Filtros;
  registroPeritoSociedad;
  tipoBusqueda;
  filtroSelected;
  opcionFiltro: boolean[] = [true, true, true, true];

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private auth: AuthService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.filtros.estado = '';
    this.filtros.vigencia = '';
    this.filtroSelected = '';
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: this.auth.getSession().token
      })
    };
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
    if(this.tipoBusqueda){
      if(this.tipoBusqueda == 'perito')
        filtros = filtros + '&id_perito=' + this.filtros.perito_sociedad;
      else if(this.tipoBusqueda == 'sociedad')
        filtros = filtros + '&id_sociedad=' + this.filtros.perito_sociedad;
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
    this.registroPeritoSociedad = '';
    this.tipoBusqueda = '';
    this.filtroSelected = '';
    this.opcionFiltro = [true, true, true, true];
  }

  openDialogPeritoSociedad(): void {
    const dialogRef = this.dialog.open(DialogPeritoSociedad, {
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.filtros.perito_sociedad = result.PeritoSociedad.idpersona;
        this.registroPeritoSociedad = result.PeritoSociedad.registro;
        this.tipoBusqueda = result.tipoBusqueda;
      }
      this.getData();
    });
  }

  getFiltroSelected(event): void {
    this.clean();
    if(event.value == 0){
      this.opcionFiltro[0] = false;
      this.opcionFiltro[1] = true;
      this.opcionFiltro[2] = true;
      this.opcionFiltro[3] = true;
    }
    else if(event.value == 1){
      this.opcionFiltro[0] = true;
      this.opcionFiltro[1] = false;
      this.opcionFiltro[2] = true;
      this.opcionFiltro[3] = true;
    }
    else if(event.value == 2){
      this.opcionFiltro[0] = true;
      this.opcionFiltro[1] = true;
      this.opcionFiltro[2] = false;
      this.opcionFiltro[3] = true;
    }
    else if(event.value == 3){
      this.opcionFiltro[0] = true;
      this.opcionFiltro[1] = true;
      this.opcionFiltro[2] = true;
      this.opcionFiltro[3] = false;
    }
  }

}


export interface FiltrosPeritoSociedad {
  registro: string;
  nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
}

export interface busqueda {
  tipoBusqueda: string;
  PeritoSociedad: string;
}

@Component({
  selector: 'app-dialog-perito-sociedad',
  templateUrl: 'app-dialog-perito-sociedad.html',
})
export class DialogPeritoSociedad {
  endpoint = environment.rconEndpoint + 'persona/';
  pagina = 1;
  total = 0;
  displayedColumns: string[] = ['registro', 'nombre', 'select'];
  dataSource = [];
  httpOptions;
  loading = false;
  tipoBusqueda = '';
  filtros: FiltrosPeritoSociedad = {} as FiltrosPeritoSociedad;
  busquedaPeritoSociedad;
  PeritoSociedad;
  busqueda: busqueda = {} as busqueda;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DialogPeritoSociedad>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.tipoBusqueda = 'perito';
      this.busquedaPeritoSociedad = false;
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  paginado(evt): void{
    this.pagina = evt.pageIndex + 1;
    this.getDataPeritoSociedad();
  }

  cleanBusqueda(): void{
    this.pagina = 1;
    this.total = 0;
    this.dataSource = [];
    this.loading = false;
    this.filtros = {} as FiltrosPeritoSociedad;
    this.busquedaPeritoSociedad = false;
    this.busqueda = {} as busqueda;
  }

  getDataPeritoSociedad(): void {
    this.busquedaPeritoSociedad = true;
    this.loading = true;
    let filtros = '';
    if(this.tipoBusqueda == 'perito'){
      if(this.filtros.registro){
        filtros = filtros + '&reg=' + this.filtros.registro;
      }else{
        if(this.filtros.nombre){
          filtros = filtros + '&nombre=' + this.filtros.nombre;
        }
        if(this.filtros.primer_apellido){
          filtros = filtros + '&apaterno=' + this.filtros.primer_apellido; 
        }
        if(this.filtros.segundo_apellido){
          filtros = filtros + '&amaterno=' + this.filtros.segundo_apellido;
        }
      }
    }
    if(this.tipoBusqueda == 'sociedad'){
      if(this.filtros.registro){
        filtros = filtros + '&reg=' + this.filtros.registro;
      }else{
        if(this.filtros.nombre){
          filtros = filtros + '&nombre=' + this.filtros.nombre;
        }
      }
    }
    this.http.get(this.endpoint + this.tipoBusqueda + '?page=' + this.pagina + filtros,
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

  radioSelected(dataRadio) {
    this.busqueda.tipoBusqueda = this.tipoBusqueda;
    this.busqueda.PeritoSociedad = dataRadio;
  }

}
