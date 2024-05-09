import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private urlBackend = 'http://localhost:3000'
  constructor( private http : HttpClient) { }

  getUserById ( id : string ) {
    return this.http.get(`${this.urlBackend}/user/${id}`)
  }
}
