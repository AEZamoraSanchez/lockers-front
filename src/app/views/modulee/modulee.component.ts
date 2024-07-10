import { Component, Inject, OnInit, Renderer2, signal } from '@angular/core';
import { catchError, EMPTY, Observable, of, switchMap } from 'rxjs';
import { userMain } from '../../../utils/interfaces/userInterfaces/userMain.interface';
import { ModuleInterface } from '../../../utils/interfaces/entitiesInterfaces/module.interface';
import { ListInterface } from '../../../utils/interfaces/entitiesInterfaces/list.interface';
import { LockerInterface } from '../../../utils/interfaces/entitiesInterfaces/locker.interface';
import { faCheck, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { faCircleXmark, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StorageService } from '../../../utils/services/storage.service';
import { UserService } from '../../../utils/services/user.service';
import { select, Store } from '@ngrx/store';
import { CommonModule, DOCUMENT } from '@angular/common';
import { EntityService } from '../../../utils/services/entities.service';
import { ActivatedRoute, ParamMap, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { updateUserMain } from '../../../stores/userStore/user.actions';
import { updateModule } from '../../../stores/moduleStore/module.actions';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-modulee',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    MatFormField,
    MatInputModule,
    MatFormFieldModule,
    RouterModule
  ],
  templateUrl: './modulee.component.html',
  styleUrl: './modulee.component.css'
})
export class ModuleeComponent implements OnInit {

  user : any;
  userExist: boolean = false;
  module : any;
  listToShow ? : any;
  taskToShow ? : any;
  entityToDelete : { id : string | null; type : string | null} = {
    id : null,
    type : null
  }


  modules: ModuleInterface[] = []
  lists: ListInterface[] = []
  lockers: LockerInterface[] = []

  faEllipsisV = faEllipsisV;
  faCircleXmark = faCircleXmark as IconProp;
  faTrashCan = faTrashCan as IconProp;
  faCheck = faCheck as IconProp;

  showModal = signal(false);
  showDescriptionDiv = signal(false)
  showModalList = signal(false)
  showModalListTask = signal(false)
  showTask = signal(false)
  showDelete = signal(false)
  showInputListTask = signal(false)
  showDeleteFlags: { [key: string]: boolean } = {};


  formularioModule : FormGroup;
  formularioListTask : FormGroup;
  formularioListCheck : FormGroup;

  tokensDecoded : any;
  id ? : string | null = null;


  constructor(
    private _storageService: StorageService,
    private _userService : UserService,
    private renderer : Renderer2,
    @Inject(DOCUMENT) private document : Document,
    private form : FormBuilder,
    private _entityService : EntityService,
    private route : ActivatedRoute,
    private toastr : ToastrService,
  ){

    this.formularioModule = this.form.group({
      type : ['', Validators.required],
      title : ['', [Validators.required, Validators.maxLength(35)]],
      description : ['', [Validators.maxLength(100)]]
    })

    this.formularioListTask = this.form.group({
      title : ['', [Validators.required, Validators.maxLength(35)]],
      description : ['', [Validators.required, Validators.maxLength(300)]]
    })

    this.formularioListCheck = this.form.group({
      title : ['', [Validators.required, Validators.maxLength(35)]]
    })

    this.formularioModule.get('type')?.valueChanges.
    subscribe(selectedType => {
      const descriptionControl = this.formularioModule.get('description')
      if( selectedType === 'module'){
        this.showDescriptionDiv.set(false)
        descriptionControl?.setValidators([])
      } else {
        this.showDescriptionDiv.set(true)
        descriptionControl?.setValidators([Validators.maxLength(100)])
      }
      descriptionControl?.updateValueAndValidity()
    })

  }

  async ngOnInit() {

    const tokensDecoded = this._storageService.validateToken("login", false)
    this.tokensDecoded = tokensDecoded

    try {
      const user = await this._userService.getUserById2(tokensDecoded?.accesTokenDecoded?.id)
      this.user = user

      this.route.paramMap.
      subscribe( (params : ParamMap) => {
        const id = (params.get('id'))
        this.id = id
        // console.log(user)
        id && this._entityService.getModuleById(id, user.id).subscribe( ( moduleE : any ) => {
          // console.log(moduleE)
          this.module = moduleE
        },
      (error) => {
        this.toastr.error(error?.error?.message)
      })

      })

    }
    catch (error : any) {
      this.toastr.error(error?.error?.message)
    }
  }

  closeModal(type : string ) {
    this.renderer.setStyle(this.document.body, 'overflow', 'auto')
    type == "module" && this.showModal.set(false)
    type == 'list' && this.showModalList.set(false)
    type == 'task' && this.listToShow?.lockerTasks && this.showModalListTask.set(false)
    type == 'task' && this.listToShow?.listTasks && this.showInputListTask.set(false)
    type == 'showTask' && this.showTask.set(false)
    type == 'delete' && this.showDelete.set(false)

  }

