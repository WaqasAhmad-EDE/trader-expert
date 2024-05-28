import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

import { IonicModule } from "@ionic/angular"

import { TradePageRoutingModule } from "./trade-routing.module"

import { TradePage } from "./trade.page"
import { ChartComponent } from "./chart/chart.component"
import { HttpClientModule } from "@angular/common/http"
// import { IgxFinancialChartModule, IgxLegendModule } from "igniteui-angular-charts"
// import { IgxAvatarModule, IgxTooltipModule } from "igniteui-angular"

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TradePageRoutingModule,
    HttpClientModule,
    // IgxFinancialChartModule,
    // IgxLegendModule,
    // IgxAvatarModule,
    // IgxTooltipModule,
    HttpClientModule
  ],
  declarations: [TradePage, ChartComponent],
  providers: [],
})
export class TradePageModule { }
