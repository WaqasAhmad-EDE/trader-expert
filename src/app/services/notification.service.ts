import { Injectable } from "@angular/core"
import { ToastController } from "@ionic/angular"

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  constructor(private readonly toastController: ToastController) {}

  async showToastMessage(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: color,
    })

    void toast.present()
  }
}