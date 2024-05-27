import { Component, OnInit } from "@angular/core"
import { Observable, of } from "rxjs"
import { OrderService, UserBalance } from "src/app/services"

@Component({
  selector: "app-balance-history",
  templateUrl: "./balance-history.page.html",
  styleUrls: ["./balance-history.page.scss"],
})
export class BalanceHistoryPage implements OnInit {
  balanceHistory: Observable<UserBalance[]> = of([])

  constructor(private readonly orderService: OrderService) {}
  ngOnInit() {
    this.balanceHistory = this.orderService.balanceHistory
  }
}
