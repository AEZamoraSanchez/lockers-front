import { Component, OnInit, signal, Renderer2, Inject} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { StorageService } from '../../../utils/services/storage.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../../utils/services/user.service';
import { Observable } from 'rxjs';
import { userMain } from '../../../utils/interfaces/userInterfaces/userMain.interface';
import { Store, StoreModule, select } from '@ngrx/store';
import { updateUserMain, verReducer } from '../../../stores/userStore/user.actions';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {EntityService } from '../../../utils/services/entities.service';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
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

  showModal = signal(false);
  showDescriptionDiv = signal(false)
  showModalList = signal(false)
  showModalListTask = signal(false)
  showTask = signal(false)
  showDelete = signal(false)
  showDeleteFlags: { [key: string]: boolean } = {};


  formularioModule : FormGroup;
  formularioListTask : FormGroup;
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
      description : ['', [Validators.required, Validators.maxLength(100)]]
    })

    this.formularioListTask = this.form.group({
      title : ['', [Validators.required, Validators.maxLength(35)]],
      description : ['', [Validators.required, Validators.maxLength(100)]]
    })

    this.formularioModule.get('type')?.valueChanges.
    subscribe(selectedType => {
      const descriptionControl = this.formularioModule.get('description')
      if( selectedType === 'module'){
        this.showDescriptionDiv.set(false)
        descriptionControl?.setValidators([])
      } else {
        this.showDescriptionDiv.set(true)
        descriptionControl?.setValidators([Validators.required, Validators.maxLength(100)])
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

    this.user$?.subscribe( (user: any) => {
      this.user = user
      });

    this.route?.params?.subscribe( params => {
      let id = params['id'];
      this.id = id
      if(!id){
        this.user$?.subscribe( (user : any) => {
                this.modules = user?.user?.modules
                this.lists = user?.user?.lists
                this.lockers = user?.user?.lockers
            })
      } else {
        this._entityService.getModuleById(id, this.user?.user?.id).
        subscribe( (module : any) => {
          this.storeModule.dispatch(updateModule({ module : module}))
        },
        (error) => {
          this.toastr.error(error?.error?.message)
        })

        this.module$?.subscribe( (module : any) => {
          this.module = module
          this.modules = module?.module?.modules
          this.lists = module?.module?.lists
          this.lockers = module?.module?.lockers
        },
        (error) => {
          console.log(error)
        })
      }
    })


  }

  closeModal(type : string ) {
    // console.log(type)
    // console.log(this.showModalList())
    this.renderer.setStyle(this.document.body, 'overflow', 'auto')
    type == "module" && this.showModal.set(false)
    type == 'list' && this.showModalList.set(false)
    type == 'task' && this.showModalListTask.set(false)
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

    type == 'task' && !deleteE  && this.showModalListTask.set(true)

    if (type == 'showTask' && !deleteE ) {
      this.showTask.set(true)
      this.taskToShow = task
      // console.log(this.taskToShow)
    }

    if(deleteE){
      this.showDelete.set(true)
      // console.log(type)
      // console.log(id)
      if(type) this.entityToDelete.type = type
      if(id) this.entityToDelete.id = id
    }

    this.renderer.setStyle(this.document.body, 'overflow', 'hidden');
  }

  async createNewEntity(){

    // console.log(this.formularioModule)
    if(!this.formularioModule.valid){
      return
    }

    if(!this.id){
      this._entityService.createEntityInUser(this.formularioModule.value, this.user?.user?.id).
      subscribe( data => {
        // console.log(data)
        if(data){
          this._userService.getUserById(this.tokensDecoded?.accesTokenDecoded?.id).
          subscribe( (response : any) => {
            // console.log(response)
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
        // console.log(data)
        if ( data && this.id){
          this._entityService.getModuleById(this.id, this.user?.user?.id).
          subscribe( (module : any) => {
            // console.log(module)
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
  createNewTask () {
    if(!this.formularioListTask.valid){
      return
    }
    if(this.listToShow?.listTasks){
      this.formularioListTask.value.listId = this.listToShow.id
      this._entityService.createTasks(this.formularioListTask.value, 'list').subscribe(data => {
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

  isUrl(text: string) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const tested = urlRegex.test(text);
    // console.log(text)
    return tested
  }

  toggleShowDelete(moduleId: string | undefined) {
    if(moduleId){
      this.showDeleteFlags[moduleId] = !this.showDeleteFlags[moduleId];
    }
  }

  deleteEntity () {
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

    this.closeModal("delete")
    // console.log(this.entityToDelete)

  }



}
