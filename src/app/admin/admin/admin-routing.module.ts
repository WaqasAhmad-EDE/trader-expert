import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"

import { AdminPage } from "./admin.page"
import { AdminGuard } from "../../gaurds/admin/admin.guard"

const routes: Routes = [
  {
    path: "",
    component: AdminPage,
  },
  {
    path: "users",
    loadChildren: () => import("./users/users.module").then(m => m.UsersPageModule),
    canActivate: [AdminGuard]
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPageRoutingModule {}
