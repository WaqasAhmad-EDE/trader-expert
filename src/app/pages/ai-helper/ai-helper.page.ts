import { Component, OnInit, } from '@angular/core';
import { AiHelperService } from '../../services/ai-helper.service';

@Component({
  selector: 'app-ai-helper',
  templateUrl: './ai-helper.page.html',
  styleUrls: ['./ai-helper.page.scss'],
})
export class AiHelperPage implements OnInit {

  constructor(
    public aiHelperService: AiHelperService,

  ) { }

  lastRead = 0
  ngOnInit() {
    this.aiHelperService.UpdateStatus.subscribe(s => {
      if (s) {
        if (this.justEntered) {
          this.justEntered = false
        }
        else {
          this.lastRead = this.aiHelperService.unreads || 0;

        }
        this.aiHelperService.UpdateStatus.next(false)
      }
    })
  }


  justEntered = false;

  ionViewWillEnter() {
    this.justEntered = true
    this.updateNotificationUI()
  }

  ionViewWillLeave() {
    this.aiHelperService.clearNotifications()
  }


  updateNotificationUI() {
    setTimeout(() => {
      this.aiHelperService.clearNotifications()
    }, 1000);
  }
}
