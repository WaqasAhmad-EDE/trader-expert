import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"

import { BalanceHistoryPage } from "./balance-history.page"

const routes: Routes = [
  {
    path: "",
    component: BalanceHistoryPage,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BalanceHistoryPageRoutingModule {}
