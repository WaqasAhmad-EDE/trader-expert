import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"

import { TradePage } from "./trade.page"

const routes: Routes = [
  {
    path: "",
    component: TradePage,
  },
  {
    path: "order-details",
    loadChildren: () => import("./order-details/order-details.module").then(m => m.OrderDetailsPageModule),
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TradePageRoutingModule {}
