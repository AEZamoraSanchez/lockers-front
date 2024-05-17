import { Component, OnInit, signal, Renderer2, Inject} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { StorageService } from '../../../utils/services/storage.service';
import { Router } from '@angular/router';
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

  user$ ? : Observable<userMain | null>
  user : any;
  faEllipsisV = faEllipsisV;
  showModal = signal(false);
  formularioModule : FormGroup;
  showDescriptionDiv = signal(false)
  tokensDecoded : any;


  constructor(
    private _storageService: StorageService,
    private _userService : UserService,
    private store : Store<{ user : userMain | null}>,
    private renderer : Renderer2,
    @Inject(DOCUMENT) private document : Document,
    private form : FormBuilder,
    private _createEntityService : CreateEntityService
  ){
    this.user$ = this.store.pipe(select('user'))


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

    this._userService.getUserById(tokensDecoded?.accesTokenDecoded?.id)
    .subscribe( (response : any ) => {
      console.log(response)
      this.store.dispatch(updateUserMain({ user : response}))
    },
   (error) => {
     console.log(error)
   })

   this.user$?.subscribe( user => {
    this.user = user;
    console.log(this.user)
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

  async createNewEntity(){

    // console.log(this.formularioModule)
    if(!this.formularioModule.valid){
      return
    }

    (await this._createEntityService.createEntityInUser(this.formularioModule.value, this.user?.user?.id)).
    subscribe( data => {
      if(data){
        this._userService.getUserById(this.tokensDecoded?.accesTokenDecoded?.id).
        subscribe( (response : any) => {
          console.log(response)
          this.store.dispatch(updateUserMain({ user : response}))
        }, (error) => {
          console.log(error)
        })
      }
    })


    this.closeModal()

    // this._userService.getUserById(this.tokensDecoded?.accesTokenDecoded?.id)
    // .subscribe( (response : any ) => {
    //   console.log(response)
    //   this.store.dispatch(updateUserMain({ user : response}))
    //   console.log(this.user)
    // }, (error) => {
    //   console.log(error)
    // })


  }

  hasErrors( controlName : string, errorType : string ) {
    return this.formularioModule?.get(controlName)?.hasError(errorType) && this.formularioModule?.get(controlName)?.touched
  }

}
