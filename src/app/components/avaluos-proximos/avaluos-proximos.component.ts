import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@env/environment';
import { AuthService } from '@serv/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';

@Component({
  selector: 'app-avaluos-proximos',
  templateUrl: './avaluos-proximos.component.html',
  styleUrls: ['./avaluos-proximos.component.css']
})
export class AvaluosProximosComponent implements OnInit {
  endpoint = environment.endpoint + 'bandeja-entrada/avaluosProximos';
  pagina = 1;
  paginaSize = 15;
  total = 0;
  loading = false;
  displayedColumns: string[] = ['no_unico','no_avaluo', 'cuenta_cat', 'fecha_pres',
  'estado', 'notario', 'vigente', 'select'];
  dataSource = [];
  httpOptions;
  noUnico;
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

  paginado(evt): void{
    this.pagina = evt.pageIndex + 1;
    this.getData();
  }

  getData(): void {
    this.loading = true;
    this.http.get(this.endpoint + '?page=' + this.pagina + '&page_size=' + this.paginaSize + '&no_unico=' + this.noUnico,
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

  regresar(): void{
    this.router.navigate(['main/' + this.menu[0].ruta]);
  }

}
