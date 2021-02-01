import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEvent, HttpEventType } from '@angular/common/http';
import { AuthService } from '@serv/auth.service';
import { environment } from '@env/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { FileUploadService } from "@serv/file-upload.service";
import { timer } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-subir-avaluo',
  templateUrl: './subir-avaluo.component.html',
  styleUrls: ['./subir-avaluo.component.css']
})
export class SubirAvaluoComponent implements OnInit {
  httpOptions;
  file;

  constructor(
    private authService: AuthService,
    public dialog: MatDialog,
    ) { }
  
  ngOnInit(): void {
    const session = this.authService.getSession();
    this.httpOptions = {
      headers: new HttpHeaders({
        Authorization: session.token
      }),
      reportProgress: true,
      observe: 'events'
    };
  }

  subirAvaluo(): void {
    const dialogRef = this.dialog.open(DialogProgresoUpload, {
      width: '600px',
      data: {httpOptions: this.httpOptions, file: this.file},
    });
    dialogRef.afterClosed().subscribe(result => {
      window.location.reload();
    });
  }

}

@Component({
  selector: 'app-dialog-progreso-upload',
  templateUrl: 'app-dialog-progreso-upload.html',
})
export class DialogProgresoUpload {
  endpoint = environment.endpoint + 'bandeja-entrada/guardarAvaluo';
  loading = false;
  success = false;
  mensaje;
  mode: ProgressBarMode = 'determinate';
  progress: number;
  bufferValue: number;
  source = timer(100,1000);
  
  constructor(
    public fileUploadService: FileUploadService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogProgresoUpload>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      dialogRef.disableClose = true;
      this.loading = true;
      const formData = new FormData();
      formData.append('files', data.file, data.file.name);
      formData.append('idPersona', '264');
      const subscription = this.source.subscribe(val => {
        this.progress = val 
      });
      this.fileUploadService.sendFile(this.endpoint, formData, data.httpOptions
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
            if(this.success){
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

  onNoClick(): void {
    this.dialogRef.close();
  }

}
