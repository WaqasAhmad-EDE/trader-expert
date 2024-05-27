import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { RouteReuseStrategy } from "@angular/router"

import { IonicModule, IonicRouteStrategy } from "@ionic/angular"

import { AppRoutingModule } from "./app-routing.module"
import { AppComponent } from "./app.component"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { HttpClientModule } from "@angular/common/http"

import { AngularFireModule } from "@angular/fire/compat"
import { AngularFireAuthModule } from "@angular/fire/compat/auth"
import { AngularFirestoreModule } from "@angular/fire/compat/firestore"
import { IgxFinancialChartModule, IgxLegendModule } from "igniteui-angular-charts"
import { AngularFireMessagingModule } from "@angular/fire/compat/messaging"
import { FirebaseOptions } from "@angular/fire/app"

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyAs8e3b1lrZIb1p_yZ9yKulLmXkL80LpFo",
  authDomain: "traderexpert-dcaed.firebaseapp.com",
  projectId: "traderexpert-dcaed",
  storageBucket: "traderexpert-dcaed.appspot.com",
  messagingSenderId: "981750507523",
  appId: "1:981750507523:web:c14045747053057d9ac636",
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, IonicModule.forRoot(), AppRoutingModule, BrowserAnimationsModule,
    HttpClientModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireMessagingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    IgxFinancialChartModule,
    IgxLegendModule,
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
