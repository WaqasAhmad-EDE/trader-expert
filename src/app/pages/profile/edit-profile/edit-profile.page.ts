import { Component, OnInit, Optional, ViewChild } from "@angular/core"
import { AngularFireAuth } from "@angular/fire/compat/auth"
import { AngularFirestore } from "@angular/fire/compat/firestore"
import { AdminService, NotificationService, UserService } from "../../../services"
import { IonRouterOutlet, ModalController, NavController, ToastController } from "@ionic/angular"
import { ContactPage } from "../contact/contact.page"
import { AngularFireStorage } from "@angular/fire/compat/storage"
// import { ConfirmDeleteAccountPage } from "./confirm-delete-account/confirm-delete-account.page"
import { ConfirmDelAccountComponent } from "./confirm-del-account/confirm-del-account.component"

@Component({
  selector: "app-edit-profile",
  templateUrl: "./edit-profile.page.html",
  styleUrls: ["./edit-profile.page.scss"],
})
export class EditProfilePage implements OnInit {
  uid = ""
  displayName = ""
  newDisplayImage = ""
  placeholderPhotoUrl = "/assets/custom-ion-icons/ic_avatar.svg"
  photoURL = this.placeholderPhotoUrl

  constructor(
    private fireAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private fireStorage: AngularFireStorage,
    private userService: UserService,
    private readonly adminService: AdminService,
    private readonly notificationService: NotificationService,
    private navCtrl: NavController,
    private modalController: ModalController,
    @Optional() private readonly routerOutlet?: IonRouterOutlet,
  ) { }

  async ngOnInit() {
    //console.log((await this.fireAuth.currentUser)?.metadata);
    await this.fireAuth.user.subscribe(async user => {
      this.uid = user.uid
      await this.firestore
        .collection("users")
        .doc(user.uid)
        .valueChanges()
        .subscribe(async res => {
          await this.updateProfile()
        })
    })
  }

  async updateProfile() {
    await this.fireAuth.user.subscribe(user => {
      this.displayName = user.displayName
      this.photoURL = user.photoURL || this.placeholderPhotoUrl
      this.uid = user.uid
    })
  }

  async onChangedDisplayName() {
    await this.fireAuth.user.subscribe(async user => {
      await user.updateProfile({ displayName: this.displayName })
      await this.firestore.collection("users").doc(this.uid).update({ displayName: this.displayName })

      const toast = await new ToastController().create({
        message: "Your username has just been updated",
        duration: 2000,
        position: "top",
      })
      await toast.present()
    })
  }

  async onChangeDisplayImage(event) {
    this.newDisplayImage = event.target.files[0]

    this.fireStorage
      .upload("ProfilePictures/" + this.uid, this.newDisplayImage)
      .percentageChanges()
      .subscribe(async user => {
        if (user == 100) {
          await this.fireStorage
            .ref("ProfilePictures/" + this.uid)
            .getDownloadURL()
            .subscribe(logoLink => {
              this.photoURL = logoLink
              this.newDisplayImage = null
              this.fireAuth.user.subscribe(async res => {
                await res.updateProfile({ photoURL: logoLink })
                await this.firestore.collection("users").doc(this.uid).update({ photoURL: logoLink })

                const toast = await new ToastController().create({
                  message: "Your avatar has just been updated",
                  duration: 2000,
                  position: "top",
                })
                await toast.present()
              })
            })
        }
      })
  }

  async onContact() {
    await this.modalController.dismiss()
    const contactModal = await this.modalController.create({
      presentingElement: this.routerOutlet == null ? await this.modalController.getTop() : this.routerOutlet.nativeEl,
      component: ContactPage,
      canDismiss: true,
      mode: "ios",
      initialBreakpoint: 0.25,
      breakpoints: [0, 0.25, 0.95],
    })

    await contactModal.present()
  }

  async onDeleteAccount() {
    const confirmDeleteAccount = await this.modalController.create({
      presentingElement: this.routerOutlet == null ? await this.modalController.getTop() : this.routerOutlet.nativeEl,
      component: ConfirmDelAccountComponent,
      canDismiss: true,
      mode: "ios",
      componentProps: {
        rootPage: this.modalController,
      },
    })

    await confirmDeleteAccount.present()
  }

  async logout() {
    localStorage.clear();
    await this.modalController.dismiss()
    await this.navCtrl.navigateRoot("admin")
    await this.userService.logout()
  }
}
