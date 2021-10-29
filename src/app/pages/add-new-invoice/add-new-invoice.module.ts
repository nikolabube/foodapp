import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddNewInvoicePageRoutingModule } from './add-new-invoice-routing.module';

import { AddNewInvoicePage } from './add-new-invoice.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddNewInvoicePageRoutingModule
  ],
  declarations: [AddNewInvoicePage]
})
export class AddNewInvoicePageModule {}
