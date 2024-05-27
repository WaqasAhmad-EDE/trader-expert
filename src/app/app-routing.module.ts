import { NgModule } from "@angular/core"
import { PreloadAllModules, RouterModule, Routes } from "@angular/router"
import { AuthGuard } from "./gaurds/auth.guard"

const routes: Routes = [
  {
    path: "",
    loadChildren: () => import("./pages/initialize/initialize.module").then(m => m.InitializePageModule),
  },
  {
    path: "loggedin",
    loadChildren: () => import("./tabs/tabs.module").then(m => m.TabsPageModule),
    canActivate : [AuthGuard],
  },
  {
    path: "admin",
    loadChildren: () => import("./admin/admin/admin.module").then(m => m.AdminPageModule),
  },
  {
    path: "",
    redirectTo: "/admin",
    pathMatch: "full",
  },
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
