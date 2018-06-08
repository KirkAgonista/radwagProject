import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import User from '../../api/models/users.js';
import {CookieService} from '@ngx-toolkit/cookie';

@Injectable()
export class AuthService {
  public token: string;
  public loggedUser: User = {isAdmin: false};

  constructor(private http: Http, private cookieService: CookieService) {
    // set token if saved in cookies
    const currentUser = JSON.parse(this.cookieService.getItem('currentUser'));
    this.token = currentUser && currentUser.token;
  }

  login(username: string, password: string): Observable<boolean> {
    const body = new URLSearchParams();
    body.set('username', username);
    body.set('password', password);
    return this.http.post('/api/users/login', body )
      .pipe(map((response: Response) => {
        // login successful if there's a jwt token in the response
        const token = response.json() && response.json().token;
        if (token) {
          // set token property
          this.token = token;
          // store username and jwt token and userId in cookies to keep user logged in between page refreshes
          this.cookieService.setItem('currentUser', JSON.stringify({ username: username, token: token, id: response.json().id}));
          this.getUserData();
          // return true to indicate successful login
          return true;
        } else {
          // return false to indicate failed login
          return false;
        }
      }));
  }
  register(user: User) {
    return this.http.post('/api/users/signup', user);
  }
  isAuthenticated() {
    return this.token != null;
  }
  getUserData() {
    const id = JSON.parse(this.cookieService.getItem('currentUser')).id;
    this.http.get('api/users/' + id).pipe(map(response => response.json())).subscribe(user => this.loggedUser = user);
  }
  logout(): void {
    // clear token remove user from cookies to log user out
    this.token = null;
    this.cookieService.clear();
  }
  isAdmin() {
    return this.loggedUser.isAdmin;
  }
}
