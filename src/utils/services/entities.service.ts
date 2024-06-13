import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ModuleInterface } from "../interfaces/entitiesInterfaces/module.interface";
import { environment } from "../../environments/environment";

export interface createEntity {
  type: string;
  title: string;
  description ? : string;
  ownerId ? : string;
  propietario : string;
}

interface createEntityInModule extends createEntity {
  moduleId: string;

  mainModule: string;
}

interface createTask {
  title : string;

  description : string;

  lockerId ? : string;

  listId ? : string;
}

interface entityToUpdate {

  title ? : string;
  description ? : string;
  status ? : string;

}

@Injectable({
  providedIn: 'root'
})
export class EntityService {

  private urlBackend = environment.urlBackend
  private headers = new HttpHeaders({
    'Authorization': `Bearer ${environment.tokenSecret}`
  })

  constructor(private http : HttpClient){}

  createEntityInUser(entity : createEntity, userId : string){
    entity.ownerId = userId
    entity.propietario = userId;
    return this.http.post(`${this.urlBackend}/${entity.type}`, entity, {headers: this.headers})
  }

  createEntityInModule ( entity : createEntityInModule, moduleId : string, prop : string ) {
    entity.moduleId = moduleId
    entity.mainModule = moduleId
    entity.propietario = prop
    return this.http.post(`${this.urlBackend}/${entity.type}`, entity, {headers: this.headers})
  }

  createTasks ( createTask : createTask, type : string){
    return this.http.post(`${this.urlBackend}/${type}-task`, createTask, {headers: this.headers})
  }

  getModuleById ( id : string, prop : string) {
    return this.http.get(`${this.urlBackend}/module/${id}/${prop}`, {headers: this.headers})
  }

  getListById ( type : string, id : string){
    return this.http.get(`${this.urlBackend}/${type}/${id}`, {headers: this.headers})
  }

  updateEntity (type : string, id : string, entityToUpdate : entityToUpdate) {
    return this.http.patch(`${this.urlBackend}/${type}/${id}`, entityToUpdate, {headers: this.headers})
  }

  deleteEntity ( type : string,  id : string ){
    return this.http.delete(`${this.urlBackend}/${type}/${id}`, {headers: this.headers})
  }


}
