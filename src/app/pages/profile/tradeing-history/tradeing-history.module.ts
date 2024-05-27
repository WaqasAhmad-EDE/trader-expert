import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { IonicModule } from "@ionic/angular"
import { TradeingHistoryPageRoutingModule } from "./tradeing-history-routing.module"
import { TradeingHistoryPage } from "./tradeing-history.page"

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, TradeingHistoryPageRoutingModule],
  declarations: [TradeingHistoryPage],
})
export class TradeingHistoryPageModule {}
