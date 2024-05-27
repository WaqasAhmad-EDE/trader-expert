import { Component, OnInit } from "@angular/core"
import { NavController } from "@ionic/angular"
import { UserService } from "src/app/services"

@Component({
  selector: "app-initialize",
  templateUrl: "./initialize.page.html",
  styleUrls: ["./initialize.page.scss"],
})
export class InitializePage implements OnInit {
  constructor(
    private readonly userService: UserService,
    private readonly navController: NavController,
  ) { }

  async ngOnInit() {
    const user = await this.userService.getUser()

    if (!user) {
      // wtf
      void this.navController.navigateRoot("/admin")
      return
    }

    if (user.isAdmin) {
      void this.navController.navigateRoot("/admin/users")
    } else {
      void this.navController.navigateRoot("/loggedin")
    }
  }
}
