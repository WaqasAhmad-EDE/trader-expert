import { ActiveOrder, ClosedOrder, Currency, OrderType } from "./models"
import { currencyRoundPrecisions, marketCurrency } from "./constants"

export function calculateOrderProfitRatio(order: ActiveOrder & Partial<ClosedOrder>, currency: Currency) {
  if (order.closePrice) {
    if (order.type === OrderType.Buy) {
      return order.closePrice / order.openPrice - 1
    } else {
      return order.openPrice / order.closePrice - 1
    }
  }

  if (order.type === OrderType.Buy) {
    // For example, we bought at 1.2 and now the price is 1.3, so the profit ratio is 1.3 / 1.2 - 1 = 0.083
    return currency.bid / order.openPrice - 1
  } else {
    // For example, we sold at 1.2 and now the price is 1.3, so the profit ratio is 1.2 / 1.3 - 1 = -0.076
    return order.openPrice / currency.ask - 1
  }
}

export function calculateOrderProfit(order: ActiveOrder, currency: Currency) {
  return calculateOrderProfitRatio(order, currency) * order.amount * order.leverage
}

/**
 * Closes the order using the provided currency price.
 * @param order The order to close.
 * @param currency The currency price. MUST ALWAYS BE THE DIRECT RATE.
 * @param reason The reason why the order was closed.
 */
export function closeOrder(order: ActiveOrder, currency: Currency, reason: string): ClosedOrder {
  const profit = calculateOrderProfit(order, currency)

  return {
    ...order,
    closePrice: order.type === OrderType.Buy ? currency.bid : currency.ask,
    closeDate: new Date() as any,
    profit,
    reason,
  } as ClosedOrder
}

/**
 * Parses the currency pair in format "USD-CUR" or "CUR-USD" to the tuple of the boolean flag indicating
 * whether the currency has the direct rate and the name of the currency.
 * @param pair The currency pair.
 */
export function parseCurrencyPair(pair: string): [isDirectRate: boolean, currencyName: string] {
  const parts = pair.split("-")
  return parts[0] === marketCurrency ? [true, parts[1]] : [false, parts[0]]
}

/**
 * Extracts the name of the currency from the given currency pair.
 * @param pair The currency pair.
 */
export function extractCurrencyName(pair: string): string {
  return parseCurrencyPair(pair)[1]
}

/**
 * Determines whether the currency has the direct rate in the given currency pair.
 * @param pair The currency pair.
 */
export function isDirectRate(pair: string): boolean {
  return parseCurrencyPair(pair)[0]
}

/**
 * Resolves the real price rate of the currency based on the currency pair.
 * @param currency The currency to resolve.
 * @param pair The currency pair.
 */
export function resolvePairPrice(currency: Currency, pair: string): Currency {
  return isDirectRate(pair) ? currency : {
    ask: 1 / currency.bid,
    bid: 1 / currency.ask,
  }
}

export function formatFixedPrice(price: number, currencyPair?: string): string {
  return price.toFixed(currencyPair ? currencyRoundPrecisions[currencyPair] ?? 3 : 3)
}

/**
 * Determines whether the order should be force closed. (when the total is less than 1% of the order amount)
 * @param order The order to check.
 * @param currency The currency price. MUST ALWAYS BE THE DIRECT RATE.
 */
export function shouldBeForceClosed(order: ActiveOrder, currency: Currency): boolean {
  const profit = calculateOrderProfit(order, currency)

  return order.amount + profit < order.amount * 0.01
}
