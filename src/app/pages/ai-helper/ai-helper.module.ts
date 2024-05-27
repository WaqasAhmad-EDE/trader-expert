import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AiHelperPageRoutingModule } from './ai-helper-routing.module';

import { AiHelperPage } from './ai-helper.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AiHelperPageRoutingModule
  ],
  declarations: [AiHelperPage]
})
export class AiHelperPageModule {}
