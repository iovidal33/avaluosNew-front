import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate {

  constructor(public auth: AuthService, public router: Router) { }

  /*canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }*/
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/']);
      return false;
    } else {
      if(route.data.rol) {
        const currentUser = this.auth.getSession();
        const userBandejaEntrada = "/main" + currentUser.userData.menu[0].ruta;
        
        if(userBandejaEntrada != state.url){
          this.router.navigate([userBandejaEntrada]);
        }
      }
      return true;
    }
  }

}
