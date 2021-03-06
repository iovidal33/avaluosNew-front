import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';
import { AuthService } from '@serv/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import * as moment from 'moment';
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { ExcelService } from '@serv/excel.service';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

export interface Filtros {
  fecha_ini: Date;
  fecha_fin: Date;
  region: string;
  manzana: string;
  tipo: string;
  alcaldia: string;
  colonia: string;
}
@Component({
  selector: 'app-investigacion-mercado',
  templateUrl: './investigacion-mercado.component.html',
  styleUrls: ['./investigacion-mercado.component.css']
})
export class InvestigacionMercadoComponent implements OnInit {
  endpointCatalogos = environment.endpoint + "bandeja-entrada/";
  loadingTipos = false;
  loadingDelegaciones = false;
  loadingColonias = false;
  downloading = false;
  tipos;
  delegaciones;
  colonias;
  endpoint = environment.endpoint + 'bandeja-entrada/getInvestigacionMercado';
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
    public router: Router,
    private auth: AuthService,
    private http: HttpClient,
    private excelService: ExcelService
  ) { }

  ngOnInit(): void {
    const currentUser = this.auth.getSession();
    const userBandejaEntrada = "/main/" + currentUser.userData.redirect;
    if(currentUser.userData.redirect != "bandeja-entrada"){
      this.router.navigate([userBandejaEntrada]);
    }

    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: this.auth.getSession().token
      })
    };

    this.getDataTipos();
    this.getDataDelegaciones();
    this.clean();
  }

  getDataTipos(): void {
    this.loadingTipos = true;
    this.http.get(this.endpointCatalogos + 'getTiposComparable', this.httpOptions).subscribe(
      (res: any) => {
        this.loadingTipos = false;
        this.tipos = res[0];
      },
      (error) => {
        this.loadingTipos = false;
      }
    );
  }

  getDataDelegaciones(): void {
    this.loadingDelegaciones = true;
    this.http.get(this.endpointCatalogos + 'getDelegaciones', this.httpOptions).subscribe(
      (res: any) => {
        this.loadingDelegaciones = false;
        this.delegaciones = res[0];
      },
      (error) => {
        this.loadingDelegaciones = false;
      }
    );
  }

  getDataColonias(event): void {
    this.loadingColonias = true;
    this.http.get(this.endpointCatalogos + 'getColonias?idDelegacion=' + event.value, this.httpOptions).subscribe(
      (res: any) => {
        this.loadingColonias = false;
        this.colonias = res[0];
      },
      (error) => {
        this.loadingColonias = false;
      }
    );
  }

  getData(): void {
    this.loading = true;
    this.isBusqueda = true;
    this.pagina = 1;
    this.queryParamFiltros = '';

    if(this.filtros.fecha_ini){
      this.queryParamFiltros = this.queryParamFiltros + '&fechainicio=' + moment(this.filtros.fecha_ini).format('DD-MM-YYYY');
    }
    if(this.filtros.fecha_fin){
      this.queryParamFiltros = this.queryParamFiltros + '&fechafin=' + moment(this.filtros.fecha_fin).format('DD-MM-YYYY');
    }
    if(this.filtros.region){
      this.queryParamFiltros = this.queryParamFiltros + '&region=' + this.filtros.region;
    }
    if(this.filtros.manzana){
      this.queryParamFiltros = this.queryParamFiltros + '&manzana=' + this.filtros.manzana;
    }
    if(this.filtros.tipo){
      this.queryParamFiltros = this.queryParamFiltros + '&tipo=' + this.filtros.tipo;
    }
    if(this.filtros.alcaldia){
      this.queryParamFiltros = this.queryParamFiltros + '&delegacion=' + this.filtros.alcaldia;
    }
    if(this.filtros.colonia){
      this.queryParamFiltros = this.queryParamFiltros + '&colonia=' + this.filtros.colonia;
    }

    this.http.post(this.endpoint + '?' + this.queryParamFiltros, '', this.httpOptions).subscribe(
      (res: any) => {
        this.loading = false;

        if(res[0].length > 0){
          this.dataInforme = res[0];
          this.dataSource = this.paginate(this.dataInforme, this.pageSize, this.pagina);
          this.total = this.dataInforme.length;
          this.paginator.pageIndex = 0;
        } else {
          this.dataSource = [];
          this.total = 0;
          this.paginator.pageIndex = 0;
        }
      },
      (error) => {
        this.loading = false;
        this.dataSource = [];
      }
    );
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
    this.downloading = true;
    let head = [['Alcaldia', 'Colonia', 'Región', 'Manzana', 'Ubicación', 'Descripción', 'Precios solicitado', 'Superficie', 'VU', 'Tipo']];
    let data = [];
    this.dataInforme.forEach(element => data.push([element.DELEGACION, element.COLONIA, element.REGION, element.MANZANA, element.UBICACION, element.DESCRIPCION, element.PRECIOSOLICITADO, element.SUPERFICIE, element.VALORUNITARIO, element.TIPO]));

    switch(this.formato) {
      case 'pdf': {
        let doc = new jsPDF();
        
        (doc as any).autoTable({
          head: head,
          body: data,
          theme: 'grid',
          styles: {
            fontSize: 8,
            textColor: [0, 0, 0]
          },
          headStyles: {
            fillColor: [254, 210, 1]
          },
        });
        // below line for Open PDF document in new tab
        //doc.output('dataurlnewwindow');
        // below line for Download PDF document
        doc.save('Informe.pdf');
        break; 
      }
      case 'excel': {
        this.excelService.exportAsExcelFile(head[0], data, 'Informe');
        break; 
      }
      default: {
        console.log("asd");
        break; 
      } 
    }

    this.downloading = false;
  }

}
