import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { IonicModule } from "@ionic/angular"
import { ConfirmDeleteAccountRoutingModule } from "./confirm-delete-account-routing.module"
import { ConfirmDeleteAccountPage } from "./confirm-delete-account.page"

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ConfirmDeleteAccountRoutingModule],
  declarations: [ConfirmDeleteAccountPage],
})
export class ConfirmDeleteAccountModule {}
