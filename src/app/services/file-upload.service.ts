import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})

export class FileUploadService {

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
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
      this.snackBar.open(error.error.mensaje, 'Cerrar', {
        duration: 10000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
    }
    return throwError(errorMessage);
  }

}