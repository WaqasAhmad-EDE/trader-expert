import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"

import { ProfilePage } from "./profile.page"

const routes: Routes = [
  {
    path: "",
    component: ProfilePage,
  },
  {
    path: "tradeing-history",
    loadChildren: () => import("./tradeing-history/tradeing-history.module").then(m => m.TradeingHistoryPageModule),
  },
  {
    path: "contact",
    loadChildren: () => import("./contact/contact.module").then(m => m.ContactPageModule),
  },
  {
    path: "balance-history",
    loadChildren: () => import("./balance-history/balance-history.module").then(m => m.BalanceHistoryPageModule),
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilePageRoutingModule {}
