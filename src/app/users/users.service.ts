import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import {map} from 'rxjs/operators';


import {Subject} from 'rxjs';
import {Users} from './users.model';

@Injectable()
export class UsersService {
  usersChanged = new Subject<Users[]>();
  private users: Users[];
  constructor(private http: Http) {}
  getUsers() {
    this.http.get('api/users')
      .pipe(map(response => response.json()))
      .subscribe(users => this.setUsers(users));
    return this.users;
  }
  setUsers(users: Users[]) {
    this.users = users;
    this.usersChanged.next(this.users.slice());
  }
  getUser(i: number) {
    return this.users[i];
  }
  editUser(userId, user) {
    return this.http.put('api/users/' + userId, user);
  }
  deleteUser(userId) {
    return this.http.delete('api/users/' + userId);
  }
}
