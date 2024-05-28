import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.page.html',
  styleUrls: ['./videos.page.scss'],
})
export class VideosPage implements OnInit {
  videoList: any;

  constructor(
    private readonly fireStorage: AngularFireStorage,
    private readonly fs: AngularFirestore,
    private readonly fauth: AngularFireAuth,
  ) { }

  ngOnInit() {
    this.getVideos()
  }

  
  getVideoLinks() {
    this.fireStorage.ref('Videos').listAll().toPromise().then(res => {
      res?.items.map(f => {
        f.getDownloadURL().then(link => {
          this.videoList.push(link)
        })
      })
    })
  }


  getVideos() {
    this.fs
      .collection("Videos")
      .get()
      .toPromise()
      .then(res => {
        this.videoList = []
        res?.forEach(r => {
          this.videoList.push(r.data())
        })
      })

  }

}
