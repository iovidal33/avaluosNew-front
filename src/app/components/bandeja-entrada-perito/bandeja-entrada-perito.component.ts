import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';
import { AuthService } from '@serv/auth.service';
import { DialogService } from '../shared/dialog.service';
import * as moment from 'moment';
import { TileStyler } from '@angular/material/grid-list/tile-styler';
import { MatDatepicker } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
 

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

  endpoint = environment.endpoint + 'bandeja-entrada/avaluos-perito';
  endpointcancel = environment.endpoint + 'bandeja-entrada/modificarestadoavaluo';
  pagina = 1;
  total = 0;
  loading = false;
  displayedColumns: string[] = ['no_unico','no_avaluo', 'cuenta_cat', 'fecha_pres',
  'estado', 'perito', 'notario', 'tipo', 'dict', 'select'];
  dataSource = [];
  httpOptions;
  filtros: Filtros = {} as Filtros;
  filtroSelected;
  opcionFiltro: boolean[] = [true, true, true, true];
  busqueda;
  errores: Array<{isError: boolean, errorMessage: string}> = [{isError: false, errorMessage: ''}, {isError: false, errorMessage: 'Requerido'}, {isError: false, errorMessage: 'Requerido'}, {isError: false, errorMessage: 'Requerido'}];
  canSearch = true;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private auth: AuthService,
    private dialogService: DialogService,
    private router: Router,
    public dialog: MatDialog,
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

    if(sessionStorage.filtrosPerito){
      this.filtros = JSON.parse(sessionStorage.filtrosPerito);
      this.opcionFiltro[sessionStorage.filtroSelected] = false;
      this.filtroSelected = sessionStorage.filtroSelected;
      this.canSearch = sessionStorage.canSearch;
      this.getData();
    }

    sessionStorage.clear();
  }

  paginado(evt): void{
    this.pagina = evt.pageIndex + 1;
    this.getData();
  }
 
  getData(): void {
    this.loading = true;
    this.busqueda = true;
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
    if(this.filtros.region || this.filtros.manzana || this.filtros.lote || this.filtros.unidad){
      filtros = filtros + '&cta_catastral=' + ((this.filtros.region) ? this.filtros.region : ' ')
      + '-' + ((this.filtros.manzana) ? this.filtros.manzana : ' ')
      + '-' + ((this.filtros.lote) ? this.filtros.lote : ' ')
      + '-' + ((this.filtros.unidad) ? this.filtros.unidad : ' ');
    }
    if(this.filtros.estado){
      filtros = filtros + '&estado=' + this.filtros.estado;
    }
    if(this.filtros.vigencia){
      filtros = filtros + '&vigencia=' + this.filtros.vigencia;
    }
    
    sessionStorage.filtrosPerito = JSON.stringify(this.filtros);
    sessionStorage.canSearch = this.canSearch;
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

  cancelAvaluo(no_unico): void{  
    this.dialogService.openConfirmDialog('Nuevo Estado Cancelado')
    .afterClosed().subscribe(res =>{      
      if(res){
        //console.log(no_unico);
        //this.notificationService.warn('Cambio exitoso');
        this.http.get(this.endpointcancel + '?page=' + this.pagina + '&no_unico=' + no_unico + '&code_estado_avaluo=2',
        this.httpOptions).subscribe(
          (res: any) => {  
            this.loading = false;
            this.snackBar.open(res.mensaje, 'Cerrar', {
              duration: 10000,
              horizontalPosition: 'end',
              verticalPosition: 'top'
            });
            this.getData();
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
    });
  }

  clean(): void{
    this.filtros = {} as Filtros;
    this.filtros.estado = '';
    this.filtros.vigencia = '';
    this.filtroSelected = '';
    this.opcionFiltro = [true, true, true, true];
    this.canSearch = true;
  }

  getFiltroSelected(event): void {
    this.clean();
    if(event.value == 0){
      this.opcionFiltro[0] = false;
      this.filtros.fecha_ini = new Date((new Date().getTime() - 2592000000));
      this.filtros.fecha_fin = new Date((new Date().getTime()));
      this.canSearch = false;
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

    sessionStorage.filtroSelected = event.value;
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

  validateDate(){
    if(!this.filtros.fecha_ini || !this.filtros.fecha_fin){
      this.errores[0] = {isError:true, errorMessage:'La fechas son requeridas.'};
      this.canSearch = true;
    }else{
      if(moment(this.filtros.fecha_ini).format('YYYY-MM-DD') > moment(this.filtros.fecha_fin).format('YYYY-MM-DD')){
        this.errores[0] = {isError:true, errorMessage:'La fecha fin tiene que ser mayor a la inicial.'};
        this.canSearch = true;
      }else{
        this.errores[0] = {isError:false, errorMessage:''};
        this.canSearch = false;
      }
    }
  }

  avaluosProximos(no_unico): void{
    this.router.navigate(['main/avaluos-proximos/' + no_unico]);
  }

  openDialogAsignaNotario(numerounico): void {
    const dialogRef = this.dialog.open(DialogAsignaNotario, {
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
              this.getData();
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

  acuseAvaluo(no_unico): void{
    this.router.navigate(['main/acuse-avaluo/' + no_unico]);
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
export class DialogAsignaNotario {
  endpoint = environment.endpoint + 'bandeja-entrada/buscaNotario';
  pagina = 1;
  paginaSize = 15;
  total = 0;
  displayedColumns: string[] = ['numero', 'nombre', 'select'];
  dataSource = [];
  httpOptions;
  loading = false;
  filtro: FiltroNotario = {} as FiltroNotario;
  dataNotario;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DialogAsignaNotario>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
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
    this.dataNotario = dataRadio;
  }

}
