import { Component, OnInit } from '@angular/core';
import {FormBuilder,FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { AuthTemplateComponent } from '../../../utils/templates/auth-template.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { HttpClientModule } from '@angular/common/http';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../utils/services/auth.service';
import { StorageService } from '../../../utils/services/storage.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule, CommonModule, FontAwesomeModule, HttpClientModule, AuthTemplateComponent, RouterModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent implements OnInit {

  faGoogle = faGoogle as IconProp
  faFacebook = faFacebook as IconProp
  formularioSign: FormGroup
  router : Router

  constructor(
    private form: FormBuilder,
    private _authConnection : AuthService,
    private _storageService: StorageService,
    router : Router,
    private toastr: ToastrService
  ) {
    this.formularioSign = this.form.group({
      username: ['', [
        Validators.required,
        Validators.minLength(5)
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+$/)
      ]]
    });

    this.router = router
  }

  ngOnInit(): void {
    this._storageService.validateToken('', true)
  }

  hasErrors( controlName: string, errorType: string ) {
    return this.formularioSign?.get(controlName)?.hasError(errorType) && this.formularioSign?.get(controlName)?.touched
  }

  submitForm() {
    if (!this.formularioSign.valid){
      return
    }

    this._authConnection.signUp( this.formularioSign.value )
    .subscribe( (response : any) => {
      this._storageService.saveInfo("accesasdasdasd" , response.accesToken)
      this._storageService.saveInfo("refresasdasdasd", response.tokenRefresh)
      this.clearToast()
      this.toastr.success('User successfully created', undefined, { timeOut: 750 })
      setTimeout(() => {
        this.router.navigate(['login'])
      }, 1000)
    },
   error => {
      this.toastr.error(error?.error?.message)
    })
  }

  clearToast() {
    this.toastr.clear()
  }

}
