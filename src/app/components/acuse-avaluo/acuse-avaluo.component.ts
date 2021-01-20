import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { AuthService } from '@serv/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';

@Component({
  selector: 'app-acuse-avaluo',
  templateUrl: './acuse-avaluo.component.html',
  styleUrls: ['./acuse-avaluo.component.css']
})
export class AcuseAvaluoComponent implements OnInit {
  endpoint = environment.endpoint + 'bandeja-entrada/acuseAvaluo';
  loading = false;
  httpOptions;
  noUnico;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private auth: AuthService,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.noUnico = this.route.snapshot.paramMap.get('no_unico');
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: this.auth.getSession().token
      })
    };
    this.getData();
  }

  getData(): void {
    this.loading = true;
    this.http.get(this.endpoint + '?no_unico=' + this.noUnico,
      this.httpOptions).subscribe(
        (res: any) => {
          this.loading = false;
          console.log(res);
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

}
