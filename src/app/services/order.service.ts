import { Injectable } from "@angular/core"
import { AngularFirestore } from "@angular/fire/compat/firestore"
import { increment } from "@angular/fire/firestore"
import { map, switchMap } from "rxjs/operators"
import { ActiveOrder, ClosedOrder, closeOrder, CollectionName, Currency, GenericOrder, OrderType, User, UserBalance, WithId } from "./../../../shared"
import { Observable } from "rxjs"
import { UserService } from "./user.service"
import { ToastController } from "@ionic/angular"

@Injectable({
  providedIn: "root",
})
export class OrderService {
  constructor(
    private readonly userService: UserService,
    private readonly store: AngularFirestore,
    private readonly toastController: ToastController,
  ) {}

  /**
   * Observable of the list of active orders for the current user.
   */
  readonly activeOrders: Observable<WithId<ActiveOrder>[]> = this.userService.user.pipe(
    switchMap(user =>
      this.store.collection(CollectionName.Users).doc(user.id).collection<ActiveOrder>(CollectionName.ActiveOrders).valueChanges({ idField: "id" }),
    ),
    map(orders => orders.sort((a, b) => a.openDate.toMillis() - b.openDate.toMillis())),
  )

  /**
   * Observable of the list of closed orders for the current user.
   */
  readonly closedOrders: Observable<WithId<ClosedOrder>[]> = this.userService.user.pipe(
    switchMap(user =>
      this.store.collection(CollectionName.Users).doc(user.id).collection<ClosedOrder>(CollectionName.ClosedOrders).valueChanges({ idField: "id" }),
    ),
    map(orders => orders.sort((a, b) => b.closeDate.toMillis() - a.closeDate.toMillis())),
  )

  /**
   * Observable of the list of balance history entries for the currency user.
   */
  readonly balanceHistory: Observable<UserBalance[]> = this.userService.user.pipe(
    switchMap(user =>
      this.store.collection<User>(CollectionName.Users).doc(user?.id).collection<UserBalance>(CollectionName.BalanceHistory).valueChanges(),
    ),
    map(history => history.sort((a, b) => a.time.toMillis() - b.time.toMillis())),
  )

  /**
   * The observable of the user's balance.
   */
  readonly balance: Observable<number> = this.userService.user.pipe(map(user => user.balance))

  /**
   * Gets the order with the given id from active or closed orders.
   * @param id The id of the order to get.
   * @param active Whether the order is active or not.
   */
  getOrder(id: string, active: boolean): Observable<GenericOrder> {
    const collection = active ? this.activeOrders : this.closedOrders

    return collection.pipe(
      map(orders => orders.find(order => order.id === id)),
      map(order => ({ ...order, active })),
    )
  }

  /**
   * Opens a new order for the current user.
   * @param order The data of the order to open.
   */
  public async openOrder(order: ActiveOrder): Promise<void> {
    const user = await this.userService.getUser()

    // 1. Create a new document in the active orders collection
    await this.store.collection(CollectionName.Users).doc(user.id).collection<ActiveOrder>(CollectionName.ActiveOrders).add(order)

    const toast = await this.toastController.create({
      message : 'Order created.',
      color : 'success',
      duration: 2000
    });
    toast.present();

    const newBalance = user.balance - order.amount
    // 2. Update the user's balance
    await this.store.collection(CollectionName.Users).doc(user.id).update({ balance: newBalance })

    // 3. Add balance history entry
    await this.store
      .collection(CollectionName.Users)
      .doc(user.id)
      .collection<UserBalance>(CollectionName.BalanceHistory)
      .add({ time: new Date() as any, balance: newBalance })
  }

  /**
   * Close an order for the current user.
   * @param order The order to close.
   * @param currency The model containing the current price of the currency.
   */
  public async closeOrder(order: WithId<ActiveOrder>, currency: Currency): Promise<void> {
    const closedOrder = closeOrder(order, currency, "INITIATIVE_FROM_USER")
    delete (closedOrder as WithId<ClosedOrder>).id // lol

    const user = await this.userService.getUser()

    // 1. Delete the order from the active orders collection
    await this.store.collection(CollectionName.Users).doc(user.id).collection<ActiveOrder>(CollectionName.ActiveOrders).doc(order.id).delete()

    // 2. Add the order to the closed orders collection
    await this.store.collection(CollectionName.Users).doc(user.id).collection<ClosedOrder>(CollectionName.ClosedOrders).add(closedOrder)

    // 3. Update the user's balance
    await this.store
      .collection(CollectionName.Users)
      .doc(user.id)
      .update({ balance: increment(closedOrder.amount + closedOrder.profit) })

    // 4. Add balance history entry
    await this.store
      .collection(CollectionName.Users)
      .doc(user.id)
      .collection<UserBalance>(CollectionName.BalanceHistory)
      .add({ time: new Date() as any, balance: user.balance + closedOrder.amount + closedOrder.profit })
  }

  /**
   * Edits the order stop loss and take profit targets.
   * @param orderId The id of the order to edit.
   * @param stopLossTarget The new stop loss target.
   * @param takeProfitTarget The new take profit target.
   * @returns Whether the operation was successful or not.
   */
  public async editOrder(orderId: string, stopLossTarget: number | undefined, takeProfitTarget: number | undefined): Promise<boolean> {
    const user = await this.userService.getUser()

    try {
      await this.store
        .collection(CollectionName.Users)
        .doc(user.id)
        .collection<ActiveOrder>(CollectionName.ActiveOrders)
        .doc(orderId)
        .update({ stopLossTarget, takeProfitTarget })
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }
}
