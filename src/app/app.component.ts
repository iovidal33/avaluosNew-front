import { Component } from '@angular/core';
import { AuthService } from '@serv/auth.service';
import { BnNgIdleService } from 'bn-ng-idle';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'base';
  isAuth = false;
  constructor(
    private auth: AuthService,
    private bnIdle: BnNgIdleService) {
    this.isAuth = this.auth.isAuthenticated();
    this.bnIdle.startWatching(10).subscribe((res) => {
      if(res) {
          this.auth.closeSession();
      }
    });
  }
}
