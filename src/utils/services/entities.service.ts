import { HttpClient } from "@angular/common/http";
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

@Injectable({
  providedIn: 'root'
})
export class EntityService {

  private urlBackend = environment.urlBackend

  constructor(private http : HttpClient){}

  createEntityInUser(entity : createEntity, userId : string){
    entity.ownerId = userId
    entity.propietario = userId;
    return this.http.post(`${this.urlBackend}/${entity.type}`, entity)
  }

  createEntityInModule ( entity : createEntityInModule, moduleId : string, prop : string ) {
    entity.moduleId = moduleId
    entity.mainModule = moduleId
    entity.propietario = prop
    return this.http.post(`${this.urlBackend}/${entity.type}`, entity)
  }

  createTasks ( createTask : createTask, type : string){
    return this.http.post(`${this.urlBackend}/${type}-task`, createTask)
  }

  getModuleById ( id : string, prop : string) {
    return this.http.get(`${this.urlBackend}/module/${id}/${prop}`)
  }

  getListById ( type : string, id : string){
    return this.http.get(`${this.urlBackend}/${type}/${id}`)
  }

  deleteEntity ( type : string,  id : string ){
    return this.http.delete(`${this.urlBackend}/${type}/${id}`)
  }


}
