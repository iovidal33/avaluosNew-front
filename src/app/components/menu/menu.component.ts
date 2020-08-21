import { Component, OnInit } from '@angular/core';

export interface Menu {
  nombre: string;
  ruta: string;
  icono: string;
}
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  menus: Menu[] = [
    { nombre: 'Dashboard', ruta: '/dashboard', icono: 'dashboard' },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
