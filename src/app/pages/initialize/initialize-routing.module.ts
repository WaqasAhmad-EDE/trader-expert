import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"

import { InitializePage } from "./initialize.page"

const routes: Routes = [
  {
    path: "",
    component: InitializePage,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InitializePageRoutingModule {}
