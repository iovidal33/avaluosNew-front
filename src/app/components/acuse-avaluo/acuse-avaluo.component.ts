import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@env/environment';
import { AuthService } from '@serv/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as htmlDocx from 'html-docx-js/dist/html-docx';
import { saveAs } from 'file-saver';
import { formatDate } from "@angular/common";

@Component({
  selector: 'app-acuse-avaluo',
  templateUrl: './acuse-avaluo.component.html',
  styleUrls: ['./acuse-avaluo.component.css']
})
export class AcuseAvaluoComponent implements OnInit {
  endpoint = environment.endpoint + 'bandeja-entrada';
  loading = false;
  loadingPDF = false;
  loadingDOC = false;
  httpOptions;
  noUnico;
  dataAvaluo;
  tokenDataAvaluo;
  menu;
  @ViewChild('contenidoPDF') contenidoPDF: ElementRef;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private auth: AuthService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.noUnico = this.route.snapshot.paramMap.get('no_unico');
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: this.auth.getSession().token
      })
    };
    this.menu = this.auth.getMenu();
    this.getData();
  }

  getData(): void {
    this.loading = true;
    this.loadingPDF = true;
    this.loadingDOC = true;
    this.http.get(this.endpoint + '/acuseAvaluo?no_unico=' + this.noUnico,
      this.httpOptions).subscribe(
        (res: any) => {
          this.loading = false;
          this.loadingPDF = false;
          this.loadingDOC = false;
          this.dataAvaluo = res[0];
          this.tokenDataAvaluo = res[1];
        },
        (error) => {
          this.loading = false;
          this.loadingPDF = false;
          this.loadingDOC = false;
          this.snackBar.open(error.error.mensaje, 'Cerrar', {
            duration: 10000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        });
  }

  regresar(): void{
    this.router.navigate(['main/' + this.menu[0].ruta]);
  }

  generarPDF(): void {
    this.loadingPDF = true;
    this.http.post(this.endpoint + '/generaAcusePDF', { 'token': this.tokenDataAvaluo, 'no_unico': this.noUnico },
      this.httpOptions).subscribe(
        (res: any) => {
          this.loadingPDF = false;
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
          this.loadingPDF = false;
          this.snackBar.open(error.error.mensaje, 'Cerrar', {
            duration: 10000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        });
  }

  generarDOC(): void {
    const format = 'dd/MM/yyyy';
    const myDate = this.dataAvaluo.fuenteInformacionLegal.fecha;
    const locale = 'es-Mx';
    const fecha = formatDate(myDate, format, locale);
    let htmlDocument = '<!DOCTYPE html><html><head><meta charset="utf-8"><title></title>';
    let styles  = '<style>'     
                +   '@page {'
                +     'size: A4;'
                +   '}'                           
                +   'body, html {'
                +     'font-family: Arial, Helvetica, sans-serif;'
                +     'font-size: 12px;'
                +   '}'
                +   'table {'
                +     'text-align: center !important;'
                +     'width: 100%;'
                +     'border: 1px solid black;'
                +   '}'
                +   '.cuenta_catastral {'
                +     'width: 60%;'
                +   '}'
                +   '.cuenta_agua {'
                +     'text-align: center;'
                +     'width: 60%;'
                +     'height: 40px;'
                +     'border:1px solid black;'
                +   '}'
                +   '.propietario_solicitante {'
                +     'width: 100%;'
                +     'border:1px solid black;'
                +   '}'
                +   '.ubicacion_inmueble {'
                +     'width: 100%;'
                +     'border:1px solid black;'
                +   '}'
                +   '.datos_escritura {'
                +     'width: 100%;'
                +   '}'
                + '</style>';
    let content = '<strong>NÚMERO ÚNICO</strong>&emsp;' + this.noUnico
                + '<br><br>'
                + '<strong>I. CUENTA CATASTRAL</strong>'
                + '<br>'
                + '<div class="cuenta_catastral">'
                +   '<table>'
                +     '<thead>'
                +       '<tr>'
                +         '<th>Reg.</th>'
                +         '<th>Manz.</th>'
                +         '<th>Lote</th>'
                +         '<th>Loc.</th>'
                +         '<th>D.V.</th>'
                +       '</tr>'
                +     '</thead>'
                +     '<tbody>'
                +       '<tr>'
                +         '<td>' + this.dataAvaluo.cuentaCatastral.region + '</td>'
                +         '<td>' + this.dataAvaluo.cuentaCatastral.manzana + '</td>'
                +         '<td>' + this.dataAvaluo.cuentaCatastral.lote + '</td>'
                +         '<td>' + this.dataAvaluo.cuentaCatastral.unidadprivativa + '</td>'
                +         '<td>' + this.dataAvaluo.cuentaCatastral.digitoverificador + '</td>'
                +       '</tr>'
                +     '</tbody>'
                +   '</table>'
                + '</div>'
                + '<br><br>'
                + '<strong>II. CUENTA DE AGUA</strong>'
                + '<div class="cuenta_agua">'
                +   '<p>' + this.dataAvaluo.cuentaAgua + '</p>'
                + '</div>'
                + '<br><br>'
                + '<strong>III. DATOS DEL PROPIETARIO O SOLICITANTE DEL AVALÚO</strong>'
                + '<div class="propietario_solicitante">'
                +   '<strong>Nombre, denominación o razón social</strong>&emsp;' + ((this.dataAvaluo.propietario.apellidopaterno) ? this.dataAvaluo.propietario.apellidopaterno : '') + ' ' + ((this.dataAvaluo.propietario.apellidomaterno) ? this.dataAvaluo.propietario.apellidomaterno : '') + ' ' + this.dataAvaluo.propietario.nombre
                +   '<br>'
                +   '<strong>Calle</strong>&emsp;' + this.dataAvaluo.propietario.calle + '&emsp;&emsp;'
                +   '<strong>No. Exterior</strong>&emsp;' + this.dataAvaluo.propietario.numeroexterior + '&emsp;&emsp;'
                +   '<strong>No. Interior</strong>&emsp;' + this.dataAvaluo.propietario.numerointerior
                +   '<br>'
                +   '<strong>Colonia</strong>&emsp;' + this.dataAvaluo.propietario.nombrecolonia
                +   '<br>'
                +   '<strong>Delegación o Municipio</strong>&emsp;' + this.dataAvaluo.propietario.nombredelegacion + '&emsp;&emsp;'
                +   '<strong>Código Postal</strong>&emsp;' + this.dataAvaluo.propietario.codigopostal
                +   '<br>'
                +   '<strong>Entidad Federativa</strong>&emsp;' + 'DISTRITO FEDERAL' + '&emsp;&emsp;'
                +   '<strong>Teléfono</strong>&emsp;' + '5555555555'
                + '</div>'
                + '<br><br>'
                + '<strong>IV. UBICACIÓN DEL INMUEBLE QUE SE ADQUIERE</strong>'
                + '<div class="ubicacion_inmueble">'
                +   '<strong>Calle</strong>&emsp;' + 'AAAAAAAAAAAAAAAA'
                +   '<br>'
                +   '<strong>Manzana</strong>&emsp;' + '1111' + '&emsp;&emsp;'
                +   '<strong>Lote</strong>&emsp;' + '1111' + '&emsp;&emsp;'
                +   '<strong>No. Exterior</strong>&emsp;' + '1111' + '&emsp;&emsp;'
                +   '<strong>No. Interior</strong>&emsp;' + '1111'
                +   '<br>'
                +   '<strong>Colonia</strong>&emsp;' + 'AAAAAAAAAAAAA' + '&emsp;&emsp;'
                +   '<strong>Delegación</strong>&emsp;' + 'AAAAAAAAAAAAA' + '&emsp;&emsp;'
                +   '<strong>Código Postal</strong>&emsp;' + '11111'
                + '</div>'
                + '<br><br>'
                + '<strong>V. DATOS DE LA ESCRITURA</strong>'
                + '<div class="datos_escritura">'
                +   '<strong>Número Escritura</strong>&emsp;' + this.dataAvaluo.escritura.numescritura + '&emsp;&emsp;'
                +   '<strong>Fecha</strong>&emsp;' + fecha
                +   '<br>'
                +   '<strong>Número Notaria</strong>&emsp;' + this.dataAvaluo.escritura.numnotario
                +   '<br>'
                +   '<strong>Nombre del Notario</strong>&emsp;' + this.dataAvaluo.escritura.nombrenotario
                +   '<br>'
                +   '<strong>Entidad Federativa</strong>&emsp;' + this.dataAvaluo.escritura.distritojudicialnotario
                + '</div>';
    htmlDocument = htmlDocument + styles + '</head><body>' + content + '</body></html>';
    const converted = htmlDocx.asBlob(htmlDocument);
    saveAs(converted, this.noUnico + '.docx');
  }

}
