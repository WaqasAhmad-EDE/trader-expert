import { Component, OnInit, Optional, ViewChild } from "@angular/core"
import { AngularFireAuth } from "@angular/fire/compat/auth"
import { AngularFirestore } from "@angular/fire/compat/firestore"
import { AngularFireStorage } from "@angular/fire/compat/storage"
import { Router } from "@angular/router"
import { AlertController, IonRouterOutlet, ModalController, NavController, Platform } from "@ionic/angular"
import { App } from "@capacitor/app"
import { AdminService, formatFixedPrice, NotificationService, OrderService } from "src/app/services"
import { EditProfilePage } from "./edit-profile/edit-profile.page"
import { OrderDetailsPage } from "../trade/order-details/order-details.page"

@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"],
})
export class ProfilePage implements OnInit {
  uid = ""
  displayName = "User"
  placeholderPhotoUrl = "./../../../assets/custom-ion-icons/ic_avatar.svg"
  photoURL = this.placeholderPhotoUrl
  balance = null

  newDisplayName = ""
  newDisplayImage: any = null
  backalert = false

  segment = "balance-history"

  balanceHistory = this.orderDataService.balanceHistory
  closedOrders = this.orderDataService.closedOrders

  constructor(
    private fireAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private fireStorage: AngularFireStorage,
    private navCtrl: NavController,
    private platform: Platform,
    public router: Router,
    public alertController: AlertController,
    private modalController: ModalController,
    private readonly notificationService: NotificationService,
    private readonly adminService: AdminService,
    private readonly orderDataService: OrderService,
    @Optional() private readonly routerOutlet?: IonRouterOutlet,
  ) {
    this.segment = "balance-history"

    this.platform.backButton.subscribeWithPriority(10000000, async () => {
      if (this.router.url == "/loggedin/trade" || this.router.url == "/loggedin/profile") {
        return this.navCtrl.navigateRoot("/loggedin/market")
      }

      if (this.router.url != "/loggedin/market") {
        return this.navCtrl.back()
      }

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
    })
  }

  async ngOnInit() {
    this.fireAuth.user.subscribe(user => {
      this.uid = user.uid

      this.firestore
        .collection("users")
        .doc(user.uid)
        .valueChanges()
        .subscribe((fsUser: any) => {
          this.updateProfileData()
          this.balance = fsUser.balance.toFixed(3)
        })
    })
  }

  logout() {
    this.fireAuth.signOut()
    localStorage.clear();
    this.navCtrl.navigateRoot("admin")
  }

  changeDisplayImage(e) {
    this.newDisplayImage = e.target.files[0]
  }

  async updateProfileData() {
    this.fireAuth.user.subscribe(user => {
      this.uid = user.uid
      this.displayName = user.displayName
      this.photoURL = user.photoURL || this.placeholderPhotoUrl
    })
  }

  async onEditProfile() {
    const editProfileModal = await this.modalController.create({
      presentingElement: this.routerOutlet.nativeEl,
      component: EditProfilePage,
      canDismiss: true,
      mode: "ios",
    })

    await editProfileModal.present()
  }

  async onOrderDetails(id: string) {
    const modalView = await this.modalController.create({
      component: OrderDetailsPage,
      canDismiss: true,
      mode: "ios",
      initialBreakpoint: 0.75,
      breakpoints: [0, 0.75, 0.95],
      componentProps: {
        id,
        active: false,
      },
    })

    await modalView.present()
  }

  protected readonly formatFixedPrice = formatFixedPrice
}
