import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate {

  constructor(public auth: AuthService, public router: Router) { }

  /**
  *Valida en cada ruta declarada que el usuario este autenticado y si tiene los permisos para ingresar a dicha ruta
  *@return true = usuario autenticado y con permisos en la ruta
  *
  *false = usuario no autenticado y se redirige a la ruta principal
  */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/']);
      return false;
    } else {
      if(route.data.rol) {
        const currentUser = this.auth.getSession();
        const userBandejaEntrada = "/main/" + currentUser.userData.redirect;
        if(userBandejaEntrada != state.url){
          this.router.navigate([userBandejaEntrada]);
        }
      }
      return true;
    }
  }

}
