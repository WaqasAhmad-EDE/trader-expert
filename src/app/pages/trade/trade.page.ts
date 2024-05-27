import { Component, OnInit, ViewChild } from "@angular/core"
import { FinancialChartType, IgxFinancialChartComponent } from "igniteui-angular-charts"
import { of, Subscription } from "rxjs"
import {
  Currency,
  CurrencyPrice,
  formatFixedPrice,
  intervals,
  MarketService,
  OrderService,
  OrderType,
  PriceInterval,
  TransformDate,
} from "src/app/services"
import { leverages } from "./trade.constants"
import { OrderDetailsPage } from "./order-details/order-details.page"
import { IonContent, ModalController, ViewDidEnter } from "@ionic/angular"
import { HttpClient } from "@angular/common/http"
import { environment } from "../../../environments/environment"
declare const TradingView: any;
import { Keyboard } from "@capacitor/keyboard";
import { AiHelperService } from "../../services/ai-helper.service"
@Component({
  selector: "app-trade",
  templateUrl: "./trade.page.html",
  styleUrls: ["./trade.page.scss"],
})
export class TradePage implements OnInit, ViewDidEnter {
  readonly formatFixedPrice = formatFixedPrice
  readonly intervals = intervals.filter(x => x !== PriceInterval.OneDay)
  readonly leverages = leverages
  readonly intervalNames: Record<Exclude<PriceInterval.OneDay, PriceInterval>, string> = {
    [PriceInterval.OneMinute]: "1 minute",
    [PriceInterval.FiveMinutes]: "5 minutes",
    [PriceInterval.FifteenMinutes]: "15 minutes",
    [PriceInterval.ThirtyMinutes]: "30 minutes",
    [PriceInterval.OneHour]: "1 hour",
  }

  segment = "order"

  balance = 0

  activeOrders = this.orderService.activeOrders

  availableCurrencyPairs: string[] = []
  isMarketOpen = false
  isSelling = false
  isBuying = false

  currentCurrencyPair?: string
  currentCurrency: Currency = { ask: 0, bid: 0 }
  currentCurrencySubscription?: Subscription

  currentInterval = PriceInterval.OneMinute
  leverage = 100
  priceHistory = of<TransformDate<CurrencyPrice>[]>([])

  targetAmount?: number = null
  takeProfitTarget?: number = null
  stopLossTarget?: number = null

  isOpenIntervalModal = false
  isOpenIndicatorsModal = false
  isOpenCurrencyPairsModal = false
  keyboardHeight = '0'

  @ViewChild("openModalCurrencyPairs") currencyPairsModal
  @ViewChild("openModalInterval") intervalModal
  @ViewChild("chart", { static: false }) chart: IgxFinancialChartComponent


  // private webSocket: Socket;
  constructor(
    private readonly marketService: MarketService,
    private readonly orderService: OrderService,
    private readonly modalController: ModalController,
    private readonly http: HttpClient,
    public aiHelperService : AiHelperService,

  ) {
    this.segment = "order"

    // let ws = new WebSocket('wss://socket.polygon.io/forex');


  }


