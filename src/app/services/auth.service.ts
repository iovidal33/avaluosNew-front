import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
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

  public setSession(session: AuthData): void {
    localStorage.setItem('session_' + environment.appName, JSON.stringify(session));
  }

  public getSession(): AuthData {
    if (this.isAuthenticated()) {
      return JSON.parse(localStorage.getItem('session_' + environment.appName))
    } else {
      return {} as AuthData;
    }
  }

  public getMenu(): any {
    const sess = JSON.parse(localStorage.getItem('session'))
    if (sess) {
      return sess.userData.menu;
    } else {
      return [];
    }
  }

  public closeSession(): void {
    localStorage.removeItem('session_' + environment.appName);
    this.router.navigate(['/']);
  }

  public isAuthenticated(): boolean {
    const session = localStorage.getItem('session_' + environment.appName);
    return session ? true : false;
  }
}
