
import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {AuthServiceService} from '../auth-service.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

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
  register() {
    const email = (<HTMLInputElement>document.getElementById('registerUsername')).value;
    const password = (<HTMLInputElement>document.getElementById('registerPassword')).value;
    if (password.length > 3 && email.trim().length > 0) {
      this.auth.register(email, password);
    } else {
      this.Snackbar.open('Invalid format', 'close', {duration: 2000});
    }
  }

}



