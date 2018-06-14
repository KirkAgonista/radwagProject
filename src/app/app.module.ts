import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {
  GoodDeleteConfirmationModalContentComponent,
  GoodInfoModalComponent,
  GoodsComponent,
  ModalContentComponent
} from './goods/goods.component';
import {
  UserDeleteConfirmationModalContentComponent,
  UserModalContentComponent,
  UsersComponent
} from './users/users.component';
import {
  ContractorDeleteConfirmationModalContentComponent,
  ContractorModalContentComponent,
  ContractorsComponent
} from './contractors/contractors.component';
import { NotfoundComponent } from './notfound/notfound.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SigninComponent } from './signin/signin.component';
import { AuthService } from './auth.service';
import {AuthGuard} from './auth-guard.service';
import {CookieModule} from '@ngx-toolkit/cookie';
import {BsModalService} from 'ngx-bootstrap/modal';
import {GoodsService} from './goods/goods.service';
import {UsersService} from './users/users.service';
import {ContractorsService} from './contractors/contractors.service';



@NgModule({
  declarations: [
    AppComponent,
    GoodsComponent,
    UsersComponent,
    ContractorsComponent,
    NotfoundComponent,
    SidebarComponent,
    NavbarComponent,
    SigninComponent,
    ModalContentComponent,
    GoodInfoModalComponent,
    UserModalContentComponent,
    ContractorModalContentComponent,
    UserDeleteConfirmationModalContentComponent,
    GoodDeleteConfirmationModalContentComponent,
    ContractorDeleteConfirmationModalContentComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    HttpModule,
    ReactiveFormsModule,
    AppRoutingModule,
    ModalModule.forRoot(),
    CookieModule.forRoot(),
    NgbModule.forRoot()
  ],
  providers: [
    AuthService,
    BsModalService,
    GoodsService,
    UsersService,
    ContractorsService,
    AuthGuard
  ],
  entryComponents: [
    ModalContentComponent,
    GoodInfoModalComponent,
    UserModalContentComponent,
    ContractorModalContentComponent,
    UserDeleteConfirmationModalContentComponent,
    GoodDeleteConfirmationModalContentComponent,
    ContractorDeleteConfirmationModalContentComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
