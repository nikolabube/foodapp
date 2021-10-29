import { ApisService } from 'src/app/services/apis.service';
import { CartService } from 'src/app/services/cart.service';
import { ModalController } from '@ionic/angular';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UtilService } from './../../services/util.service';

import format from 'date-fns/format';
import * as moment from 'moment';

@Component({
  selector: 'app-set-datetime',
  templateUrl: './set-datetime.page.html',
  styleUrls: ['./set-datetime.page.scss'],
})
export class SetDatetimePage implements OnInit {

  date: any;
  time: any;
  dates: any[] = [];
  times: any[] = [];
  temp_times = [
    { time: '11:00 a 11:30', start: '11:00:00', enable: false },
    { time: '11:31 a 12:00', start: '11:31:00', enable: false },
    { time: '12:01 a 12:30', start: '12:01:00', enable: false },
    { time: '12:31 a 13:00', start: '12:31:00', enable: false },
    { time: '13:01 a 13:30', start: '13:01:00', enable: false },
    { time: '13:31 a 14:00', start: '13:31:00', enable: false },
    { time: '14:01 a 16:00', start: '14:01:00', enable: false }
  ]
  weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  c_date: any;
  moment: any;

  constructor(
    public util: UtilService,
    private modalCtrl: ModalController,
    public cartService: CartService,
    private api: ApisService,
    private chMod: ChangeDetectorRef
  ) {
    this.moment = moment;
    this.c_date = moment().format('Y-MM-DD');
    console.log('c_date = ', format(new Date(), 'eee, dd/MM/yyyy'));
  }

  ngOnInit() {
    setTimeout(() => {
      this.geteDates();
    }, 1300);
  }

  geteDates() {
    this.api.externalGet(`${this.api.odoo_api}/as_app_api/order/calendario`).then(data => {
      (data as Array<any>).forEach(element => {
        var c_dd = new Date();
        var can_add: boolean = false;
        if (c_dd.getDate() > 5) {
          if (element < format(new Date(c_dd.getFullYear(), c_dd.getMonth(), c_dd.getDate() - 2), 'yyyy-MM-dd')) {
            can_add = false;
          } else {
            can_add = true;
          }
        } else {
          if (element < format(new Date(c_dd.getFullYear(), c_dd.getMonth(), 1), 'yyyy-MM-dd')) {
            can_add = false;
          } else {
            can_add = true;
          }
        }

        if (can_add) {
          var temp: any;
          var displayDay = this.weekdays[new Date(element + ' 01:00:00').getDay()] + ', ' + format(new Date(element + ' 01:00:00'), 'dd/MM/yyyy');
          if (this.c_date > element) {
            temp = {
              date: element,
              disaplyDay: displayDay,
              enable: false
            }
          } else {
            temp = {
              date: element,
              disaplyDay: displayDay,
              enable: true
            }
          }
          this.dates.push(temp);
        }
        
      });
      console.log('dates == ', this.dates);
      this.chMod.detectChanges();
    }).catch(error => {
      console.error('get date error == ', error);
    })
  }

  changeDate($event) {
    this.times = [];
    this.time = null;
    if (this.date) {
      this.temp_times.forEach(eel => {
        var s_date = `${this.date} ${eel.start}`;
        if (new Date().getTime() > new Date(s_date).getTime()) {
          eel.enable = false
        } else {
          eel.enable = true
        }
        this.times.push(eel)
      });
    }
    this.chMod.detectChanges();
  }

  apply() {
    console.log('date == ', this.date);
    console.log('time == ', this.time);
    // this.cartService.d_date = this.date;
    // this.cartService.d_time = this.time;
    this.modalCtrl.dismiss({ date: this.date, time: this.time }, 'set');
  }

  close() {
    this.modalCtrl.dismiss();
  }

}
