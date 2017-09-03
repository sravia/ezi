import { Injectable } from '@angular/core';
import { AuthHttp, JwtHelper } from 'angular2-jwt';
import { Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/toPromise';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class AuthService {
  public error: string;
  public loggedIn = false;
  private _jwtHelper: JwtHelper = new JwtHelper();
  private API = "/api/user";

  constructor(private http: Http, private router: Router) {
    this.getAuthenticatedState();
  }

  public getAuthenticatedState(): Promise<Boolean> {
    var token = localStorage['id_token'];
    const tokenIsPresentAndExpired = token && this._jwtHelper.isTokenExpired(token);
    
    return this.http.get(this.API+'/authenticate')
    .map( res => res.json())
    .toPromise()
      .then(res => {
        if (res && res.token) {
          this.setAuthenticatedUser(res);
          return true;
        }
        return false;
      });
  }

  public login(email: string, password: string): void {
    this.http.post(this.API+'/login', {email, password})
    .map(res => res.json())
    .subscribe(res => this.handleLogin.call(this, res),
              err => this.error = JSON.parse(err._body).msg);
  }

  public signup(user): void {
    this.http.post(this.API+'/signup', user)
    .toPromise()
      .then(res => {
        console.log(res);
        return false;
      });
  }

  public logout(): void {
    if (!localStorage['id_token']) {
      return;
    }

    this.http.get(this.API+'/logout')
      .subscribe(() => {
        this.loggedIn = false;
        localStorage.removeItem('id_token');
      });
  }

  public setAuthenticatedUser(res) {
    console.log(res);    
    this.loggedIn = true;
    localStorage['id_token'] = res.token;
  }

  private handleLogin(res): void {
    this.setAuthenticatedUser(res);
    this.router.navigate(['/home']);    
  }

}
