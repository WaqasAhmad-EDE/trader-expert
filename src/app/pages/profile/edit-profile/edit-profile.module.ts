import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

import { IonicModule } from "@ionic/angular"

import { EditProfilePageRoutingModule } from "./edit-profile-routing.module"

import { EditProfilePage } from "./edit-profile.page"
import { ConfirmDelAccountComponent } from "./confirm-del-account/confirm-del-account.component"

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, EditProfilePageRoutingModule],
  declarations: [EditProfilePage, ConfirmDelAccountComponent],
})
export class EditProfilePageModule {}
