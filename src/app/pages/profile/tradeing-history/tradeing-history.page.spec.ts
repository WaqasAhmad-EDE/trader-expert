import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing"
import { IonicModule } from "@ionic/angular"
import { TradeingHistoryPage } from "./tradeing-history.page"

describe("TradeingHistoryPage", () => {
  let component: TradeingHistoryPage
  let fixture: ComponentFixture<TradeingHistoryPage>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TradeingHistoryPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents()

    fixture = TestBed.createComponent(TradeingHistoryPage)
    component = fixture.componentInstance
    fixture.detectChanges()
  }))

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
