import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

import { IonicModule } from "@ionic/angular"

import { ProfilePageRoutingModule } from "./profile-routing.module"

import { ProfilePage } from "./profile.page"
// import { IgxFinancialChartCoreModule } from " "
import { EditProfilePageModule } from "./edit-profile/edit-profile.module"

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ProfilePageRoutingModule
    // , IgxFinancialChartCoreModule
    , EditProfilePageModule],
  declarations: [ProfilePage],
})
export class ProfilePageModule {}
