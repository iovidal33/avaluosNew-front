import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// Auth Data poner todos los datos extras
export interface AuthData {
  token: string;
  userData: any;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public router: Router) { }

  public setSession(session: AuthData): void{
    localStorage.setItem('session', JSON.stringify(session));
  }

  public getSession(): AuthData | boolean{
    if(this.isAuthenticated()){
      return JSON.parse(localStorage.getItem('session'))
    }else{
      return false;
    }
  }

  public closeSession(): void{
    localStorage.removeItem('session');
    this.router.navigate(['/']);
  }

  public isAuthenticated(): boolean {
    const session = localStorage.getItem('session');
    return session ? true : false;
  }
}
