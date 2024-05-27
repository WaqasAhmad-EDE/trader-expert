import { Injectable } from "@angular/core"
import { Observable } from "rxjs"
import { AngularFirestore } from "@angular/fire/compat/firestore"
import {
  CollectionName,
  Currency,
  CurrencyPrice,
  DocumentName,
  MarketInfo,
  MarketState,
  parseCurrencyPair,
  PriceInterval,
  TransformDate,
} from "./../../../shared"
import { map } from "rxjs/operators"

@Injectable({
  providedIn: "root",
})
export class MarketService {
  constructor(private readonly store: AngularFirestore) { }

  /**
   * Observable of the mostly static market info (currency names, etc.).
   */
  readonly marketInfo: Observable<MarketInfo> = this.store
    .doc<MarketInfo>(DocumentName.MarketInfo)
    .valueChanges()

  /**
   * Observable of the current market state.
   */
  readonly marketState: Observable<MarketState> = this.store
    .doc<MarketState>(DocumentName.MarketState)
    .valueChanges()

  /**
   * Returns the observable of the currency model for the given currency.
   * @param currencyPair The currency pair to get the model for.
   */
  getCurrency(currencyPair: string): Observable<Currency> {
    const [isDirectRate, currencyName] = parseCurrencyPair(currencyPair)

    return this.store.collection(CollectionName.Currencies)
      .doc<Currency>(currencyName)
      .valueChanges()
      .pipe(map(currency => ({
        ask: isDirectRate ? currency.ask : 1 / currency.bid,
        bid: isDirectRate ? currency.bid : 1 / currency.ask,
      })))
  }

  /**
   * Returns the observable of the list of currency pair prices for the given interval.
   * @param currencyPair The currency pair to get the prices for.
   * @param interval The interval to get the prices for.
   */
  getCurrencyHistory(currencyPair: string, interval: PriceInterval): Observable<TransformDate<CurrencyPrice>[]> {
    const [isDirectRate, currencyName] = parseCurrencyPair(currencyPair)

    return this.store.collection(CollectionName.Currencies)
      .doc(currencyName)
      .collection<CurrencyPrice>(`${CollectionName.PriceHistory}-${interval}`)
      .valueChanges()
      .pipe(map(history => history.map(entry => ({
        time: entry.time.toDate(),
        open: isDirectRate ? entry.open : 1 / entry.open,
        high: isDirectRate ? entry.high : 1 / entry.low,
        low: isDirectRate ? entry.low : 1 / entry.high,
        close: isDirectRate ? entry.close : 1 / entry.close,
      }))))
  }
}