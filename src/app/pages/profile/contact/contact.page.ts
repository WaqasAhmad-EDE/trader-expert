import { Component, OnInit } from "@angular/core"
import { AppService, Contact } from "src/app/services"

@Component({
  selector: "app-contact",
  templateUrl: "./contact.page.html",
  styleUrls: ["./contact.page.scss"],
})
export class ContactPage implements OnInit {
  contact: Contact = { email: "", phone: "" }

  constructor(private readonly appService: AppService) { }

  ngOnInit() {
    this.appService.contact.subscribe(contact => (this.contact = contact))
  }
}
