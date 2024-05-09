import { Routes } from '@angular/router';
import { SignUpComponent } from './views/sign-up/sign-up.component';
import { LoginComponent } from './views/login/login.component';
import { HomeComponent } from './views/home/home.component';
import { JwtModule } from '@auth0/angular-jwt';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  // { path: '', redirectTo: 'sign-up', pathMatch: 'full' },
    {path: "sign-up", component: SignUpComponent},
    {path: "login", component: LoginComponent},
    {path: "", component: HomeComponent},
    {path: "**", redirectTo:''}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    JwtModule.forRoot({
      config: {
        allowedDomains: ['example.com'], // Reemplaza con tu dominio
        disallowedRoutes: ['http://example.com/auth'], // Rutas excluidas
      },
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
