import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Subject } from 'rxjs';
import { UserService } from './user.service';


@Injectable({
  providedIn: 'root'
})
export class AiHelperService {

  public allNotifications: any[] = [];
  unreads = 0;
  UpdateStatus: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor(
    private readonly store: AngularFirestore,
    private readonly fireAuth: AngularFireAuth,

  ) {



    // Just to add a value in last read in firebase user doc

    this.allNotifications = []





    this.getOldNotifications().then(async on => {

      const cUser = this.fireAuth.user.subscribe(user => {
        //console.log(user?.metadata?.['lastLoginAt']);



        this.allNotifications = on
        const lastUpadted = on[0]?.timeStamp || 0;
        this.getMessagesFromFirebase(lastUpadted).then(async res => {
          const completeNotifications = await this.getMessagesCountFromFirebase()
          const newNotifications = res.docs.map(f => f.data())
          this.unreads = newNotifications.length || 0
          if (lastUpadted == 0) {
            this.unreads = newNotifications.filter((f: any) => f?.timeStamp > parseInt(user?.metadata?.['lastLoginAt'])).length
          }
          const Tempunreads = parseInt(localStorage.getItem('unreads') as string) || 0
          if (Tempunreads) {
            this.unreads = Tempunreads
          }
          this.UpdateStatus.next(true)
          localStorage.setItem('unreads', this.unreads.toString());
          this.allNotifications = newNotifications.concat(this.allNotifications)
          this.allNotifications = (completeNotifications.docs.map(m => m.data()));
          if (this.allNotifications.length) {
            localStorage.setItem('notifications', JSON.stringify(this.allNotifications))
          }

          (completeNotifications.docs.map(m => m.data()))
          console.log(this.allNotifications , completeNotifications.docs.map(m => m.data()));
          
        })
          .finally(() => {
            this.listenLive()
          })
      })
    })
  }



  getMessagesFromFirebase(lastUpadted) {
    // return this.store.collection('Notifications', ref => ref.where('timeStamp', (lastUpadted != '0' ? '<' : '>'), lastUpadted).orderBy('timeStamp', 'asc')).get().toPromise()
    return this.store.collection('Notifications', ref => ref.where('timeStamp', '>', lastUpadted).orderBy('timeStamp', 'desc')).get().toPromise()
  }
  getMessagesCountFromFirebase() {
    return this.store.collection('Notifications', ref => ref.orderBy('timeStamp', 'desc')).get().toPromise()
  }


  getOldNotifications() {
    return new Promise<any[]>((resolve, reject) => {
      try {
        this.unreads = parseInt(localStorage.getItem('unreads') as string) || 0
        this.UpdateStatus.next(true)
        const oldNotifications = JSON.parse(localStorage.getItem('notifications') as string) || []
        resolve(oldNotifications);

      } catch (error) {
        resolve([]);
      }
    })
  }

  clearNotifications() {
    this.unreads = 0
    this.UpdateStatus.next(true)
    localStorage.setItem('unreads', '0');
  }


  listenLive() {
    const lastUpadted = (new Date()).getTime();
    const listenser = this.store.collection('Notifications', ref => ref.where('timeStamp', '>', lastUpadted).orderBy('timeStamp', 'desc')).snapshotChanges().subscribe(res => {
      if (res.length) {
        const prev = parseInt(localStorage.getItem('unreads') as string) || 0
        res.map(r => r.payload.doc.data()).forEach((element: any) => {
          if (this.allNotifications.filter(f => f.timeStamp == element.timeStamp).length == 0) {
            this.allNotifications.unshift(element)
            this.unreads = res.length + prev
            this.UpdateStatus.next(true)
          }
        })
        // this.allNotifications = res.map(r => r.payload.doc.data()).concat(this.allNotifications);
        localStorage.setItem('unreads', this.unreads.toString());
        localStorage.setItem('notifications', JSON.stringify(this.allNotifications))
        listenser.unsubscribe();
        this.listenLive();
      }
    })
  }


}
