import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})

export class FileUploadService {

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    ) { }

  sendFile(endpoint, formData, httpOptions): Observable<any> {
    return this.http.post(endpoint, formData, httpOptions).pipe(
      catchError((res) => this.errorMgmt(res))
    )
  }

  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
      this.snackBar.open(errorMessage, 'Cerrar', {
        duration: 10000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      const dialogRef = this.dialog.open(DialogValidacionesXML, {
        width: '600px',
        data: error.error.mensaje
      });
      dialogRef.afterClosed().subscribe(result => {
        window.location.reload();            
      });   
    }
    return throwError(errorMessage);
  }

}


@Component({
  selector: 'app-dialog-validaciones-xml',
  templateUrl: 'app-dialog-validaciones-xml.html',
})
export class DialogValidacionesXML {
  displayedColumns: string[] = ['num', 'error'];
  errores = [];
 
  constructor(
    public dialogRef: MatDialogRef<DialogValidacionesXML>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      dialogRef.disableClose = true;
      this.errores = data.flat();
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
