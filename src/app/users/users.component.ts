import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {UsersService} from './users.service';
import {Subscription} from 'rxjs';
import {Users} from './users.model';
import {BsModalService} from 'ngx-bootstrap';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {
  public users: Users[];
  subscription: Subscription;
  private bsModalRef: any;
  constructor(
    public authService: AuthService,
    public usersService: UsersService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.subscription = this.usersService.usersChanged
      .subscribe(
        (users: Users[]) => {
          this.users = users;
        }
      );
    this.users = this.usersService.getUsers();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  openModalUser(editMode: boolean, isAdmin: boolean, i: number) {
    if (!editMode && i === -1) {
      const initialState = {
        title: 'Utwórz nowego operatora',
        edit: 'Utwórz',
        editMode,
        user: {}
      };
      this.bsModalRef = this.modalService.show(UserModalContentComponent, {initialState});
      this.bsModalRef.content.closeBtnName = 'Anuluj';
    } else {
      const initialState = {
        title: 'Edytuj',
        edit: 'Zmień',
        editMode,
        user: this.usersService.getUser(i),
      };
      this.bsModalRef = this.modalService.show(UserModalContentComponent, {initialState});
      this.bsModalRef.content.closeBtnName = 'Anuluj';
    }
  }
  openModalDeleteConfirmation(user: Users) {
    const initialState = {user};
    this.bsModalRef = this.modalService.show(UserDeleteConfirmationModalContentComponent, {initialState});
  }
}
// Modal Component - User Creation/Edit
@Component({
  selector: 'app-modal-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title pull-left">{{title}} {{user.username}}</h4>
      <button type="button" class="close pull-right" aria-label="Close" (click)="bsModalRef.hide()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <div class=" m-0 p-0">
        <form class="m-0 p-3" (ngSubmit)="onSubmit()" [formGroup]="signupForm">
          <div class="form-group">
            <label for="username">Nazwa Operatora:</label>
            <input class="form-control" type="text" name="username" formControlName="username"/>
          </div>
          <div
            class="alert alert-danger"
            *ngIf="signupForm.get('username').hasError('required') && signupForm.get('username').touched">
            Brak nazwy użytkownika.
          </div>
          <div class="form-group">
            <label for="firstName">Imię:</label>
            <input class="form-control" type="text" name="firstName" formControlName="firstName"/>
          </div>
          <div
            class="alert alert-danger"
            *ngIf="signupForm.get('firstName').hasError('required') && signupForm.get('firstName').touched">
            Brak imienia.
          </div>
          <div class="form-group">
            <label for="lastName">Nazwisko:</label>
            <input class="form-control" type="text" name="lastName" formControlName="lastName"/>
          </div>
          <div
            class="alert alert-danger"
            *ngIf="signupForm.get('lastName').hasError('required') && signupForm.get('lastName').touched">
            Brak nazwiska.
          </div>
          <div class="form-group">
            <label for="position">Stanowisko:</label>
            <input class="form-control" type="text" name="position" formControlName="position"/>
          </div>
          <div
            class="alert alert-danger"
            *ngIf="signupForm.get('position').hasError('required') && signupForm.get('position').touched">
            Brak stanowiska.
          </div>
          <div class="form-group">
            <label for="email">Email:</label>
            <input class="form-control" type="email" name="email" formControlName="email" required/>
          </div>
          <div
            class="alert alert-danger"
            *ngIf="signupForm.get('email').hasError('required') && signupForm.get('email').touched">
            Brak adresu email.
          </div>
          <div class="form-group">
            <label for="password">Hasło:</label>
            <input class="form-control" type="password" name="password" formControlName="password"/>
          </div>
          <div
            class="alert alert-danger"
            *ngIf="signupForm.get('password').hasError('required') && signupForm.get('password').touched">
            Brak hasła.
          </div>
          <div class="form-group">
            <label for="adminCode">Hasło Administratora:</label>
            <input class="form-control" type="password" name="adminCode" formControlName="adminCode"/>
          </div>
          <div class="row">
            <div class="col-sm-3">
              <button class="btn btn-primary" type="submit" [disabled]="signupForm.invalid">{{edit}}</button>
            </div>
            <div class="col-sm-3">
              <button type="button" class="btn btn-default" (click)="bsModalRef.hide()">{{closeBtnName}}</button>
            </div>
          </div>
        </form>
      </div>
    </div>
 `
})
// Class - User Creation Edit Modal Component
export class UserModalContentComponent implements OnInit {
  title: string;
  edit: string;
  closeBtnName: string;
  signupForm: FormGroup;
  user: Users;
  editMode = false;


  constructor(
    public bsModalRef: BsModalRef,
    public authService: AuthService,
    public router: Router,
    public usersService: UsersService
  ) {}

  ngOnInit() {
    this.initForm();
  }
  onSubmit() {
    if (this.editMode) {
      this.usersService.editUser(this.user._id, this.signupForm.value)
        .subscribe(data => this.usersService.getUsers());
    } else {
      this.authService.register(this.signupForm.value)
        .subscribe(data => this.usersService.getUsers());
    }
    this.bsModalRef.hide();
  }
  private initForm() {
    const username = this.user.username;
    const firstName = this.user.firstName;
    const lastName = this.user.lastName;
    const position = this.user.position;
    const email = this.user.email;
    const password = '';
    const adminCode = '';
    this.signupForm = new FormGroup({
      'username': new FormControl(username, Validators.required),
      'firstName': new FormControl(firstName, Validators.required),
      'lastName': new FormControl(lastName, Validators.required),
      'position': new FormControl(position, Validators.required),
      'email': new FormControl(email, Validators.required),
      'password': new FormControl(password, Validators.required),
      'adminCode': new FormControl(adminCode)
    });
  }
}
// Modal Component - User Delete Confirmation
@Component({
  selector: 'app-modal-confirmation-content',
  template: `<div class="modal-header">
    <h4 class="modal-title pull-left">Potwierdzenie</h4>
      <button type="button" class="close pull-right" aria-label="Close" (click)="bsModalRef.hide()">
    <span aria-hidden="true">&times;</span>
    </button>
    </div>
    <div class="modal-body">
      Czy napewno chcesz usunąć {{user.username}}?
      </div>
      <div class="modal-footer">
      <button type="button"
    class="btn btn-danger"
    (click)="onDeleteUser(user._id)"
      >Usuń</button>
      <button class="btn btn-secondary" type="button" (click)="bsModalRef.hide()">
      Anuluj
      </button>
      </div>`
})
// Class - User Delete Confirmation Modal Component
export class UserDeleteConfirmationModalContentComponent implements OnInit {
  user: Users;

  constructor(
    public bsModalRef: BsModalRef,
    public authService: AuthService,
    public usersService: UsersService
  ) {}

  ngOnInit() {

  }
  async onDeleteUser(userId) {
    if (userId !== this.authService.loggedUser._id && this.authService.isAdmin()) {
       await this.usersService.deleteUser(userId)
        .subscribe(data => this.usersService.getUsers());
    }
    this.bsModalRef.hide();
  }
}
