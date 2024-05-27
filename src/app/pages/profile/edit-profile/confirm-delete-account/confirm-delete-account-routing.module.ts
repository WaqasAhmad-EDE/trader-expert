import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { ConfirmDeleteAccountPage } from "./confirm-delete-account.page"

const routes: Routes = [
  {
    path: "",
    component: ConfirmDeleteAccountPage,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfirmDeleteAccountRoutingModule {}
