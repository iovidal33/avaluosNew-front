import { Component, OnInit } from '@angular/core';
import { EfirmaService } from '@serv/efirma.service';

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

  constructor(private efirmaService: EfirmaService) { }

  ngOnInit(): void {
  }

  readCer(): void {

    const readerCert = new FileReader();
    console.log(this.cerFile);
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
        console.log(this.certificado);
      } catch (e) {
        console.log(e);
        this.errorMsg = e;
      }
    };
    readerCert.readAsBinaryString(this.cerFile);
  }

}
