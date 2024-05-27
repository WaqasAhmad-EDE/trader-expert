import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

import { IonicModule } from "@ionic/angular"

import { MarketPageRoutingModule } from "./market-routing.module"

import { MarketPage } from "./market.page"
import { IgxFinancialChartModule, IgxLegendModule } from "igniteui-angular-charts"

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MarketPageRoutingModule,
    IgxFinancialChartModule,
    IgxLegendModule,
  ],
  declarations: [MarketPage],
})
export class MarketPageModule {}
