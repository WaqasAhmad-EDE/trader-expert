import { Timestamp } from "@firebase/firestore"

// Single document: /market/state
export interface MarketState {
  readonly updateTime: Timestamp
  readonly open: boolean
}

// Single document: /market/info
export interface MarketInfo {
  readonly currencyPairs: string[]
}

// Single document: /app/contact
export interface Contact {
  readonly email: string
  readonly phone: string
}

// The currency model containing the current currency price updated every second
// Collection: /currencies
export interface Currency {
  readonly ask: number
  readonly bid: number
}

export const enum PriceInterval {
  OneMinute = "1m",
  FiveMinutes = "5m",
  FifteenMinutes = "15m",
  ThirtyMinutes = "30m",
  OneHour = "1h",
  OneDay = "1d",
}

// The entry in the price history
// Each price is the average of the ask and bid
//
// Collection: /currencies/{currency}/history-{interval}
export interface CurrencyPrice {
  readonly time: Timestamp

  readonly open: number
  readonly high: number
  readonly low: number
  readonly close: number
}

export const enum UserStatus {
  Active = "active",
  Disabled = "disabled",
}

// Collection: /users
export interface User {
  readonly status: UserStatus
  readonly balance: number
  readonly isAdmin: boolean
  readonly notificationTokens?: string[]
}

// Collection: /balanceHistory
export interface UserBalance {
  readonly time: Timestamp
  readonly balance: number
}

export const enum OrderType {
  Buy = "buy",
  Sell = "sell",
}

// Collection: /users/{userId}/activeOrders
export interface ActiveOrder {
  readonly currencyPair: string
  readonly type: OrderType

  // The amount of USD spent on the order
  readonly amount: number

  // The multiplier representing the leverage of the order
  readonly leverage: number

  readonly openPrice: number
  readonly openDate: Timestamp

  readonly stopLossTarget?: number
  readonly takeProfitTarget?: number
}

// Collection: /users/{userId}/closedOrders
export interface ClosedOrder extends ActiveOrder {
  readonly closePrice: number
  readonly closeDate: Timestamp

  readonly profit: number

  readonly reason: string
}

// The container for the entity data and its identifier
export interface Document<T> {
  readonly id: string
  readonly data: T
}

// The entity data with the identifier attached
export type WithId<T> = T & { id: string }

export type GenericOrder = WithId<ActiveOrder> & Partial<ClosedOrder> & { active: boolean }

export type TransformDate<T> = {
  [K in keyof T]: T[K] extends Timestamp ? Date : T[K]
}
