import { Injectable } from "@angular/core"
import { Observable } from "rxjs"
import { Contact, DocumentName } from "./../../../shared"
import { AngularFirestore } from "@angular/fire/compat/firestore"

@Injectable({
  providedIn: "root",
})
export class AppService {
  constructor(private readonly store: AngularFirestore) {}

  readonly contact: Observable<Contact> = this.store
    .doc<Contact>(DocumentName.AppContact)
    .valueChanges()
}