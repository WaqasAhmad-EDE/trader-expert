import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing"
import { IonicModule } from "@ionic/angular"
import { ConfirmDeleteAccountPage } from "./confirm-delete-account.page"

describe("ConfirmDeleteAccountPage", () => {
  let component: ConfirmDeleteAccountPage
  let fixture: ComponentFixture<ConfirmDeleteAccountPage>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmDeleteAccountPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents()

    fixture = TestBed.createComponent(ConfirmDeleteAccountPage)
    component = fixture.componentInstance
    fixture.detectChanges()
  }))

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
