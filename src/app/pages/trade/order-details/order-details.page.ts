import { Component, OnInit } from "@angular/core"
import { ActivatedRoute } from "@angular/router"
import { AlertController, ModalController, NavController } from "@ionic/angular"
import {
  calculateOrderProfit,
  calculateOrderProfitRatio,
  Currency,
  formatFixedPrice,
  GenericOrder,
  MarketService,
  NotificationService,
  OrderService,
  OrderType,
} from "src/app/services"

@Component({
  selector: "app-order-details",
  templateUrl: "./order-details.page.html",
  styleUrls: ["./order-details.page.scss"],
})
export class OrderDetailsPage implements OnInit {
  rootPage: any
  id: string
  active: boolean

  readonly formatFixedPrice = formatFixedPrice

  order?: GenericOrder
  currency: Currency = { ask: 0, bid: 0 }

  isMarketOpen: boolean
  availableCurrencyPairs: string[] = []

  constructor(
    private readonly router: ActivatedRoute,
    private readonly alertController: AlertController,
    private readonly navController: NavController,
    private readonly orderService: OrderService,
    private readonly marketService: MarketService,
    private readonly notificationService: NotificationService,
    private modalController: ModalController,
  ) {}

  ngOnInit() {
    this.orderService.getOrder(this.id, this.active).subscribe(order => {
      this.order = order

      this.marketService.getCurrency(this.order.currencyPair).subscribe(currency => (this.currency = currency))
    })

    this.marketService.marketState.subscribe(state => {
      this.isMarketOpen = state.open
    })

    this.marketService.marketInfo.subscribe(info => {
      this.availableCurrencyPairs = info.currencyPairs
    })
  }

  get currentPrice() {
    // If the order is a buy order, then the current price for closing is the ask price
    return this.order ? (this.order.type === "buy" ? this.currency.ask : this.currency.bid) : 0
  }

  get currentProfitPercentage() {
    return this.order ? calculateOrderProfitRatio(this.order, this.currency) * 100 : 0
  }

  get currentTotal() {
    return this.order ? this.order.amount + calculateOrderProfit(this.order, this.currency) : 0
  }

  async onCloseOrderButton() {
    const alert = await this.alertController.create({
      header: "Are you sure you want to close the order.",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Yes",
          role: "confirm",
          handler: () => void this.closeOrder(),
        },
      ],
    })

    await alert.present()
  }

  async onEditOrderButton() {
    const alert = await this.alertController.create({
      header: "Order edit",
      message: "Edit the order's stop loss and take profit targets.",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Confirm",
          role: "confirm",
          handler: ({ stopLossTarget, takeProfitTarget }) => void this.editOrder(Number(stopLossTarget), Number(takeProfitTarget)),
        },
      ],
      inputs: [
        {
          name: "takeProfitTarget",
          placeholder: "Take Profit",
          type: "number",
          value: this.order.takeProfitTarget,
        },
        {
          name: "stopLossTarget",
          placeholder: "Stop Loss",
          type: "number",
          value: this.order.stopLossTarget,
        },
      ],
    })

    void alert.present()
  }

  async closeOrder() {
    await this.modalController.dismiss()

    await this.orderService.closeOrder(this.order, this.currency)
    void this.notificationService.showToastMessage("Order closed", "success")
  }

  async editOrder(stopLossTarget: number, takeProfitTarget: number) {
    if (this.order.type === OrderType.Buy) {
      if (stopLossTarget > this.currency.ask) {
        void this.notificationService.showToastMessage("Stop loss target cannot be higher than the current price", "danger")
        return
      }

      if (takeProfitTarget < this.currency.ask) {
        void this.notificationService.showToastMessage("Take profit target cannot be lower than the current price", "danger")
        return
      }
    } else {
      if (stopLossTarget < this.currency.bid) {
        void this.notificationService.showToastMessage("Stop loss target cannot be lower than the current price", "danger")
        return
      }

      if (takeProfitTarget > this.currency.bid) {
        void this.notificationService.showToastMessage("Take profit target cannot be higher than the current price", "danger")
        return
      }
    }

    const success = await this.orderService.editOrder(this.order.id, stopLossTarget, takeProfitTarget)

    if (success) {
      void this.notificationService.showToastMessage("Order updated", "success")
    } else {
      void this.notificationService.showToastMessage("Failed to edit order. It may have been closed already.", "danger")
    }
  }
}
