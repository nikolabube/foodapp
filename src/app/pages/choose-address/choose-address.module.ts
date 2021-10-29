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

import { ChooseAddressPageRoutingModule } from './choose-address-routing.module';

import { ChooseAddressPage } from './choose-address.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { PopoverComponent } from 'src/app/components/popover/popover.component';

@NgModule({
  entryComponents: [
    PopoverComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChooseAddressPageRoutingModule,
    ComponentsModule,
  ],
  declarations: [ChooseAddressPage]
})
export class ChooseAddressPageModule { }
