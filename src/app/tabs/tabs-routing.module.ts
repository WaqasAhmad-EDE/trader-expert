import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { TabsPage } from "./tabs.page"

const routes: Routes = [
  {
    path: "",
    component: TabsPage,
    children: [
      {
        path: "market",
        loadChildren: () => import("../pages/market/market.module").then(m => m.MarketPageModule),
      },
      {
        path: "trade",
        loadChildren: () => import("../pages/trade/trade.module").then(m => m.TradePageModule),
      },
      {
        path: "profile",
        loadChildren: () => import("../pages/profile/profile.module").then(m => m.ProfilePageModule),
      },
      {
        path: 'videos',
        loadChildren: () => import('../pages/videos/videos.module').then( m => m.VideosPageModule)
      },
      {
        path: 'ai-helper',
        loadChildren: () => import('../pages/ai-helper/ai-helper.module').then( m => m.AiHelperPageModule)
      },
      {
        path: "",
        redirectTo: "/loggedin/market",
        pathMatch: "full",
      },
    ],
  },
  {
    path: "",
    redirectTo: "/loggedin/market",
    pathMatch: "full",
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
