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

import { ChooseRestaurantPageRoutingModule } from './choose-restaurant-routing.module';

import { ChooseRestaurantPage } from './choose-restaurant.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChooseRestaurantPageRoutingModule,
  ],
  declarations: [ChooseRestaurantPage]
})
export class ChooseRestaurantPageModule { }
