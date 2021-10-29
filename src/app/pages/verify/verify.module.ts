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

import { VerifyPageRoutingModule } from './verify-routing.module';

import { VerifyPage } from './verify.page';
import { NgOtpInputModule } from 'ng-otp-input';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerifyPageRoutingModule,
    NgOtpInputModule
  ],
  declarations: [VerifyPage]
})
export class VerifyPageModule { }
