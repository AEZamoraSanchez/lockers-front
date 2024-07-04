import { Routes } from '@angular/router';
import { SignUpComponent } from './views/sign-up/sign-up.component';
import { LoginComponent } from './views/login/login.component';
import { HomeComponent } from './views/home/home.component';
import { JwtModule } from '@auth0/angular-jwt';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { GuestComponent } from './views/guest/guest.component';

export const routes: Routes = [
  // { path: '', redirectTo: 'sign-up', pathMatch: 'full' },
    {path: "sign-up", component: SignUpComponent},
    {path: "login", component: LoginComponent},
    {path: "home", component: HomeComponent},
    {path: "module/:id", component: HomeComponent},
    {path: "guest", component: GuestComponent},
    {path: "**", redirectTo:'home'}
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
