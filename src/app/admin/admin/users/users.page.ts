import { Component, OnInit, ViewChild } from "@angular/core"
import { AngularFireAuth } from "@angular/fire/compat/auth"
import { AngularFirestore } from "@angular/fire/compat/firestore"
import { AlertController, IonButton, IonModal, LoadingController, NavController, Platform, ToastController } from "@ionic/angular"
import { App } from "@capacitor/app"
import { AdminService, NotificationService } from "src/app/services"
import { AngularFireStorage } from "@angular/fire/compat/storage"

@Component({
  selector: "app-users",
  templateUrl: "./users.page.html",
  styleUrls: ["./users.page.scss"],
})
export class UsersPage implements OnInit {
  @ViewChild("modal") modal: IonModal
  @ViewChild("modalVideo") modalVideo: IonModal
  users = []
  backalert = false
  modalState = false

  backSub: any
  new_user_amount = null
  new_user_email = ""
  check = false

  apikeyicon = "key-outline"
  apiKey = ""
  segment = "user-list"
  videoList:any[] = []


  constructor(
    private readonly fs: AngularFirestore,
    private readonly fauth: AngularFireAuth,
    private readonly navCtrl: NavController,
    private readonly platform: Platform,
    public readonly alertController: AlertController,
    private readonly toastController: ToastController,
    private readonly notificationService: NotificationService,
    private readonly adminService: AdminService,
    private readonly fireStorage: AngularFireStorage,
    private readonly loadingCtrl: LoadingController

  ) {
    this.backSub = this.platform.backButton.subscribeWithPriority(1000000000, async () => {
      // if(this.modal.canDismiss){
      // }
      if (this.modalState) {
        this.modalState = false
        this.modal.dismiss()
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

  ngOnInit() {

    this.getrecords()
    // this.getVideoLinks()

    this.getVideos()
  }


  getVideoLinks() {
    this.fireStorage.ref('Videos').listAll().toPromise().then(res => {
      res?.items.map(f => {
        f.getDownloadURL().then(link => {
          this.videoList.push(link)
        })
      })
    })
  }


  getVideos() {
    this.fs
      .collection("Videos")
      .get()
      .toPromise()
      .then(res => {
        this.videoList = []
        res?.forEach(r => {
          const rs = r.data() as any;
          rs['id'] = r.id;
          this.videoList.push(rs)
        })

      })

  }




  selectedVideo: FileList | null
  titleValue: string
  onChangeVideoSelect(event) {
    this.selectedVideo = event.target.files[0]
  }

  async showLoading(message?) {
    const loading = await this.loadingCtrl.create({
      message: message || 'Upload in progress 0%.',
    });

    loading.present();
    return loading
  }




  async uploadVideo(data) {
    const timeStamp = new Date().getTime().toString()
    const loading = await this.showLoading()
    this.fireStorage
      .upload("Videos/" + timeStamp, this.selectedVideo)
      .percentageChanges()
      .subscribe(async percent => {
        if (percent) {
          loading.message = 'Upload in progress ' + Math.trunc(percent) + " %."
        }
        if (percent == 100) {
          loading.message = 'Verifying Upload.'
          await this.fireStorage
            .ref("Videos/" + timeStamp)
            .getDownloadURL()
            .subscribe(async videoLink => {
              await this.fs.collection("Videos").doc(timeStamp).set(
                {
                  title: data.title.value,
                  subtitle: data.subtitle.value,
                  desp: data.desp.value,
                  link: videoLink
                }
              )
              this.getVideos()
              this.modalVideo.dismiss()
              this.loadingCtrl.dismiss()
            })
        }
      })


  }


  getrecords() {
    this.fs
      .collection("users")
      .get()
      .toPromise()
      .then(res => {
        this.users = []
        res?.forEach(r => {
          this.users.push(r.data())
        })
      })
  }

  createUser() {
    var newuserpassword = Math.random().toString(36).slice(-8)

    let { email, password } = JSON.parse(localStorage.getItem("loggedinUser"))

    this.check = true
    this.fauth
      .createUserWithEmailAndPassword(this.new_user_email, newuserpassword)
      .then(res => {
        void this.notificationService.showToastMessage("Creating user", "success")
        res?.user.updateProfile({ displayName: "New User", photoURL: "" })
        this.fauth.sendPasswordResetEmail(res.user.email).then(() => { })
        this.fs
          .collection("users")
          .doc(res.user.uid.toString())
          .set({
            uid: res?.user.uid,
            displayName: "New User",
            photoURL: "",
            disabled: false,
            email: res?.user.email,
            balance: this.new_user_amount,
            created_at: new Date(Date.now()),
          })
          .then(() => {
            this.fauth.signOut().then(() => {
              void this.notificationService.showToastMessage("User created successfully", "success")
              this.fauth.signInWithEmailAndPassword(email, password).then(res => {
                this.modal.dismiss()
                this.check = false
                this.getrecords()
              })
            })
          })
      })
      .catch(err => {
        this.fauth.signInWithEmailAndPassword(email, password)
        void this.notificationService.showToastMessage("User already exist", "danger")
        this.check = false
      })
  }

  logout() {
    this.fauth.signOut()
    localStorage.clear();
    void this.notificationService.showToastMessage("Logged out", "dark")
    this.navCtrl.navigateRoot("admin")
  }

  ngOnDestroy() {
    this.backSub.unsubscribe()
  }

  apiKeyChangeInput() {
    if (this.apikeyicon == "key-outline") {
      this.apikeyicon = "close"
      return
    }
    this.apikeyicon = "key-outline"
  }

  changeApiKey() {
    this.fs.collection("app_details").doc("exchangeRateKey").update({
      key: this.apiKey,
    })
    this.apikeyicon = "key-outline"
  }

  async presentAlert(user) {
    const alert = await this.alertController.create({
      header: "Deposit amount to user",
      message: user.email,
      cssClass: "alertInput",
      buttons: [
        {
          text: "Cancel",
          handler: () => { },
        },
        {
          text: "Deposit",
          handler: async inputdata => {
            if (parseFloat(inputdata.amount) > 0 && parseFloat(inputdata.amount) < 99999) {
              this.fs
                .collection("users")
                .doc(user.uid)
                .get()
                .toPromise()
                .then(res => {
                  let currA = parseFloat(res.data()["balance"])
                  currA = parseFloat((currA + parseFloat(inputdata.amount)).toFixed(2))
                  this.fs.collection("users").doc(user.uid).update({
                    balance: currA,
                  })
                  this.fs
                    .collection("users")
                    .doc(user.uid.toString())
                    .collection("balanceHistory")
                    .add({
                      time: new Date(),
                      balance: currA,
                    })
                    .then(async () => {
                      this.getrecords()
                      await this.toastController.create({
                        message: "Amount Deposit Successfull",
                        color: "success",
                        duration: 3000,
                        position: "bottom",
                      })
                    })
                })
            } else {
              await this.toastController.create({
                message: "Invalid Input",
                color: "danger",
                duration: 3000,
                position: "bottom",
              })
            }
          },
        },
      ],
      inputs: [
        {
          name: "amount",
          type: "number",
          placeholder: "Amount",
          min: 1,
          max: 99999,
        },
      ],
    })

    await alert.present()
  }

  async toggleUserState(event, user) {
    try {
      if (event.target.checked) {
        await this.adminService.enableUser(user.uid.toString())
      } else {
        await this.adminService.disableUser(user.uid.toString())
      }
    } catch (e) {
      event.target.checked = !event.target.checked

      void this.notificationService.showToastMessage("Something went wrong", "danger")
    }
  }

  editVideo = null

  async deleteVideo(editVideo) {


    const loading = await this.showLoading('Deleting Video')
    loading.present()
    await this.fs.collection("Videos").doc(editVideo.id).delete()
    this.videoList = this.videoList.filter(f => f['id'] != editVideo.id)
    loading.dismiss()
    this.modalVideo.dismiss()


  }

  opendialogModal() {

    if (this.segment == 'user-list') {
      this.modal.present()
    }
    else if (this.segment == 'video-list') {
      this.modalVideo.present()
    }
  }

  async sendCloudMessage(messageTitle, messageBody, modalMessage, sendCloudMessageButton: IonButton) {
    sendCloudMessageButton.disabled = true
    //console.log(messageTitle, messageBody);
    const timeStamp = new Date().getTime()
    const content = {
      title: messageTitle?.value,
      body: messageBody?.value,
      timeStamp: timeStamp,
    }
    const loader = await this.loadingCtrl.create({
      message: 'Sending Notification...'
    });
    loader.present()

    this.fs.collection("Notifications").doc(timeStamp.toString()).set(
      content
    )
      .then(res => {
        modalMessage?.dismiss()
        loader.dismiss()
        this.notificationService.showToastMessage('Notification sent.', 'success')
        this.sendAIHelperNotification(content)
      })
      .catch(error => {
        //console.log(error);
        loader.dismiss()
        this.notificationService.showToastMessage('Something went wrong.', 'danger')
      })
  }


  sendAIHelperNotification(content) {
    const tokens: any = []
    this.users?.forEach((f: any) => {
      if (!f?.['isAdmin']) {
        f?.['notificationTokens']?.forEach((element: any) => {
          tokens.push(element)
        });
      }
    })
    console.log(tokens);
    this.adminService.sendAiHelpernotifications(tokens, content).then(res => {
      console.log(res);
    })
  }
}
