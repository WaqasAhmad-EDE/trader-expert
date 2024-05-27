import { Component, OnInit } from "@angular/core"
import { ActiveOrder, ClosedOrder, formatFixedPrice, OrderService, WithId } from "src/app/services"
import { Observable } from "rxjs"

@Component({
  selector: "app-tradeing-history",
  templateUrl: "./tradeing-history.page.html",
  styleUrls: ["./tradeing-history.page.scss"],
})
export class TradeingHistoryPage implements OnInit {
  readonly formatFixedPrice = formatFixedPrice

  activeOrders: Observable<WithId<ActiveOrder>[]>
  closedOrders: Observable<WithId<ClosedOrder>[]>

  constructor(
    private readonly orderDataService: OrderService,
  ) { }

  ngOnInit() {
    this.activeOrders = this.orderDataService.activeOrders
    this.closedOrders = this.orderDataService.closedOrders
  }
}
