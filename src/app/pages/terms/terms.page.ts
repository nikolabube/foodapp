import { ModalController } from '@ionic/angular';
import { ApisService } from './../../services/apis.service';
import { UtilService } from 'src/app/services/util.service';
import { Component, OnInit, ApplicationRef } from '@angular/core';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.page.html',
  styleUrls: ['./terms.page.scss'],
})
export class TermsPage implements OnInit {

  content: any;
  loaded: boolean;

  constructor(
    public util: UtilService,
    private api: ApisService,
    private modalCtrl: ModalController,
    private applicationRef: ApplicationRef
  ) { }

  ngOnInit() {
    this.content = this.util.general.tos;

    const lng = localStorage.getItem('language');
    if (!lng || lng === null) {
      this.api.get('users/getDefaultSettings').then((data: any) => {
        if (data && data.status === 200 && data.data) {
          const general = data.data.general;
          console.log('general ===>', general);
          if (general && general.length > 0) {
            const info = general[0];
            this.util.general = info;
            this.content = this.util.general.tos;
          }
        }
        this.loaded = true;
        this.applicationRef.tick();
      }, error => {
        console.log('default settings', error);
      });
    } else {
      const param = {
        id: localStorage.getItem('language')
      };
      this.api.post('users/getDefaultSettingsById', param).then((data: any) => {
        if (data && data.status === 200 && data.data) {
          const general = data.data.general;
          console.log('general =====>', general)
          if (general && general.length > 0) {
            const info = general[0];
            this.util.general = info;
            this.content = this.util.general.tos;
          }
        }
        this.loaded = true;
        this.applicationRef.tick();
      }, error => {
        console.log('default settings by id', error);
      });
    }
  }

  getContent() {
    return this.content;
  }

  accept() {
    const uid = localStorage.getItem('uid');
    if (uid) {
      const param = {
        id: uid,
        accept_term: "yes"
      };
      this.api.post_private('users/edit_profile', param).then((data: any) => {
        console.log('user info=>', data);
        this.util.userInfo.accept_term = "yes";
        localStorage.setItem('lg_user', JSON.stringify(this.util.userInfo));
        this.modalCtrl.dismiss();
      }, error => {
        console.log(error);
      });
    } else {
      localStorage.setItem('accept_term', "yes");
      this.modalCtrl.dismiss();
    }
  }

}
