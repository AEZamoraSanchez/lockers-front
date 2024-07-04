import { Component, OnInit, signal, Renderer2, Inject} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { StorageService } from '../../../utils/services/storage.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../../utils/services/user.service';
import { EMPTY, Observable, catchError, of, switchMap, tap } from 'rxjs';
import { userMain } from '../../../utils/interfaces/userInterfaces/userMain.interface';
import { Store, StoreModule, select } from '@ngrx/store';
import { updateUserMain, verReducer } from '../../../stores/userStore/user.actions';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEllipsisV, faCheck } from '@fortawesome/free-solid-svg-icons';
import { faCircleXmark, faTrashCan, faSquareCheck} from '@fortawesome/free-regular-svg-icons';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {EntityService } from '../../../utils/services/entities.service';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { ModuleInterface } from '../../../utils/interfaces/entitiesInterfaces/module.interface';
import { updateModule } from '../../../stores/moduleStore/module.actions';
import { ListInterface } from '../../../utils/interfaces/entitiesInterfaces/list.interface';
import { LockerInterface } from '../../../utils/interfaces/entitiesInterfaces/locker.interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
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
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  user$ ? : Observable<userMain | null>
  module$ ? : Observable<ModuleInterface | null>
  user : any;
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
    private storeUser : Store<{ user : userMain | null}>,
    private storeModule : Store<{ module : ModuleInterface | null}>,
    private renderer : Renderer2,
    @Inject(DOCUMENT) private document : Document,
    private form : FormBuilder,
    private _entityService : EntityService,
    private route : ActivatedRoute,
    private toastr : ToastrService
  ){
    this.user$ = this.storeUser.pipe(select('user'))
    this.module$ = this.storeModule.pipe(select('module'))

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

  ngOnInit(): void {

    const tokensDecoded = this._storageService.validateToken("login", false)
    this.tokensDecoded = tokensDecoded

    if( !this.user?.user?.id ){
      this._userService.getUserById(tokensDecoded?.accesTokenDecoded?.id)
      .subscribe( (response : any ) => {
        this.storeUser.dispatch(updateUserMain({ user : response}))
      },
      (error) => {
        this.toastr.error(error?.error?.message)
      })
    }

    this.user$?.pipe(
      switchMap((user: any) => {
        this.user = user;
        if (user?.user) {
          return this.route?.params?.pipe(
            switchMap(params => {
              let id = params['id'];
              this.id = id;
              if (!id) {
                return this.user$?.pipe(
                  switchMap((user: any) => {
                    this.modules = user?.user?.modules;
                    this.lists = user?.user?.lists;
                    this.lockers = user?.user?.lockers;
                    return of(null);
                  })
                ) || EMPTY;
              } else {
                return this._entityService.getModuleById(id, this.user?.user?.id).pipe(
                  switchMap((module: any) => {
                    this.storeModule.dispatch(updateModule({ module: module }));
                    return this.module$?.pipe(
                      switchMap((moduleE: any) => {
                        this.module = moduleE;
                        this.modules = moduleE?.module?.modules;
                        this.lists = moduleE?.module?.lists;
                        this.lockers = moduleE?.module?.lockers;
                        return of(null);
                      })
                    ) || EMPTY;
                  }),
                  catchError((error) => {
                    console.error(error);
                    this.toastr.error(error?.error?.message);
                    return of(null);
                  })
                ) || EMPTY;
              }
            })
          ) || EMPTY;
        } else {
          return EMPTY;
        }
      })
    ).subscribe();
  }

  closeModal(type : string ) {
    // console.log(this.listToShow)
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
    if(!this.id){
      this._entityService.createEntityInUser(this.formularioModule.value, this.user?.user?.id).
      subscribe( data => {
        if(data){
          this._userService.getUserById(this.tokensDecoded?.accesTokenDecoded?.id).
          subscribe( (response : any) => {
            this.storeUser.dispatch(updateUserMain({ user : response}))
          }, (error) => {
            console.log(error)
          })
        }
      }, (error) => {
        console.log(error)
      })
    } else {
      this._entityService.createEntityInModule(this.formularioModule?.value, this.id, this.user?.user?.id ).
      subscribe( data => {
        if ( data && this.id){
          this._entityService.getModuleById(this.id, this.user?.user?.id).
          subscribe( (module : any) => {
            this.storeModule.dispatch(updateModule({ module : module}))
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
    this.closeModal("module")

  }
  createNewTask (type : string) {

    console.log(this.formularioListCheck)
    console.log(this.formularioListTask)
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
          if(data){
            this._userService.getUserById(this.tokensDecoded?.accesTokenDecoded?.id).
            subscribe( (response : any) => {
              this.storeUser.dispatch(updateUserMain({ user : response}))
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
