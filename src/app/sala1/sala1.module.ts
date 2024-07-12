import { IonicModule, IonInput } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Sala1Component } from './sala1.component';



@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers:[]
  ,
  declarations: [Sala1Component],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class Sala1Module{}
