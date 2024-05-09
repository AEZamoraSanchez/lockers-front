import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { userToLogin } from '../interfaces/authInterfaces/userToLoginDto';
import { userToSign } from '../interfaces/authInterfaces/userToSignDto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private urlBackend = 'http://localhost:3000'
  constructor( private http : HttpClient ) { }

  loginAccount ( user : userToLogin ) {
    return this.http.post(`${this.urlBackend}/auth/login`, user)
  }

  signUp ( user : userToSign ) {
    return this.http.post(`${this.urlBackend}/auth/sign`, user)
  }

  updateRefreshToken () {
    return this.http.get(`${this.urlBackend}/auth/refresh`, { responseType: 'text' })
  }

}
