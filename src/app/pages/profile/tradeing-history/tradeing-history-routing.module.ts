import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { TradeingHistoryPage } from "./tradeing-history.page"

const routes: Routes = [
  {
    path: "",
    component: TradeingHistoryPage,
  },
  {
    path: "order-details",
    loadChildren: () => import("./../../trade/order-details/order-details.module").then(m => m.OrderDetailsPageModule),
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TradeingHistoryPageRoutingModule {}
