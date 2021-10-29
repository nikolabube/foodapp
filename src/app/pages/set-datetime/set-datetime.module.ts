import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SetDatetimePageRoutingModule } from './set-datetime-routing.module';

import { SetDatetimePage } from './set-datetime.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SetDatetimePageRoutingModule
  ],
  declarations: [SetDatetimePage]
})
export class SetDatetimePageModule {}
