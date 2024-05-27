import { PriceInterval } from "./models"

export const marketCurrency = "USD"

export const enum CollectionName {
  AutoCloseOrders = "autoCloseOrders",

  Currencies = "currencies",
  PriceHistory = "history",

  Users = "users",
  ActiveOrders = "activeOrders",
  ClosedOrders = "closedOrders",
  BalanceHistory = "balanceHistory",
}

export const enum DocumentName {
  MarketState = "market/state",
  MarketInfo = "market/info",
  AppContact = "app/contact",
}

// The number of price history entries (candles) to keep in the database for each interval
export const priceHistorySizes: Record<PriceInterval, number> = {
  [PriceInterval.OneMinute]: 100,
  [PriceInterval.FiveMinutes]: 100,
  [PriceInterval.FifteenMinutes]: 100,
  [PriceInterval.ThirtyMinutes]: 100,
  [PriceInterval.OneHour]: 100,
  [PriceInterval.OneDay]: 15,
}

export const intervals: PriceInterval[] = [
  PriceInterval.OneMinute,
  PriceInterval.FiveMinutes,
  PriceInterval.FifteenMinutes,
  PriceInterval.ThirtyMinutes,
  PriceInterval.OneHour,
  PriceInterval.OneDay,
]

export const intervalMilliseconds: Record<PriceInterval, number> = {
  [PriceInterval.OneMinute]: 60 * 1000,
  [PriceInterval.FiveMinutes]: 60 * 5 * 1000,
  [PriceInterval.FifteenMinutes]: 60 * 15 * 1000,
  [PriceInterval.ThirtyMinutes]: 60 * 30 * 1000,
  [PriceInterval.OneHour]: 60 * 60 * 1000,
  [PriceInterval.OneDay]: 60 * 60 * 24 * 1000,
}

export const currencyRoundPrecisions: Record<string, number> = {
  "EUR-USD": 5,
  "USD-JPY": 3,
  "GBP-USD": 5,
  "AUD-USD": 5,
  "USD-CAD": 5,
  "USD-CNY": 4,
  "USD-CHF": 5,
}