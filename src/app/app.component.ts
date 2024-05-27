import { Component, ViewChild } from "@angular/core"
import { Router } from "@angular/router"
import { AlertController, IonRouterOutlet, ModalController, NavController, Platform } from "@ionic/angular"
import { App } from "@capacitor/app"
import { SplashScreen } from "@capacitor/splash-screen"
import { AiHelperService } from "./services/ai-helper.service"

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  @ViewChild(IonRouterOutlet, { static: true }) routerOutlet: IonRouterOutlet
  backalert = false

  constructor(
    private platform: Platform,
    public router: Router,
    private navCtrl: NavController,
    public alertController: AlertController,
    public modalController: ModalController,
  ) {
    this.platform.backButton.subscribeWithPriority(10000000, async () => {
      if (this.router.url === "/loggedin/profile" || this.router.url === "/loggedin/trade") {
        await this.navCtrl.navigateRoot("/loggedin/market")
        return
      }
      // if(this.router.url == '/admin'){
      //   App.exitApp()
      //   return
      // }
      if(await this.modalController.getTop()){
        this.modalController.dismiss()
      }
      else if (this.routerOutlet.canGoBack()) {
        this.navCtrl.back()
      } else {
        if (this.backalert) {
          this.alertController.dismiss()
          this.backalert = false
          return
        }
        this.backalert = true
        const alert = await this.alertController.create({
          cssClass: "my-custom-class",
          header: "Confirm!",
          message: "Do you want to exit app",
          buttons: [
            {
              text: "No",
              role: "cancel",
              cssClass: "secondary",
              id: "cancel-button",
              handler: blah => {
                this.backalert = false
                //
              },
            },
            {
              text: "Yes",
              id: "confirm-button",
              handler: () => {
                //
                App.exitApp()
              },
            },
          ],
        })
        await alert.present()
      }
    })
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (this.platform.is("hybrid")) {
        SplashScreen.hide()
      }
    })
  }
}
