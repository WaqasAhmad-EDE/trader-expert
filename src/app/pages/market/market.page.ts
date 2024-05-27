import { Component, OnInit } from "@angular/core"
import { Currency, formatFixedPrice, MarketService } from "src/app/services"
import { combineLatest, Observable, of } from "rxjs"
import { map, take, throttleTime } from "rxjs/operators"

@Component({
  selector: "app-market",
  templateUrl: "./market.page.html",
  styleUrls: ["./market.page.scss"],
})
export class MarketPage implements OnInit {
  readonly formatFixedPrice = formatFixedPrice

  constructor(private readonly marketService: MarketService) {}

  loading = true
  currencyPairs: Observable<({ name: string } & Currency)[]> = of([])

  public ngOnInit() {
    // TODO use another way to hide tab-bar
    document.getElementById("app-tab-bar").style.display = "none"

    this.marketService.marketInfo.subscribe(marketInfo => {
      const currencyPairObservables = marketInfo.currencyPairs.map(currencyPair =>
        this.marketService.getCurrency(currencyPair).pipe(map(x => ({ ...x, name: currencyPair }))),
      )

      this.currencyPairs = combineLatest(currencyPairObservables).pipe(throttleTime(1000))

      combineLatest([this.currencyPairs])
        .pipe(take(1))
        .subscribe(() => {
          this.loading = false
          document.getElementById("app-tab-bar").style.display = "flex"
        })
    })
  }
}
