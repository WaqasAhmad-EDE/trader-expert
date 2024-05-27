import { Component } from "@angular/core"
import { AdminService, NotificationService, UserService } from "../services"
import { AiHelperService } from "../services/ai-helper.service"

@Component({
  selector: "app-tabs",
  templateUrl: "tabs.page.html",
  styleUrls: ["tabs.page.scss"],
})
export class TabsPage {
  clickCounter = 0

  notificationCount = 2
  constructor(
    private readonly adminService: AdminService,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
    public aiHelperService: AiHelperService,

  ) { }
  public async tabsClick() {
    //console.log("tabsClick", this.clickCounter)
    if (this.clickCounter === 0) {
      setTimeout(() => {
        this.clickCounter = 0
      }, 5000)
    }
    this.clickCounter++

    if (this.clickCounter === 10) {
      try {
        const user = await this.userService.getUser()
        await this.adminService.notificationTest(user.id)
        await this.notificationService.showToastMessage("Test notification sent", "success")
      } catch (error) {
       //console.log("ERROR", error.message)
        await this.notificationService.showToastMessage(error.message, "danger")
      }
      //console.log("testNotification")
      this.clickCounter = 0
    }
  }
}
