import { VariationsPageModule } from './../variations/variations.module';
/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 foodies app
  Created : 28-Feb-2021
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RestDetailsPageRoutingModule } from './rest-details-routing.module';

import { RestDetailsPage } from './rest-details.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RestDetailsPageRoutingModule,
    VariationsPageModule
  ],
  declarations: [RestDetailsPage]
})
export class RestDetailsPageModule { }
