import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
declare var forge: any;

@Injectable({
  providedIn: 'root'
})
export class EfirmaService {

  private endpoint;

  constructor(private _http: HttpClient) {
   // this.endpoint = environment.OCSP.SAT.baseUrl + environment.OCSP.SAT.getCertificationState;
  }

  readCer(cerFile): any {
    const cerAsn1 = forge.asn1.fromDer(cerFile);
    return forge.pki.certificateFromAsn1(cerAsn1);
  }

  readKey(keyFile, pass): any {
    const keyAsn1 = forge.asn1.fromDer(keyFile);
    const privateKeyInfo = forge.pki.decryptPrivateKeyInfo(keyAsn1, pass);
    if (privateKeyInfo) {
      return forge.pki.privateKeyFromAsn1(privateKeyInfo);
    } else {
      throw new Error('La contraseña no es válida');
    }
  }

  validateKeys(privateKey, publicKey): boolean {
    if (JSON.stringify(privateKey.n.data) !== JSON.stringify(publicKey.n.data)) {
      throw new Error('El certificado no corresponde con la llave privada');
    } else {
      return true;
    }
  }

  signString(cadena: string, privateKey, encode: string = 'utf8'): string {
    const md = forge.md.sha256.create();
    md.update(cadena, encode);
    return forge.util.encode64(privateKey.sign(md));
  }

  getCertificationState(serial: string, rfc: string): any {
    /*const headersOptions = {
      headers: new HttpHeaders({
        'X-Forwarded-Host': environment.OCSP.SAT.hostName,
        Authorization: 'apikey ' + environment.OCSP.SAT.apiKey
      })
    };
    return this._http.post(this.endpoint + '/' + serial + '/' + rfc, {}, headersOptions).toPromise()
      .then(res => {
        return res;
      })
      .catch(err => {
        return err;
      });*/
  }
}
