import { Component, OnInit, signal, Renderer2, Inject} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { StorageService } from '../../../utils/services/storage.service';
import { Router } from '@angular/router';
import { UserService } from '../../../utils/services/user.service';
import { Observable } from 'rxjs';
import { userMain } from '../../../utils/interfaces/userInterfaces/userMain.interface';
import { Store, StoreModule } from '@ngrx/store';
import { updateUserMain, verReducer } from '../../../stores/userStore/user.actions';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CreateEntityService } from '../../../utils/services/create-entity.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    MatFormField,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  private _router : Router;
  user$ ? : Observable<userMain | null>
  user : any;
  faEllipsisV = faEllipsisV;
  showModal = signal(false);
  formularioModule : FormGroup;
  showDescriptionDiv = signal(false)


  constructor(
    private _storageService: StorageService,
    router : Router,
    private _userService : UserService,
    private store : Store<{ user : userMain | null}>,
    private renderer : Renderer2,
    @Inject(DOCUMENT) private document : Document,
    private form : FormBuilder,
    private _createEntityService : CreateEntityService
  ){
    this._router = router;
    this.user$ = this.store.select('user')


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

    this._userService.getUserById(tokensDecoded?.accesTokenDecoded?.id)
    .subscribe( (response : any ) => {
      this.store.dispatch(updateUserMain({ user : response}))
    },
   (error) => {
     console.log(error)
   })

   this.user$?.subscribe( user => {
    this.user = user;
  })

  }


  mostrarReducer(){
    // this.store.dispatch(verReducer())
    console.log(this.user)
  }

  closeModal() {
    this.showModal.set(false)
    this.renderer.setStyle(this.document.body, 'overflow', 'auto')
  }

  openModal() {
    this.showModal.set(true)
    this.renderer.setStyle(this.document.body, 'overflow', 'hidden');
  }

  createNewEntity(){

    console.log(this.formularioModule)
    if(!this.formularioModule.valid){
      return
    }

    this._createEntityService.createEntityInUser(this.formularioModule.value, this.user?.user?.id)

  }

  hasErrors( controlName : string, errorType : string ) {
    return this.formularioModule?.get(controlName)?.hasError(errorType) && this.formularioModule?.get(controlName)?.touched
  }

}
