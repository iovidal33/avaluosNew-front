import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@env/environment';
import { AuthService } from '@serv/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-acuse-avaluo',
  templateUrl: './acuse-avaluo.component.html',
  styleUrls: ['./acuse-avaluo.component.css']
})
export class AcuseAvaluoComponent implements OnInit {
  endpoint = environment.endpoint + 'bandeja-entrada';
  loading = false;
  loadingPDF = false;
  httpOptions;
  noUnico;
  dataAvaluo;
  tokenDataAvaluo;
  menu;

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
    this.http.get(this.endpoint + '/acuseAvaluo?no_unico=' + this.noUnico,
      this.httpOptions).subscribe(
        (res: any) => {
          this.loading = false;
          this.loadingPDF = false;
          this.dataAvaluo = res[0];
          this.tokenDataAvaluo = res[1];
        },
        (error) => {
          this.loading = false;
          this.loadingPDF = false;
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

}
