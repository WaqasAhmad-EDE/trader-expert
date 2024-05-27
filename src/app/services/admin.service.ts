import { Injectable } from "@angular/core"
import { AngularFireFunctions } from "@angular/fire/compat/functions"
import { Observable } from "rxjs"
@Injectable({
  providedIn: "root",
})
export class AdminService {
  private readonly _enableUser: (data: { userId: string }) => Observable<void>
  private readonly _disableUser: (data: { userId: string }) => Observable<void>
  private readonly _notificationTest: (data: { userId: string }) => Observable<void>
  private readonly _setFcmToken: (data: { token: string }) => Observable<void>

  constructor(private readonly functions: AngularFireFunctions) {
    this._enableUser = this.functions.httpsCallable<{ userId: string }>("enableUser")
    this._disableUser = this.functions.httpsCallable<{ userId: string }>("disableUser")
    this._notificationTest = this.functions.httpsCallable<{ userId: string }>("testNotification")
    this._setFcmToken = this.functions.httpsCallable<{ token: string | undefined }>("setFcmToken")
  }

  enableUser(userId: string): Promise<void> {
    return this._enableUser({ userId }).toPromise()
  }

  disableUser(userId: string): Promise<void> {
    return this._disableUser({ userId }).toPromise()
  }

  notificationTest(userId: string): Promise<void> {
    return this._notificationTest({ userId }).toPromise()
  }

  sendAiHelpernotifications(tokens, content): Promise<void> {
    const aiHelperNotifications = this.functions.httpsCallable('aiHelperNotifications');
    return aiHelperNotifications({ data: { tokens: tokens, content: content } }).toPromise()
  }


  setFcmToken(token: string | undefined): Promise<void> {
    console.log("AdminService | setFcmToken:", token)
    return this._setFcmToken({ token }).toPromise()
  }
}
