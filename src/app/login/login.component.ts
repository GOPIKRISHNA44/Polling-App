import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {AuthServiceService} from '../auth-service.service';
import {MatSnackBar} from '@angular/material';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email = new FormControl('', [Validators.required, Validators.email]);
  hide = true;
  constructor(private auth: AuthServiceService, private Snackbar: MatSnackBar) {

    this.auth.authChecker.subscribe(message => {
      if (message && !message['success']) {
        this.Snackbar.open(message.data, 'close', {duration: 2000});
      }
    });
  }

  ngOnInit() {
  }

  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
      this.email.hasError('email') ? 'Not a valid email' :
        '';
  }
  login() {
    const email = (<HTMLInputElement>document.getElementById('loginUsername')).value;
    const password = (<HTMLInputElement>document.getElementById('loginPassword')).value;
    if (password.length > 3 && email.trim().length > 0) {
      this.auth.login(email, password);
    } else {
      this.Snackbar.open('Invalid format', 'close', {duration: 2000});
    }
  }


}
