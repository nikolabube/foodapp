import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddNewInvoicePage } from './add-new-invoice.page';

const routes: Routes = [
  {
    path: '',
    component: AddNewInvoicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddNewInvoicePageRoutingModule {}
