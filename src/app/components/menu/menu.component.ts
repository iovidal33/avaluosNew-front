import { Component, OnInit } from '@angular/core';
import { AuthService } from '@serv/auth.service';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  isRevisor = false;
  session;

  menus: any[] = [
    { nombre: 'Dashboard', ruta: '/dashboard', icono: 'dashboard' },
  ];

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.session = this.authService.getSession();
    if(this.session.userData.redirect === "bandeja-entrada"){
      this.isRevisor = true;
    } else {
      this.isRevisor = false;
    }
    this.menus = this.authService.getMenu();
  }

}
