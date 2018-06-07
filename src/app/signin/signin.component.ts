import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  signinForm: FormGroup;
  success: Boolean = true;
  constructor(private router: Router, private authService: AuthService) { }
  ngOnInit() {
    this.initForm();
  }

  onSubmit() {
    const username = this.signinForm.value['usernameForm'];
    const password = this.signinForm.value['passwordForm'];
    this.authService.login(username, password)
      .subscribe(result => {
        if (result === true) {
          // login successful
          this.success = result;
          this.router.navigate(['/']);
        } else {
          // login failed
          this.success = result;
        }
      });
  }

  private initForm() {
    const usernameForm = '';
    const passwordForm = '';
    this.signinForm = new FormGroup({
      'usernameForm': new FormControl(usernameForm, Validators.required),
      'passwordForm': new FormControl(passwordForm, Validators.required)
    });
  }

}
