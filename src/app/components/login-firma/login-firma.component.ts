import { Component, OnInit } from '@angular/core';
import { EfirmaService } from '@serv/efirma.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface Certificado {
  nombre: string;
  pais: string;
  correo: string;
  rfc: string;
  curp: string;
  serial: string;
  publickey: any;
}

@Component({
  selector: 'app-login-firma',
  templateUrl: './login-firma.component.html',
  styleUrls: ['./login-firma.component.css']
})
export class LoginFirmaComponent implements OnInit {
  passVisibility = false;
  cerFile;
  keyFile;
  errorMsg;
  loading = false;
  certificado = {} as Certificado;
  pass;
  success = false;
  endpoint = environment.ssoEndpoint + 'usuarios';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: environment.ssoToken
    })
  };

  constructor(
    private efirmaService: EfirmaService,
    private snackBar: MatSnackBar,
    private http: HttpClient) { }

  ngOnInit(): void {
  }

  readCer(): void {
    const readerCert = new FileReader();
    readerCert.onload = () => {
      try {
        const certificate = this.efirmaService.readCer(readerCert.result);
        //
        this.certificado.nombre = certificate.subject.attributes[2].value;
        this.certificado.pais = certificate.subject.attributes[3].value;
        this.certificado.correo = certificate.subject.attributes[4].value;
        this.certificado.rfc = certificate.subject.attributes[5].value;
        this.certificado.curp = certificate.subject.attributes[6].value;
        this.certificado.serial = certificate.serialNumber;
        this.certificado.publickey = certificate.publicKey;
      } catch (e) {
        this.errorMsg = e;
      }
    };
    readerCert.readAsBinaryString(this.cerFile);
  }

  login(): void {
    const readerkey = new FileReader();
    readerkey.onload = () => {
      try {
        const privateKey = this.efirmaService.readKey(readerkey.result, this.pass);
        this.efirmaService.validateKeys(privateKey, this.certificado.publickey);
        const payload = {
          serial_firma: this.certificado.serial,
          rfc: this.certificado.rfc
        };
        this.http.post(this.endpoint + '/login-firma', payload,
          this.httpOptions).subscribe(
            (res: any) => {
              this.success = true;
              this.loading = false;
            },
            (error) => {
              this.loading = false;
              this.success = false;
              this.snackBar.open(error.error.mensaje, 'Cerrar', {
                duration: 10000,
                horizontalPosition: 'end',
                verticalPosition: 'top'
              });
            });
      } catch (e) {
        this.snackBar.open(e, 'Cerrar', {
          duration: 10000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }
    };
    readerkey.readAsBinaryString(this.keyFile);
  }

}
