import { IonicModule, IonInput } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { loginRoutesModule } from './login-routing.module';
import { LoginComponent } from './login.component';



@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    loginRoutesModule,
    ReactiveFormsModule
  ],
  declarations: [LoginComponent]
})
export class loginModule{}
