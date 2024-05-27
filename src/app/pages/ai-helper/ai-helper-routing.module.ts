import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AiHelperPage } from './ai-helper.page';

const routes: Routes = [
  {
    path: '',
    component: AiHelperPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AiHelperPageRoutingModule {}
