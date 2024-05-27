import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

import { IonicModule } from "@ionic/angular"
import { InitializePageRoutingModule } from "./initialize-routing.module"
import { InitializePage } from "./initialize.page"

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InitializePageRoutingModule,
  ],
  declarations: [InitializePage],
})
export class InitializePageModule {}
