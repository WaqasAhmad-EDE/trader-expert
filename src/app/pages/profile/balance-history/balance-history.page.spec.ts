import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing"
import { IonicModule } from "@ionic/angular"

import { BalanceHistoryPage } from "./balance-history.page"

describe("BalanceHistoryPage", () => {
  let component: BalanceHistoryPage
  let fixture: ComponentFixture<BalanceHistoryPage>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BalanceHistoryPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents()

    fixture = TestBed.createComponent(BalanceHistoryPage)
    component = fixture.componentInstance
    fixture.detectChanges()
  }))

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
