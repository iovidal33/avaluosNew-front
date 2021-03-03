import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';
import { AuthService } from '@serv/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
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
  'estado', 'perito', 'notario', 'tipo', 'dict', 'select'];
  dataSource = [];
  httpOptions;
  filtros: Filtros = {} as Filtros;
  registroPeritoSociedad;
  tipoBusqueda;
  filtroSelected;
  opcionFiltro: boolean[] = [true, true, true, true];
  busqueda;
  errores: Array<{isError: boolean, errorMessage: string}> = [{isError: false, errorMessage: ''}, {isError: false, errorMessage: 'Requerido'}, {isError: false, errorMessage: 'Requerido'}, {isError: false, errorMessage: 'Requerido'}];
  canSearch = false;
  filtrosString;
  @ViewChild('paginator') paginator: MatPaginator;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private auth: AuthService,
    public dialog: MatDialog,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.filtros.estado = '';
    this.filtros.vigencia = '';
    this.filtroSelected = '';
    this.busqueda = false;
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: this.auth.getSession().token
      })
    };

    if(sessionStorage.filtrosRevisor){
      this.filtroSelected = sessionStorage.filtroSelectedRevisor;
      this.opcionFiltro[sessionStorage.filtroSelectedRevisor] = false;
      this.canSearch = sessionStorage.canSearchRevisor;
      this.filtros = JSON.parse(sessionStorage.filtrosRevisor);
      if(this.filtros.perito_sociedad){
        this.registroPeritoSociedad = sessionStorage.registroPeritoSociedad;
        this.tipoBusqueda = sessionStorage.tipoBusqueda;
      }
      this.getData(true);
    }
  }

  paginado(evt): void{
    this.pagina = evt.pageIndex + 1;
    this.getData(false);
  }

  getData(search): void {
    this.loading = true;
    this.busqueda = true;
    if(search){
      this.filtrosString = '';
    if(this.filtros.fecha_fin && this.filtros.fecha_ini){
      this.filtrosString = this.filtrosString + '&fecha_ini=' + moment(this.filtros.fecha_ini).format('YYYY-MM-DD') +
      '&fecha_fin=' + moment(this.filtros.fecha_fin).format('YYYY-MM-DD');
    }
    if(this.filtros.no_avaluo){
      this.filtrosString = this.filtrosString + '&no_avaluo=' + this.filtros.no_avaluo; 
    }
    if(this.tipoBusqueda){
      if(this.tipoBusqueda == 'perito')
        this.filtrosString = this.filtrosString + '&id_perito=' + this.filtros.perito_sociedad;
      else if(this.tipoBusqueda == 'sociedad')
        this.filtrosString = this.filtrosString + '&id_sociedad=' + this.filtros.perito_sociedad;
    }
    if(this.filtros.no_unico){
      this.filtrosString = this.filtrosString + '&no_unico=' + this.filtros.no_unico;
    }
    if(this.filtros.region || this.filtros.manzana || this.filtros.lote || this.filtros.unidad){
      this.filtrosString = this.filtrosString + '&cta_catastral=' + ((this.filtros.region) ? this.filtros.region : ' ')
      + '-' + ((this.filtros.manzana) ? this.filtros.manzana : ' ')
      + '-' + ((this.filtros.lote) ? this.filtros.lote : ' ')
      + '-' + ((this.filtros.unidad) ? this.filtros.unidad : ' ');
    }
    if(this.filtros.estado){
      this.filtrosString = this.filtrosString + '&estado=' + this.filtros.estado;
    }
    if(this.filtros.vigencia){
      this.filtrosString = this.filtrosString + '&vigencia=' + this.filtros.vigencia;
    }
    sessionStorage.filtrosRevisor = JSON.stringify(this.filtros);
    sessionStorage.filtroSelectedRevisor = this.filtroSelected;
    sessionStorage.canSearchRevisor = this.canSearch;
    if(this.filtros.perito_sociedad){
      sessionStorage.registroPeritoSociedad = this.registroPeritoSociedad;
      sessionStorage.tipoBusqueda = this.tipoBusqueda;
      }
    }
    this.http.get(this.endpoint + '?page=' + this.pagina + this.filtrosString,
      this.httpOptions).subscribe(
        (res: any) => {
          (search) ? this.resetPaginator() : '';
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

  openDialogPeritoSociedad(): void {
    const dialogRef = this.dialog.open(DialogPeritoSociedad, {
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.filtros.perito_sociedad = result.PeritoSociedad.idpersona;
        this.registroPeritoSociedad = result.PeritoSociedad.registro;
        this.tipoBusqueda = result.tipoBusqueda;

        sessionStorage.registroPeritoSociedad = this.registroPeritoSociedad;
        sessionStorage.tipoBusqueda = this.tipoBusqueda;
      }
    });
  }

  openDialogAsignaNotario(numerounico): void {
    const dialogRef = this.dialog.open(DialogAsignaNotarioRevisor, {
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){        
        this.http.get(environment.endpoint + 'bandeja-entrada/asignaNotarioAvaluo?id_persona_notario=' + result.IDPERSONA + '&no_unico='+ numerounico,
          this.httpOptions).subscribe(
            (res: any) => {
              this.snackBar.open(res.mensaje, 'Cerrar', {
                duration: 10000,
                horizontalPosition: 'end',
                verticalPosition: 'top'
              });
              this.getData(true);
            },
            (error) => {
              this.snackBar.open(error.error.mensaje, 'Cerrar', {
                duration: 10000,
                horizontalPosition: 'end',
                verticalPosition: 'top'
              });
          });
      }
    });
  }

  clean(): void{
    this.busqueda = false;
  }

  getFiltroSelected(event): void {
    this.filtros = {} as Filtros;
    this.registroPeritoSociedad = '';
    this.tipoBusqueda = '';
    this.filtros.estado = '';
    this.filtros.vigencia = '';
    this.filtroSelected = '';
    this.opcionFiltro = [true, true, true, true];
    this.canSearch = false;
    if(event.value == 0){
      this.opcionFiltro[0] = false;
      this.filtros.fecha_ini = new Date((new Date().getTime() - 2592000000));
      this.filtros.fecha_fin = new Date((new Date().getTime()));
      this.canSearch = true;
    }
    else if(event.value == 1){
      this.opcionFiltro[1] = false;
    }
    else if(event.value == 2){
      this.opcionFiltro[2] = false;
    }
    else if(event.value == 3){
      this.opcionFiltro[3] = false;
    }
    
    sessionStorage.removeItem('filtrosRevisor');
    sessionStorage.removeItem('filtroSelectedRevisor');
    sessionStorage.removeItem('canSearchRevisor');
    sessionStorage.removeItem('registroPeritoSociedad');
    sessionStorage.removeItem('tipoBusqueda');
    sessionStorage.filtroSelectedRevisor = event.value;
    sessionStorage.canSearchRevisor = this.canSearch;
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

  changeVigencia(event) {
    this.filtros.vigencia = event.value;
  }

  resetPaginator() {
    this.pagina = 1;
    this.paginator.pageIndex = 0;
  }

  validateDate(){
    if(!this.filtros.fecha_ini || !this.filtros.fecha_fin){
      this.errores[0] = {isError:true, errorMessage:'La fechas son requeridas.'};
      this.canSearch = false;
    }else{
      if(moment(this.filtros.fecha_ini).format('YYYY-MM-DD') > moment(this.filtros.fecha_fin).format('YYYY-MM-DD')){
        this.errores[0] = {isError:true, errorMessage:'La fecha fin tiene que ser mayor a la inicial.'};
        this.canSearch = false;
      }else{
        this.errores[0] = {isError:false, errorMessage:''};
        this.canSearch = true;
      }
    }
    sessionStorage.canSearchRevisor = this.canSearch;
  }

  checkCanSearch(){
    switch(this.filtroSelected) {
      case '1': {
        this.canSearch = (this.filtros.no_avaluo) ? true : false;
        break; 
      }
      case '2': {
        this.canSearch = (this.filtros.no_unico) ? true : false;
        break; 
      }
      case '3': {
        this.canSearch = (this.filtros.region && this.filtros.manzana) ? true : false;
        break; 
      }       
      default: {
        this.canSearch = false;
        break; 
      } 
    }
    sessionStorage.canSearchRevisor = this.canSearch;
  }

  isDict(element){
    var year = moment(element.fecha_presentacion).subtract(1, 'year').year();
    var fecha_avaluo = moment(element.fecha_avaluo).format('YYYY-MM-DD');
    var fecha_presentacion = moment(element.fecha_presentacion).format('YYYY-MM-DD');
    var fecha = moment(year + '-12-31').format('YYYY-MM-DD');
    if(element.proposito == 'DICTAMINACIÓN' || element.objeto == 'DICTAMINACIÓN' || (fecha_avaluo > fecha_presentacion && fecha_presentacion == fecha))
    {
      return true;
    }else{
      return false;
    }
  }

  avaluosProximos(no_unico): void{
    this.router.navigate(['main/avaluos-proximos/' + no_unico]);
  }

  acuseAvaluo(no_unico): void{
    this.router.navigate(['main/acuse-avaluo/' + no_unico]);
  }

  descargarJustificante(element): void{
    const dialogRef = this.dialog.open(DialogDescargaJustificante, {
      width: '600px',
    });
    
    var fecha_avaluo = moment(element.fecha_avaluo).format('YYYY-MM-DD');
    var fecha = moment('2021-01-01').format('YYYY-MM-DD');

    this.http.get(environment.endpoint + 'bandeja-entrada/'+((fecha_avaluo<fecha) ? 'reimprimeAvaluo' : 'reimprimeAvaluo')+'?no_unico='+ element.numerounico,
      this.httpOptions).subscribe(
        (res: any) => {
          dialogRef.close();
          if (window.navigator && window.navigator.msSaveOrOpenBlob) { // IE workaround
            const byteCharacters = atob(res.pdfbase64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            window.navigator.msSaveOrOpenBlob(blob, res.nombre);
          } else {
            const linkSource = 'data:application/pdf;base64,' + res.pdfbase64;
            const downloadLink = document.createElement('a');
            const fileName = res.nombre;
            downloadLink.href = linkSource;
            downloadLink.download = fileName;
            downloadLink.click();
          }
        },
        (error) => {
          dialogRef.close();
          this.snackBar.open(error.error.mensaje, 'Cerrar', {
            duration: 10000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        });
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
  filtrosString;
  busquedaPeritoSociedad;
  PeritoSociedad;
  busqueda: busqueda = {} as busqueda;
  @ViewChild('paginator') paginator: MatPaginator;

  constructor(
    private http: HttpClient,
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
    this.getDataPeritoSociedad(false);
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

  getDataPeritoSociedad(search): void {
    this.busquedaPeritoSociedad = true;
    this.loading = true;
    if(search){
      this.filtrosString = '';
    if(this.tipoBusqueda == 'perito'){
      if(this.filtros.registro){
        this.filtrosString = this.filtrosString + '&reg=' + this.filtros.registro;
      }else{
        if(this.filtros.nombre){
          this.filtrosString = this.filtrosString + '&nombre=' + this.filtros.nombre;
        }
        if(this.filtros.primer_apellido){
          this.filtrosString = this.filtrosString + '&apaterno=' + this.filtros.primer_apellido; 
        }
        if(this.filtros.segundo_apellido){
          this.filtrosString = this.filtrosString + '&amaterno=' + this.filtros.segundo_apellido;
        }
      }
    }
    if(this.tipoBusqueda == 'sociedad'){
      if(this.filtros.registro){
        this.filtrosString = this.filtrosString + '&reg=' + this.filtros.registro;
      }else{
        if(this.filtros.nombre){
          this.filtrosString = this.filtrosString + '&nombre=' + this.filtros.nombre;
        }
      }
      }
    }
    this.http.get(this.endpoint + this.tipoBusqueda + '?page=' + this.pagina + this.filtrosString,
      this.httpOptions).subscribe(
        (res: any) => {
          (search) ? this.resetPaginator() : '';
          this.loading = false;
          this.dataSource = res.data;
          this.total = res.total;
        },
        (error) => {
          this.loading = false;
          this.dataSource = [];
          this.resetPaginator();
        });
  }

  radioSelected(dataRadio) {
    this.busqueda.tipoBusqueda = this.tipoBusqueda;
    this.busqueda.PeritoSociedad = dataRadio;
  }

  resetPaginator() {
    this.pagina = 1;
    this.total = 0;
    this.paginator.pageIndex = 0;
  }

}

export interface FiltroNotario {
  no_notario: string;
  nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
}

@Component({
  selector: 'app-dialog-asigna-notario',
  templateUrl: 'app-dialog-asigna-notario.html',
})
export class DialogAsignaNotarioRevisor {
  endpoint = environment.endpoint + 'bandeja-entrada/buscaNotario';
  pagina = 1;
  paginaSize = 15;
  total = 0;
  displayedColumns: string[] = ['numero', 'nombre', 'select'];
  dataSource = [];
  httpOptions;
  loading = false;
  busqueda;
  filtro: FiltroNotario = {} as FiltroNotario;
  dataNotario;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DialogAsignaNotarioRevisor>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      dialogRef.disableClose = true;
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  paginado(evt): void{
    this.pagina = evt.pageIndex + 1;
    this.getDataNotario();
  }

  getDataNotario(): void {
    this.loading = true;
    this.busqueda = true;
    let filtro = '';
    
    if(this.filtro.no_notario){
      filtro = filtro + '&numero_notario=' + this.filtro.no_notario;
    }
    if(this.filtro.nombre){
      filtro = filtro + '&nombre_notario=' + this.filtro.nombre;
    }
    if(this.filtro.primer_apellido){
      filtro = filtro + '&ape_paterno=' + this.filtro.primer_apellido; 
    }
    if(this.filtro.segundo_apellido){
      filtro = filtro + '&ape_materno=' + this.filtro.segundo_apellido;
    }
    this.http.get(this.endpoint + '?page=' + this.pagina + '&page_size=' + this.paginaSize + filtro,
      this.httpOptions).subscribe(
        (res: any) => {
          this.loading = false;
          if(res.mensaje){
            this.dataSource = [];
          }else{
            this.dataSource = res.data;
            this.total = res.total;
          }
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
    this.dataNotario = dataRadio;
  }

}


@Component({
  selector: 'app-dialog-descarga-justificante',
  templateUrl: 'app-dialog-descarga-justificante.html',
})
export class DialogDescargaJustificante {
  constructor(
    public dialogRef: MatDialogRef<DialogDescargaJustificante>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      dialogRef.disableClose = true;
    }
}