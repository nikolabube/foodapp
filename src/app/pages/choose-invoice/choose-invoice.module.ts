import { ComponentsModule } from './../../components/components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChooseInvoicePageRoutingModule } from './choose-invoice-routing.module';

import { ChooseInvoicePage } from './choose-invoice.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChooseInvoicePageRoutingModule,
    ComponentsModule,
  ],
  declarations: [ChooseInvoicePage]
})
export class ChooseInvoicePageModule {}
