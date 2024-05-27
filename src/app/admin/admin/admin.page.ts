import { Component } from '@angular/core'
import { NavController } from '@ionic/angular'
import { NotificationService, UserService } from 'src/app/services'

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage {

  passwordVisibleStatus = false;
  passwordIconPath = '';
  passwordType = 'password';
  email = '';
  password = '';
  disableButton = false;
  resetPasswordMail = '';

  private passwordIconPathShow = '/assets/custom-ion-icons/ic_password_show.svg';
  private passwordIconPathHide = '/assets/custom-ion-icons/ic_password_hide.svg';

  constructor(
      private readonly navController: NavController,
      private readonly userService: UserService,
      private readonly notificationService: NotificationService,
  ) {
    this.passwordIconPath = this.passwordIconPathHide
  }

  showHidePassword() {
    if (this.passwordVisibleStatus) {
      this.passwordVisibleStatus = false
      this.passwordType = 'password'
      this.passwordIconPath = this.passwordIconPathHide
      return
    }
    this.passwordVisibleStatus = true
    this.passwordType = 'text'
    this.passwordIconPath = this.passwordIconPathShow
  }

  async loginAsAdmin() {
    this.disableButton = true

    try {
      const user = await this.userService.signIn(this.email.trim(), this.password.trim())

      if (user?.isAdmin) {
        void this.navController.navigateRoot('/admin/users')
        void this.notificationService.showToastMessage('Login as admin', 'success')
      } else {
        void this.navController.navigateRoot('/')
        void this.notificationService.showToastMessage('Login successful', 'success')
      }
    } catch (error) {    
      const errorMessage = error.toString().split('auth/')[1].split(').')[0]?.trim() ?? error.toString()
      void this.notificationService.showToastMessage(errorMessage?.toUpperCase(), 'danger')

      this.disableButton = false
    }
  }

  async sendResetMail(resetpassword?) {
    try {
      await this.userService.resetPassword(this.resetPasswordMail.trim());
      this.resetPasswordMail = ''
      resetpassword?.dismiss();
      void this.notificationService.showToastMessage('Email sent', 'success')
    } catch (error) {
      void this.notificationService.showToastMessage('Invalid Email', 'danger')
    }
  }
}
