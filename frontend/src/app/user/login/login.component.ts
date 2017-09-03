import { Component } from '@angular/core';
import { Http }      from '@angular/http';
import { AuthService } from './../auth.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {
  public email: string;
  public password: string;

  constructor(public authService: AuthService) {}

  public login(): void {
    this.authService.login(this.email, this.password);
  }

  ngOnDestroy() {
    this.authService.error = null;
  }
};