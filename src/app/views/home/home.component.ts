import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../utils/services/storage.service';
import { Router } from '@angular/router';
import { UserService } from '../../../utils/services/user.service';
import { Observable } from 'rxjs';
import { userMain } from '../../../utils/interfaces/userInterfaces/userMain.interface';
import { Store, StoreModule } from '@ngrx/store';
import { updateUserMain, verReducer } from '../../../stores/userStore/user.actions';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  private _router : Router;
  user$ ? : Observable<userMain | null>
  user : any;

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

  mostrarReducer(){
    this.store.dispatch(verReducer())
    console.log(this.user)
  }
}
