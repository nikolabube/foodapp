import { CartService } from 'src/app/services/cart.service';
/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 foodies app
  Created : 28-Feb-2021
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';
import { Router, NavigationExtras } from '@angular/router';
import * as moment from 'moment';
@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {

  haveItems: boolean = false;
  myOrders: any[] = [];
  dummy = Array(10);

  constructor(
    public api: ApisService,
    public util: UtilService,
    private router: Router,
    private chMod: ChangeDetectorRef,
    private cartService: CartService
  ) {
    this.getMyOrders('', false);
    this.util.subscribeNewOrder().subscribe((data) => {
      this.getMyOrders('', false);
    });
  }

  ngOnInit() {
  }

  doRefresh(event) {
    console.log(event);
    this.getMyOrders(event, true);
  }

  getMyOrders(event, haveRefresh) {
    const param = {
      id: localStorage.getItem('uid')
    };
    this.api.post_private('orders/getByUid', param).then((data: any) => {
      this.dummy = [];
      console.log('orders == ', data);
      if (data && data.status === 200 && data.data.length) {
        this.haveItems = true;
        data.data.forEach(element => {
          element.orders = JSON.parse(element.orders);
        });
        this.myOrders = data.data;
      } else {
        this.haveItems = false;
      }
      this.chMod.detectChanges();
      if (haveRefresh) {
        event.target.complete();
      }

    }, error => {
      console.log(error);
      this.dummy = [];
      this.util.errorToast(this.util.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
      this.dummy = [];
      this.util.errorToast(this.util.translate('Something went wrong'));
    });
  }

  getCart() {
    this.router.navigate(['/tabs']);
  }

  goToHistoryDetail(orderId) {
    const navData: NavigationExtras = {
      queryParams: {
        id: orderId
      }
    };
    this.router.navigate(['/history-detail'], navData);
  }

  getDate(date) {
    return moment(date).format('llll');
  }

  repeatOrder(item) {
    this.cartService.repeatOrder(item.orders);
    this.router.navigate(['tabs/tab3']);
  }
}
