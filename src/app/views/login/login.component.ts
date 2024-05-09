import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { AuthService } from '../../../utils/services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { AuthTemplateComponent } from '../../../utils/templates/auth-template.component';
import { StorageService } from '../../../utils/services/storage.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,
            MatInputModule,
            MatFormFieldModule,
            CommonModule,
            FontAwesomeModule,
            HttpClientModule,
            RouterModule,
            AuthTemplateComponent,
          ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  faGoogle = faGoogle as IconProp
  faFacebook = faFacebook as IconProp
  formularioLogin: FormGroup
  router : Router

  constructor(
    private form : FormBuilder,
    private _authConnection : AuthService,
    private _storageService : StorageService,
    router : Router,
    private toastr : ToastrService,
  ) {
    this.formularioLogin = this.form.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
    this.router = router
  }

  ngOnInit(): void {
  this._storageService.validateToken('', true)

  }

  hasErrors( controlName: string, errorType: string ) {
    return this.formularioLogin?.get(controlName)?.hasError(errorType) && this.formularioLogin?.get(controlName)?.touched
  }

  iniciarSesion() {
    if (!this.formularioLogin.valid) {
      return
    }

 this._authConnection.loginAccount(this.formularioLogin.value)
    .subscribe( (response : any ) => {
      this._storageService.saveInfo("accesasdasdasd" , response.accesToken)
      this._storageService.saveInfo("refresasdasdasd", response.tokenRefresh)
      this.clearToast()
      this.toastr.success('Logged in', undefined, { timeOut : 750 })
      setTimeout(() => {
        this.router.navigate(['']);
      }, 1000)
    },
    (error) => {
      this.toastr.error(error?.error?.message)
    })

  }

  clearToast() {
    this.toastr.clear()
  }

}
