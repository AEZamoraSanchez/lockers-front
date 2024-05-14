import { Component, OnInit, signal, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
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

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, AfterViewChecked {

  private _router : Router;
  user$ ? : Observable<userMain | null>
  user : any;
  faEllipsisV = faEllipsisV;
  showModal = signal(true);
  contentHeight ? : number;
  @ViewChild('mainElement') mainElement ? : ElementRef;


  constructor(
    private _storageService: StorageService,
    router : Router,
    private _userService : UserService,
    private store : Store<{ user : userMain | null}>
  ){
    this._router = router;
    this.user$ = this.store.select('user')

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

  ngAfterViewChecked
  () {
    const mainHeight = this.mainElement?.nativeElement?.offsetHeight;
    const modalContainer = document.querySelector('.modal-container');
    if (modalContainer) {
      (modalContainer as HTMLElement).style.height = `${mainHeight + 80}px`;
    }
  }


  mostrarReducer(){
    // this.store.dispatch(verReducer())
    console.log(this.user)
  }

  closeModal() {
    this.showModal.set(false)
  }

  openModal() {
    this.showModal.set(true)
  }
}
