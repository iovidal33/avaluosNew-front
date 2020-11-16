import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '@serv/auth.service';
import { environment } from '@env/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-subir-avaluo',
  templateUrl: './subir-avaluo.component.html',
  styleUrls: ['./subir-avaluo.component.css']
})
export class SubirAvaluoComponent implements OnInit {
  loading = false;
  file;
  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient) { }
  endpoint = environment.endpoint + 'bandeja-entrada/guardarAvaluo';
  httpOptions;

  ngOnInit(): void {
    const session = this.authService.getSession();
    this.httpOptions = {
      headers: new HttpHeaders({
        Authorization: session.token
      })
    };
  }

  subirAvaluo(): void {
    this.loading = true;
    const formData = new FormData();
    formData.append('files', this.file, this.file.name);
    formData.append('idPersona', '138');
    this.http.post(this.endpoint, formData,
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
        }
      );
  }

}
