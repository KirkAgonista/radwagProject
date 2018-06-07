import {Component, OnInit} from '@angular/core';
import {AuthService} from './auth.service';
import {Cookie, CookieService} from '@ngx-toolkit/cookie';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  @Cookie('accept-cookie')
  acceptedCookie: boolean;
  constructor (private authService: AuthService, private cookieService: CookieService) {}
  ngOnInit() {
    this.authService.getUserData();
    this.acceptCookie();
    this.acceptedCookie = this.cookieService.getItem('accept-cookie') === 'true';
  }

  acceptCookie() {
    this.cookieService.setItem('accept-cookie', 'true');
    this.acceptedCookie = true;
  }
}
