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
import { IonicModule } from '@ionic/angular';
import { PopoverComponent } from '../components/popover/popover.component';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from './menu/menu.component';
const components = [
    PopoverComponent,
    MenuComponent
];
@NgModule({
    declarations: [
        components
    ],
    imports: [
        CommonModule,
        IonicModule,
        FormsModule,
    ],
    exports: [
        ...components,
    ]
})
export class ComponentsModule { }
