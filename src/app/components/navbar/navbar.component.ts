import { Component, OnInit, signal, ElementRef, HostListener, AfterViewInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { userMain } from '../../../utils/interfaces/userInterfaces/userMain.interface';
import { Store } from '@ngrx/store';
import { StorageService } from '../../../utils/services/storage.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{

  user$ : Observable<userMain | null>
  user : any;
  router : Router;
  navMenu = signal(false)

  constructor(
    private store : Store<{ user: userMain | null }>,
    private _storageService : StorageService,
    router : Router,
    private _eref: ElementRef

  ) {
      this.user$ = this.store.select('user');
      this.router = router;

  }



  ngOnInit(): void {
    this.user$?.subscribe( user => {
      console.log(user)
      this.user = user
    });
  }




  showMenu () {
    this.navMenu.set(!this.navMenu())
  }

  cerrarSesion () {
    this._storageService.removeInfo('accesasdasdasd')
    this._storageService.removeInfo('refresasdasdasd')
    this.router.navigate(['/login'])
  }

  @HostListener('document:click', ['$event'])
  clickout(event : any) {
    if (!this._eref.nativeElement.contains(event.target)) {
      this.navMenu.set(false)
    }
  }
}
