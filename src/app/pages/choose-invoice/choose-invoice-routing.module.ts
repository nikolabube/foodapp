import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChooseInvoicePage } from './choose-invoice.page';

const routes: Routes = [
  {
    path: '',
    component: ChooseInvoicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChooseInvoicePageRoutingModule {}
