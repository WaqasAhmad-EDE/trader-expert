import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing"
import { IonicModule } from "@ionic/angular"

import { InitializePage } from "./initialize.page"

describe("InitializePage", () => {
  let component: InitializePage
  let fixture: ComponentFixture<InitializePage>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [InitializePage],
      imports: [IonicModule.forRoot()],
    }).compileComponents()

    fixture = TestBed.createComponent(InitializePage)
    component = fixture.componentInstance
    fixture.detectChanges()
  }))

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
