import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { userToLogin } from '../interfaces/authInterfaces/userToLoginDto';
import { userToSign } from '../interfaces/authInterfaces/userToSignDto';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private urlBackend = environment.urlBackend

  private headers = new HttpHeaders({
    'Authorization': `Bearer ${environment.tokenSecret}`
  })

  constructor( private http : HttpClient ) { }

  loginAccount ( user : userToLogin ) {
    return this.http.post(`${this.urlBackend}/auth/login`, user, { headers : this.headers})
  }

  signUp ( user : userToSign ) {
    return this.http.post(`${this.urlBackend}/auth/sign`, user, { headers : this.headers})
  }

  updateRefreshToken () {
    return this.http.get(`${this.urlBackend}/auth/refresh`, { headers: this.headers, responseType: 'text' })
  }

}
