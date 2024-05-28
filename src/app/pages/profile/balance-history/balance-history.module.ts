import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
// import { IgxFinancialChartModule } from "igniteui-angular-charts"

import { IonicModule } from "@ionic/angular"

import { BalanceHistoryPageRoutingModule } from "./balance-history-routing.module"

import { BalanceHistoryPage } from "./balance-history.page"

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BalanceHistoryPageRoutingModule,
    // IgxFinancialChartModule,
  ],
  declarations: [BalanceHistoryPage],
})
export class BalanceHistoryPageModule {}
