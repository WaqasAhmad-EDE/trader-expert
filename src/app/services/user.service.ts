import { Injectable } from "@angular/core"
import { Observable, of } from "rxjs"
import { CollectionName, User, WithId } from "./../../../shared"
import { AngularFireAuth } from "@angular/fire/compat/auth"
import { AngularFirestore } from "@angular/fire/compat/firestore"
import { switchMap, take } from "rxjs/operators"
import { PushNotifications, PushNotificationSchema, Token } from "@capacitor/push-notifications"
import { NotificationService } from "./notification.service"
import { FCM } from "@capacitor-community/fcm"
import { AdminService } from "./admin.service"

@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(
    private readonly auth: AngularFireAuth,
    private readonly store: AngularFirestore,
    private readonly notificationService: NotificationService,
    private readonly adminService: AdminService,
  ) {
    this.setupFcmListeners()
  }

  readonly user: Observable<WithId<User> | null> = this.auth.user.pipe(
    switchMap(user =>
      user ? this.store.collection<User>(CollectionName.Users).doc(user.uid).valueChanges({ idField: "id" }) : of<WithId<User>>(null),
    ),
  )

  getUser(): Promise<WithId<User> | null> {
    return this.user.pipe(take(1)).toPromise()
  }

  async signIn(email: string, password: string): Promise<User> {
    localStorage.clear();
    const { user: firebaseUser } = await this.auth.signInWithEmailAndPassword(email, password)
    const userSnapshot = await this.store.collection<User>(CollectionName.Users).doc(firebaseUser.uid).get().toPromise()
    const user = userSnapshot.data()

    // This is required by the strange mechanism that uses stored credentials
    // to relogin into admin account after user creation (see admin/users)
    // TODO probably this should be refactored
    localStorage.setItem(
      "loggedinUser",
      JSON.stringify({
        email,
        password,
        uid: firebaseUser.uid,
      }),
    )

    await this.setupPushNotifications()
    return user
  }

  /**
   * Requests the permission to send push notifications and registers the device.
   */
  async setupPushNotifications() {
    try {
      let permStatus = await PushNotifications.checkPermissions()

      if (permStatus.receive === "prompt") {
        permStatus = await PushNotifications.requestPermissions()
      }

      if (permStatus.receive !== "granted") {
        throw new Error("User denied permissions!")
      }

      await PushNotifications.register()
    } catch (error) {
      console.error("Failed to setup push notifications", error)
    }
  }

  private setupFcmListeners() {
    PushNotifications.addListener("registration", async (token: Token) => {
      const user = await this.getUser()

      if (user) {
        let notificationTokens = user.notificationTokens ? [...user.notificationTokens, token.value] : [token.value]
        notificationTokens = Array.from(new Set(notificationTokens))
        notificationTokens = notificationTokens.filter(x => x !== undefined && x !== null && x !== "")
        await this.store.collection(CollectionName.Users).doc(user.id).update({ notificationTokens })
      }

      await this.adminService.setFcmToken(token.value)
    })

    PushNotifications.addListener("registrationError", (error: any) => {
      console.error("Failed to setup push notifications", error)
    })

    PushNotifications.addListener("pushNotificationReceived", (notification: PushNotificationSchema) => {
      void this.notificationService.showToastMessage(notification.body, "warning")
    })
  }

  async removeFcmToken() {
    const { token } = await FCM.getToken()
    const user = await this.getUser()

    if (user) {
      const notificationTokens = user?.notificationTokens?.filter(x => x !== token)
      await this.store.collection(CollectionName.Users).doc(user.id).update({ notificationTokens })
    }
    await this.adminService.setFcmToken(undefined)
  }

  async resetPassword(email: string): Promise<void> {
    await this.auth.sendPasswordResetEmail(email)
  }

  async logout() {
    await this.removeFcmToken()
    await this.auth.signOut()
    localStorage.clear();

  }
}
