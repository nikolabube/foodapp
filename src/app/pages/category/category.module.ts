import { SetDatetimePageModule } from './../set-datetime/set-datetime.module';
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

import { CategoryPageRoutingModule } from './category-routing.module';

import { CategoryPage } from './category.page';

import { MenuComponent } from 'src/app/components/menu/menu.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  entryComponents: [
    MenuComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoryPageRoutingModule,
    ComponentsModule,
    SetDatetimePageModule
  ],
  declarations: [CategoryPage]
})
export class CategoryPageModule { }
