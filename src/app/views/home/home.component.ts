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
import { updateModule } from '../../../stores/entitiesStore/entities.actions';
import { ListInterface } from '../../../utils/interfaces/entitiesInterfaces/list.interface';
import { LockerInterface } from '../../../utils/interfaces/entitiesInterfaces/locker.interface';


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

  modules: ModuleInterface[] = []
  lists: ListInterface[] = []
  lockers: LockerInterface[] = []

  faEllipsisV = faEllipsisV;
  faCircleXmark = faCircleXmark as IconProp;

  showModal = signal(false);
  showDescriptionDiv = signal(false)
  formularioModule : FormGroup;
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
    private route : ActivatedRoute
  ){
    this.user$ = this.storeUser.pipe(select('user'))
    this.module$ = this.storeModule.pipe(select('module'))


    this.formularioModule = this.form.group({
      type : ['', Validators.required],
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

    let id;
    this.route?.params?.subscribe( params => {
      id = params['id'];
      this.id = id
      if(id){
        this._entityService.getModuleById(id).
        subscribe( (module : any) => {
          this.storeModule.dispatch(updateModule({ module : module}))
          // console.log(module)
        },
        (error) => {
          console.log(error)
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
    });
    this._userService.getUserById(tokensDecoded?.accesTokenDecoded?.id)
      .subscribe( (response : any ) => {
        this.storeUser.dispatch(updateUserMain({ user : response}))
      },
     (error) => {
       console.log(error)
     })

    if(!id){
      this.user$?.subscribe( (user : any) => {
              this.user = user
              this.modules = user?.user?.modules
              this.lists = user?.user?.lists
              this.lockers = user?.user?.lockers
          })
    }
  }

  closeModal() {
    this.showModal.set(false)
    this.renderer.setStyle(this.document.body, 'overflow', 'auto')
  }

  openModal() {
    this.showModal.set(true)
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
      this._entityService.createEntityInModule(this.formularioModule?.value, this.id ).
      subscribe( data => {
        console.log(data)
        if ( data && this.id){
          this._entityService.getModuleById(this.id).
          subscribe( (module : any) => {
            console.log(module)
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
    this.closeModal()

  }

  hasErrors( controlName : string, errorType : string ) {
    return this.formularioModule?.get(controlName)?.hasError(errorType) && this.formularioModule?.get(controlName)?.touched
  }

}