  InputFocused(event: Event) {
    // if (window.screen.width < 425) {
    //   this.keyboardHeight = (window.screen.height / 3).toString() + 'px'
    // }
  }
  InputBlur(event: Event) {
    //   this.keyboardHeight = '0'
    // setTimeout(() => {
    // }, 1000);
  }
  @ViewChild(IonContent, { static: true }) content: IonContent;
  ngAfterViewInit() {

    window.visualViewport.addEventListener('resize' , (ev) => {
      (window.visualViewport.height)
      if(parseInt(this.keyboardHeight) < 150){
        this.keyboardHeight = (window.screen.height - window.visualViewport.height).toString() + 'px'
      }
      else{
        this.keyboardHeight = '0'
      }
    })
    Keyboard.addListener('keyboardDidShow', (res) => {
      this.keyboardHeight = res.keyboardHeight.toString() + 'px'
    })
    Keyboard.addListener('keyboardDidHide', () => {
      this.keyboardHeight = '0'
    })

    //     Keyboard.addListener('keyboardWillShow', (info: KeyboardInfo) => {
    //     setTimeout( () =>  this.content.scrollToBottom(100), 200  )             
    // });
    // Keyboard.addListener('keyboardDidShow', (info: KeyboardInfo) => {
    //     setTimeout( () =>  this.content.scrollToBottom(100), 200  )  
    // });    
    // new TradingView.widget(
    //   {
    //   "width": 980,
    //   "height": 610,
    //   "symbol": "NASDAQ:AAPL",
    //   "timezone": "Etc/UTC",
    //   "theme": "Light",
    //   "style": "1",
    //   "locale": "en",
    //   "toolbar_bg": "#f1f3f6",
    //   "enable_publishing": false,
    //   "withdateranges": true,
    //   "range": "ytd",
    //   "hide_side_toolbar": false,
    //   "allow_symbol_change": true,
    //   "show_popup_button": true,
    //   "popup_width": "1000",
    //   "popup_height": "650",
    //   "no_referral_id": true,
    //   "container_id": "tradingview_bac65"
    // }
    //   );





    // // const ws = new WebSocket('wss://socket.polygon.io/stocks'); // stocks real-time;
    // const socket = new WebSocket('wss://socket.polygon.io/forex') // forex


    // socket.addEventListener("open", (event) => {
    //   console.log('open' , socket.readyState);

    //   socket.send("Hello Server!");
    //   socket.send(`{"action":"auth","params":"${environment.POLY_API_KEY}"}`)
    //   socket.send(`{"action":"subscribe","params":"C.AUD/USD,C.USD/EUR,C.USD/JPY"}`)
    // });


    // socket.addEventListener("message", (event) => {
    //   console.log("Message from server ", event.data);
    //   // socket.send(`{"action":"auth","params":"${environment.POLY_API_KEY}"}`)
    //   // socket.send(`{"action":"subscribe","params":"C.AUD/USD,C.USD/EUR,C.USD/JPY"}`)
    // });


    // socket.close()


    // ws..on('open', () => {
    //   console.log('Connected!')
    //   ws.send(`{"action":"auth","params":"${environment.POLY_API_KEY}"}`)

    //   // forex
    //   ws.send(`{"action":"subscribe","params":"C.AUD/USD,C.USD/EUR,C.USD/JPY"}`)

    //   // aggregates
    //   // ws.send(`{"action":"subscribe","params":"AM.*"}`) // min
    //   // ws.send(`{"action":"subscribe","params":"A.*"}`) // sec

    //   // trades
    //   //ws.send(`{"action":"subscribe","params":"T.*"}`)
    //   //ws.send(`{"action":"subscribe","params":"T.TSLA"}`)

    //   // quotes
    //   //ws.send(`{"action":"subscribe","params":"Q.*"}`)
    //   //ws.send(`{"action":"subscribe","params":"Q.TSLA"}`)
    // })

    // // Per message packet:
    // ws.on('message', ( data ) => {
    //   console.log(data);

    //   // data = JSON.parse( data )
    //   // data.map(( msg ) => {
    //   //   if( msg.ev === 'status' ){
    //   //     return console.log('Status Update:', msg.message)
    //   //   }
    //   //   console.log(msg)
    //   // })
    // })

    // ws.on('error', console.log)



    // ;(this.chart._toolbarElement.nativeElement.querySelectorAll('.financialChartIndicatorMenuDropDownMenuList span'))
    //   .forEach((f: HTMLElement, count = 0) => {
    //     const childrens = f.nextElementSibling?.childNodes

    //     this.Indicators.push({
    //       key: f.innerText,
    //       value: []
    //     })

    //     childrens?.forEach((element) => {
    //       this.Indicators?.[count].value.push({
    //         key: element.textContent,
    //         value: false,
    //         element: element as HTMLElement
    //       })
    //     });
    //   });

    // (this.chart._toolbarElement.nativeElement.querySelectorAll('.financialChartTypePicker ul li'))
    //   .forEach((f: HTMLElement, count = 0) => {
    //     if (f.innerText != 'Auto')
    //       this.chartType.push({
    //         key: f.innerText,
    //         value: count == 3 ? true : false,
    //         element: f as HTMLElement
    //       })
    //   });

    // this.chart.trendLineBrushes = ["#ff0000", "#ffff00", "#00ffff"];
  }


  chartType: any[] = []

  setChartType(chartType, element) {
    chartType.forEach(el => {
      el.value = false
    });
    element.value = true
    const e = element.element as HTMLElement
    e.click()
  }

  getChartName() {
    const el = this?.chartType?.find(f => f.value == true)
    return el
  }
  getActiveIndicatiors() {
    let count = 0
    this.Indicators.forEach(f => {
      f.value.forEach(element => {
        if (element.value) {
          count++
        }
      });
    })
    return count
  }

  Indicators: any[] = []
  setIndicator(i, Indicators, element) {
    if ([1, 2].includes(i)) {
      Indicators[i].value.forEach(el => {
        if (element.key != el.key) {
          el.value = false
        }
      });
    }
    element.value = !element.value
    const e = element.element as HTMLElement
    e.click()
  }

  ngOnInit() {
    this.orderService.balance.subscribe(balance => {
      this.balance = balance
    })

    this.marketService.marketInfo.subscribe(info => {
      this.availableCurrencyPairs = info.currencyPairs

      // if there is no current currency, set it to the first one when it becomes available
      if (!this.currentCurrencyPair && info.currencyPairs.length > 0) {
        this.changeCurrencyStream(info.currencyPairs[0], this.currentInterval)
      }
    })

    this.marketService.marketState.subscribe(state => {
      this.isMarketOpen = state.open
    })
  }

