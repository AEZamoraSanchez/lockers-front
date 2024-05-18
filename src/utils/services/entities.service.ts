import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ModuleInterface } from "../interfaces/entitiesInterfaces/module.interface";

export interface createEntity {
  type: string;
  title: string;
  description ? : string;
  ownerId ? : string;
}

interface createEntityInModule extends createEntity {
  moduleId: string;

  mainModule: string;
}

@Injectable({
  providedIn: 'root'
})
export class EntityService {

  private urlBackend = 'http://localhost:3000'

  constructor(private http : HttpClient){}

  createEntityInUser(entity : createEntity, userId : string){
    entity.ownerId = userId
    return this.http.post(`${this.urlBackend}/${entity.type}`, entity)
  }

  createEntityInModule ( entity : createEntityInModule, moduleId : string) {
    entity.moduleId = moduleId
    entity.mainModule = moduleId
    return this.http.post(`${this.urlBackend}/${entity.type}`, entity)
  }

  getModuleById ( id : string) {
    return this.http.get(`${this.urlBackend}/module/${id}`)
  }

  getListById ( type : string, id : string){
    return this.http.get(`${this.urlBackend}/${type}/${id}`)
  }


}
