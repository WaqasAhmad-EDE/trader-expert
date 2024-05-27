import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing"
import { IonicModule } from "@ionic/angular"

import { TradePage } from "./trade.page"

describe("TradePage", () => {
  let component: TradePage
  let fixture: ComponentFixture<TradePage>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TradePage],
      imports: [IonicModule.forRoot()],
    }).compileComponents()

    fixture = TestBed.createComponent(TradePage)
    component = fixture.componentInstance
    fixture.detectChanges()
  }))

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
