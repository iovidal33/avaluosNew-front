import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '@serv/auth.service';
import { environment } from '@env/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { FileUploadService } from "@serv/file-upload.service";
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { timer } from 'rxjs';

@Component({
  selector: 'app-subir-avaluo',
  templateUrl: './subir-avaluo.component.html',
  styleUrls: ['./subir-avaluo.component.css']
})
export class SubirAvaluoComponent implements OnInit {
  loading = false;
  file;
  mensaje;
  success = false;
  constructor(
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private http: HttpClient,
    public fileUploadService: FileUploadService) { }
  endpoint = environment.endpoint + 'bandeja-entrada/guardarAvaluo';
  httpOptions;
  mode: ProgressBarMode = 'determinate';
  progress: number;
  bufferValue: number;
  source = timer(100,1000);

  ngOnInit(): void {
    const session = this.authService.getSession();
    this.httpOptions = {
      headers: new HttpHeaders({
        Authorization: session.token
      }),
      //reportProgress: true,
      //observe: 'events'
    };
  }

  subirAvaluo(): void {
    this.loading = true;
    const formData = new FormData();
    formData.append('files', this.file, this.file.name);
    formData.append('idPersona', '264');
    this.http.post(this.endpoint, formData,
      this.httpOptions).subscribe(
        (res: any) => {
          this.loading = false;
          this.success = res.Estado;
          if(res.Estado){
            this.mensaje = 'El avalúo con numero único ' + res.numeroUnico + ' se subió correctamente';
          }else{
            this.mensaje = 'No se pudo cargar el avalúo';
          }
        },
        (error) => {
          this.loading = false;
          if(!(error.error.mensaje instanceof Array)){
            this.snackBar.open(error.error.mensaje, 'Cerrar', {
              duration: 10000,
              horizontalPosition: 'end',
              verticalPosition: 'top'
            });
          }else{
            console.log("hola");
            this.snackBar.open(error.error.mensaje, 'Cerrar', {
              duration: 10000,
              horizontalPosition: 'end',
              verticalPosition: 'top'
            });
          }
          
        }
      );
  }

  /*subirAvaluo(): void {
    this.loading = true;
    const formData = new FormData();
    formData.append('files', this.file, this.file.name);
    formData.append('idPersona', '264');
    const subscription = this.source.subscribe(val => {
      this.progress = val 
    });
    this.fileUploadService.sendFile(this.endpoint, formData, this.httpOptions
      ).subscribe(
        (event: HttpEvent<any>) => {
          //console.log(event);
        switch (event.type) {
          case HttpEventType.Sent:
            //console.log('Request has been made!');
            break;
          case HttpEventType.ResponseHeader:
            //console.log('Response header has been received!');
            break;
          case HttpEventType.UploadProgress:
            //this.progress = Math.round(event.loaded / event.total * 100);
            //console.log(`Uploaded! ${this.progress}%`);
            break;
          case HttpEventType.Response:
            this.loading = false;
            subscription.unsubscribe();
            this.success = event.body.Estado;
            if(event.body.Estado){
              this.mensaje = 'El avalúo con numero único ' + event.body.numeroUnico + ' se subió correctamente';
            }else{
              this.mensaje = 'No se pudo cargar el avalúo';
            }
            //console.log('User successfully created!', event.body);
            setTimeout(() => {
              this.progress = 0;
            }, 1500);
          }
        },
      );
  }

  cancelarAvaluo(): void {
    console.log("hola");
  }*/

}
