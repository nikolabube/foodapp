import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SetDatetimePage } from './set-datetime.page';

const routes: Routes = [
  {
    path: '',
    component: SetDatetimePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetDatetimePageRoutingModule {}
