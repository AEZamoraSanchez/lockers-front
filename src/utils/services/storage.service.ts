import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  _router : Router ;

  constructor(
    router : Router,
    private jwtHelperService : JwtHelperService,
    private _authService : AuthService
  ) {
    this._router = router;
  }

  saveInfo ( key : string, value : any) {
    window.localStorage.setItem(key, value);
  }

  getInfo ( key : string) {
    return window.localStorage.getItem(key);
  }

  removeInfo ( key : string) {
    window.localStorage.removeItem(key);
  }

  decodedToken ( token : string ){
    const payloadEncrypted = token.split('.')[1];
    const payload = atob(payloadEncrypted);
    return JSON.parse(payload);
  }

  validateToken ( route : string, acces : boolean | null) {

    const accesToken = this.getInfo('accesasdasdasd')
    const refreshToken = this.getInfo('refresasdasdasd')

    let accesTokenDecoded;

    if(accesToken){
      accesTokenDecoded = this.decodedToken(accesToken)
    }

    const isExpired = this.jwtHelperService.isTokenExpired(refreshToken)

    if(isExpired !== acces){ // si coinciden no entra al if
      this._router.navigate([`${route}`])
      return
    }

    if(acces == false) {
      this.updateRefreshToken()
    }

    return {
      accesTokenDecoded
    }


  }

  updateRefreshToken () {
    this._authService.updateRefreshToken().subscribe(
      (response) => {
        this.saveInfo("refresasdasdasd", response)
      },
      (error) => {
        console.error('Error al actualizar el refresh token:', error);
      }
    );  }
}
