import { Component } from '@angular/core';
import { AuthService } from '@serv/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'base';
  isAuth = false;
  constructor(
    private auth: AuthService) {
    this.isAuth = this.auth.isAuthenticated();
  }
}