  ionViewDidEnter() {
    // this.passThroughVerticalSwipeEvents()
  }

  _showAutoCloseFields = false

  get showAutoCloseFields() {
    return this._showAutoCloseFields
  }

  set showAutoCloseFields(value: boolean) {
    this._showAutoCloseFields = value

    if (!value) {
      this.takeProfitTarget = null
      this.stopLossTarget = null
    }
  }

  get canBuy() {
    if (!this.isMarketOpen) {
      return false
    }

    if (this.targetAmount > this.balance) {
      return false
    }

    if (this.targetAmount < 10) {
      return false
    }

    if (this.takeProfitTarget == null && this.stopLossTarget == null) {
      // If no take profit or stop loss is set, then the user always can buy
      return true
    }

    if (this.takeProfitTarget != null && this.takeProfitTarget < this.currentCurrency.ask) {
      // We can set up a take profit on buy only if the take profit is higher than the current price
      return false
    }

    if (this.stopLossTarget != null && this.stopLossTarget > this.currentCurrency.ask) {
      // We can set up a stop loss on buy only if the stop loss is lower than the current price
      return false
    }

    return true
  }

  get canSell() {
    if (!this.isMarketOpen) {
      return false
    }

    if (this.targetAmount > this.balance) {
      return false
    }

    if (this.targetAmount < 10) {
      return false
    }

    if (this.takeProfitTarget == null && this.stopLossTarget == null) {
      // If no take profit or stop loss is set, then the user always can sell
      return true
    }

    if (this.takeProfitTarget != null && this.takeProfitTarget > this.currentCurrency.bid) {
      // We can set up a take profit on sell only if the take profit is lower than the current price
      return false
    }

    if (this.stopLossTarget != null && this.stopLossTarget < this.currentCurrency.bid) {
      // We can set up a stop loss on sell only if the stop loss is higher than the current price
      return false
    }

    if (this.isBuying || this.isSelling) {
      // If any transaction in process
      return false
    }

    return true
  }

  async changeCurrencyStream(currencyPair: string, interval: PriceInterval): Promise<void> {

    if (currencyPair == this.currentCurrencyPair && interval == this.currentInterval) {
      return
    }

    // Change the history stream if the currency or interval changes
    this.priceHistory = this.marketService.getCurrencyHistory(currencyPair, interval)

    if (this.currentCurrencyPair != currencyPair) {
      // If the currency has changed, change the real-time price stream
      this.currentCurrencySubscription?.unsubscribe()

      this.currentCurrencySubscription = this.marketService.getCurrency(currencyPair).subscribe(currency => (this.currentCurrency = currency))

      this.currentCurrencyPair = currencyPair

    }

    this.currentInterval = interval

    await this.currencyPairsModal.dismiss()
    await this.intervalModal.dismiss()
  }

  async openOrder(type: OrderType): Promise<void> {
    await this.orderService.openOrder({
      type,
      amount: this.targetAmount,
      openPrice: type === OrderType.Buy ? this.currentCurrency.ask : this.currentCurrency.bid,
      openDate: new Date() as any,
      currencyPair: this.currentCurrencyPair,
      leverage: this.leverage,

      takeProfitTarget: this.takeProfitTarget,
      stopLossTarget: this.stopLossTarget,
    })

    this.targetAmount = null
    this.stopLossTarget = null
    this.takeProfitTarget = null
  }

  async buy(): Promise<void> {
    this.isBuying = true
    await this.openOrder(OrderType.Buy)
    this.isBuying = false
  }

  async sell(): Promise<void> {
    this.isSelling = true
    await this.openOrder(OrderType.Sell)
    this.isSelling = false
  }

  get formatYLabel(): (value: number) => string {
    return value => formatFixedPrice(value, this.currentCurrencyPair)
  }

  async onOrderDetails(id: string) {
    const modalView = await this.modalController.create({
      component: OrderDetailsPage,
      canDismiss: true,
      mode: "ios",
      initialBreakpoint: 0.75,
      breakpoints: [0, 0.75, 0.95],
      componentProps: {
        id,
        active: true,
      },
    })

    await modalView.present()
  }

  /**
   * Prevents the chart from stealing touch events when scrolling the page.
   */
  private passThroughVerticalSwipeEvents() {
    const element = this.chart._mainElement.nativeElement as Element
    const children = element.querySelectorAll("canvas")

    for (let i = 0; i < children.length; i++) {
      if (children[i].style.touchAction != "none") {
        continue
      }

      children[i].addEventListener("touchend", () => {
        children[i].style.touchAction = "pan-y"
      })
      break
    }
  }

  ionFocused(event) {
    //console.log(event);
  }
}
