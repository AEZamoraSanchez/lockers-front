import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

export interface createEntity {
  type: string;
  title: string;
  description ? : string;
  ownerId ? : string;
}

@Injectable({
  providedIn: 'root'
})
export class CreateEntityService {

  private urlBackend = 'http://localhost:3000'

  constructor(private http : HttpClient){}

  async createEntityInUser(entity : createEntity, userId : string){
    entity.ownerId = userId
    return this.http.post(`${this.urlBackend}/${entity.type}`, entity)
  }
}
