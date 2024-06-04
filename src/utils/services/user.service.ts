import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private urlBackend = environment.urlBackend;
  constructor( private http : HttpClient) { }

  getUserById ( id : string ) {
    return this.http.get(`${this.urlBackend}/user/${id}`)
  }
}
