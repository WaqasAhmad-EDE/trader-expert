import { Component, OnInit, ViewChild } from "@angular/core"
import { AngularFireAuth } from "@angular/fire/compat/auth"
import { AngularFirestore } from "@angular/fire/compat/firestore"
import { ModalController, NavController } from "@ionic/angular"
import { AdminService, NotificationService, UserService } from "../../../../services"

@Component({
  selector: 'app-confirm-del-account',
  templateUrl: './confirm-del-account.component.html',
  styleUrls: ['./confirm-del-account.component.scss'],
})
export class ConfirmDelAccountComponent implements OnInit {
  rootPage: any

  uid: string = ""
  displayName: string = ""
  placeholderPhotoUrl = "/assets/custom-ion-icons/ic_avatar.svg"
  photoURL: string = this.placeholderPhotoUrl

  confirmPassword = ""
  savedPassword = null;

  constructor(
    private fireAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private modalController: ModalController,
    private readonly adminService: AdminService,
    private readonly notificationService: NotificationService,
    private readonly userService: UserService,
    private navCtrl: NavController,
  ) {
    this.savedPassword = JSON.parse(localStorage.getItem('loggedinUser') as string)?.password || null
  }
  async ngOnInit() {
    await this.fireAuth.user.subscribe(user => {
      this.uid = user.uid
      this.firestore
        .collection("users")
        .doc(user.uid)
        .valueChanges()
        .subscribe(async res => {
          await this.updateProfile()
        })
    })
  }

  async updateProfile() {
    this.fireAuth.user.subscribe(user => {
      this.uid = user.uid
      this.displayName = user.displayName
      this.photoURL = user.photoURL || this.placeholderPhotoUrl
    })
  }

  async logout() {
    await this.modalController.dismiss()
    await this.rootPage.dismiss()
    await this.navCtrl.navigateRoot("admin")
    await this.userService.logout()
  }

  async deleteAccount() {
    await this.adminService.disableUser(this.uid)

    this.notificationService.showToastMessage("Account Deleted", "success")
    await this.logout()
  }
}