  openModal(type : string, id : string | null = null, task : any | null = null, deleteE : boolean | null = null) {
    type == 'module'  && !deleteE && this.showModal.set(true)

    if((type == "list" || type == "locker") && !deleteE ){
      this.showModalList.set(true)
      id && this._entityService.getListById( type, id).
    subscribe( (data : any) => {
      this.listToShow = data
    })
    }

    type == 'task' && !deleteE && this.listToShow?.lockerTasks  && this.showModalListTask.set(true)

    type == 'task' && !deleteE && this.listToShow?.listTasks  && this.showInputListTask.set(true)


    if (type == 'showTask' && !deleteE ) {
      this.showTask.set(true)
      this.taskToShow = task
    }

    if(deleteE){
      this.showDelete.set(true)
      if(type) this.entityToDelete.type = type
      if(id) this.entityToDelete.id = id
    }

    this.renderer.setStyle(this.document.body, 'overflow', 'hidden');
  }

  async createNewEntity(){

    if(!this.formularioModule.valid){
      this.formularioModule.markAllAsTouched();
      return
    }

      this.id && this._entityService.createEntityInModule(this.formularioModule?.value, this.id, this.user?.id ).
      subscribe( data => {
        if ( data && this.id){
          this._entityService.getModuleById(this.id, this.user?.id).
          subscribe( (module : any) => {
            this.module = module
            this.toastr.success('Entity created successfully')
          },
          (error) => {
            console.log(error)
          })
        }
      },
    (error) => {
      console.log(error)
    })

    this.closeModal("module")

  }
  createNewTask (type : string) {

    if(type == 'locker' && !this.formularioListTask.valid){
      this.formularioModule.markAllAsTouched();
      return
    }
    if(type == 'list' && !this.formularioListCheck.valid){
      this.formularioModule.markAllAsTouched();
      return
    }
    if(this.listToShow?.listTasks){
      this.formularioListCheck.value.listId = this.listToShow.id
      this._entityService.createTasks(this.formularioListCheck.value, 'list').subscribe(data => {
        this._entityService.getListById( 'list', this.listToShow.id).
    subscribe( (data : any) => {
      this.listToShow = data
    })
      })
    }
    if(this.listToShow?.lockerTasks){
      this.formularioListTask.value.lockerId = this.listToShow.id
      this._entityService.createTasks(this.formularioListTask.value, 'locker').subscribe(data => {
        this._entityService.getListById( 'locker', this.listToShow.id).
    subscribe( (data : any) => {
      this.listToShow = data
    })
      })
    }

    this.closeModal("task")
  }

  hasErrors( controlName : string, errorType : string ) {
    return this.formularioModule?.get(controlName)?.hasError(errorType) && this.formularioModule?.get(controlName)?.touched
  }

  hasErrorsTasks( controlName : string, errorType : string ) {
    return this.formularioListTask?.get(controlName)?.hasError(errorType) && this.formularioListTask?.get(controlName)?.touched
  }
  hasErrorsTasksCheck( controlName : string, errorType : string ) {
    return this.formularioListCheck?.get(controlName)?.hasError(errorType) && this.formularioListCheck?.get(controlName)?.touched
  }

  isUrl(text: string) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const tested = urlRegex.test(text);
    return tested
  }

  toggleShowDelete(moduleId: string | undefined) {
    if(moduleId){
      this.showDeleteFlags[moduleId] = !this.showDeleteFlags[moduleId];
    }
  }

  updateStatus (event : Event, id : string ) {
    const target = event.target as HTMLInputElement;

    if (target.checked) {
      // console.log(id)
      this._entityService.updateEntity('list-task', id, { status : 'done'}).
      subscribe( data => 'done' );
    } else {
      this._entityService.updateEntity('list-task', id, { status : 'pending'}).
      subscribe( data => "pending" );
    }
  }

  deleteEntity () {

    if(this.entityToDelete.type == 'list' || this.entityToDelete.type == 'module' || this.entityToDelete.type == 'locker'){
      if(this.entityToDelete.id && this.entityToDelete.type){
        this._entityService.deleteEntity(this.entityToDelete?.type, this.entityToDelete?.id).
        subscribe(data => {
          if(data && this.id){
            this._entityService.getModuleById(this.id, this.tokensDecoded?.accesTokenDecoded?.id).
            subscribe( (response : any) => {
              this.module = response
            }, (error) => {
              console.log(error)
            })
          }
        })
      }
    }

    if( this.entityToDelete.type ==  'list-task' || this.entityToDelete.type == 'locker-task'){
      if(this.entityToDelete.id && this.entityToDelete.type){
        this._entityService.deleteEntity(this.entityToDelete?.type, this.entityToDelete?.id).
        subscribe((data : any) => {
          if( data?.listId){
            this._entityService.getListById('list', data.listId ).
            subscribe( (data : any) => {
              this.listToShow = data
            },
          (error) => {
            console.log(error)
          })
          }
          if( data?.lockerId){
            this._entityService.getListById('locker', data.lockerId ).
            subscribe( (data : any) => {
              this.listToShow = data
            },
          (error) => {
            console.log(error)
          })
          }

        },
      (error) => {
        console.log(error)
      })
      }
    }



    this.closeModal("delete")

  }

}
