/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 foodies app
  Created : 28-Feb-2021
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';
import { Router, NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { CartService } from 'src/app/services/cart.service';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

  name: any;
  descritions: any;
  cover: any;
  address: any;
  time: any;
  totalRatting: any = 0;
  coupon: any;

  constructor(
    public api: ApisService,
    private router: Router,
    public util: UtilService,
    private navCtrl: NavController,
    private chMod: ChangeDetectorRef,
    public cart: CartService
  ) {
    this.util.getCouponObservable().subscribe(data => {
      if (data) {
        console.log('------------->>', data);
      }
    });
    this.cart.orderNotes = '';
  }

  ngOnInit() {

  }
  ionViewWillEnter() {
    setTimeout(() => {
      if (this.cart.cart.length) {
        this.getVenueDetails();
      }
    }, 1500);

  }

  validate() {
  }

  getVenueDetails() {
    const body = {
      id: this.cart.cart[0].restId
    };
    this.api.post('stores/getByUid', body).then((datas: any) => {
      console.log(datas);
      if (datas && datas.status === 200 && datas.data.length > 0) {
        const data = datas.data[0];
        this.cart.cartStoreInfo = data;
        console.log('data-->>');
        this.name = data.name;
        this.descritions = data.descritions;
        this.cover = data.cover;
        this.address = data.address;
        this.time = data.time;
        this.totalRatting = data.totalRatting;
      }
    }, error => {
      console.log(error);
      this.util.errorToast(this.util.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
      this.util.errorToast(this.util.translate('Something went wrong'));
    });

    this.api.getSettings().then(() => {
      this.cart.calcuate();
    });
  }

  getCart() {
    this.navCtrl.navigateRoot(['tabs/tab1']);
  }

  addQ(index) {
    console.log(this.cart.cart[index]);

    if (this.cart.cart[index].cid == '13' && this.cart.cart[index].quantiy < this.cart.cart[index].stock) {
      this.cart.cart[index].quantiy = this.cart.cart[index].quantiy + 1;
    } else if (this.cart.cart[index].cid != '13') {
      this.cart.cart[index].quantiy = this.cart.cart[index].quantiy + 1;
    }

    this.cart.calcuate();
  }
  removeQ(index) {
    if (this.cart.cart[index].quantiy !== 0) {
      this.cart.cart[index].quantiy = this.cart.cart[index].quantiy - 1;
      if (this.cart.cart[index].quantiy === 0) {
        this.cart.removeItem(this.cart.cart[index].id);
      }
    } else {
      this.cart.cart[index].quantiy = 0;
      if (this.cart.cart[index].quantiy === 0) {
        this.cart.removeItem(this.cart.cart[index].id);
      }
    }
    this.cart.calcuate();
  }



  changeAddress() {
    if (this.cart.totalPrice < this.cart.minOrderPrice) {
      let text;
      if (this.util.cside === 'left') {
        text = this.util.currecny + ' ' + this.cart.minOrderPrice;
      } else {
        text = this.cart.minOrderPrice + ' ' + this.util.currecny;
      }
      this.util.errorToast(this.util.translate('Minimum order amount must be ') + text + this.util.translate(' or more'));
      return false;
    }
    const navData: NavigationExtras = {
      queryParams: {
        from: 'cart'
      }
    };
    this.router.navigate(['choose-address'], navData);
  }
  checkout() {
    if (this.cart.totalPrice < this.cart.minOrderPrice) {
      let text;
      if (this.util.cside === 'left') {
        text = this.util.currecny + ' ' + this.cart.minOrderPrice;
      } else {
        text = this.cart.minOrderPrice + ' ' + this.util.currecny;
      }
      this.util.errorToast(this.util.translate('Minimum order amount must be') + text + this.util.translate('or more'));
      return false;
    }
    const navData: NavigationExtras = {
      queryParams: {
        from: 'cart'
      }
    };
    this.router.navigate(['choose-address'], navData);
    // this.router.navigate(['payments']);
  }
  openCoupon() {
    const navData: NavigationExtras = {
      queryParams: {
        restId: this.cart.cartStoreInfo.id,
        name: this.name,
        totalPrice: this.cart.totalPrice
      }
    };
    this.router.navigate(['coupons'], navData);
  }

  removeQAddos(i, j) {
    console.log(this.cart.cart[i].selectedItem[j]);
    if (this.cart.cart[i].selectedItem[j].total !== 0) {
      this.cart.cart[i].selectedItem[j].total = this.cart.cart[i].selectedItem[j].total - 1;
      if (this.cart.cart[i].selectedItem[j].total === 0) {
        const newCart = [];
        this.cart.cart[i].selectedItem.forEach(element => {
          if (element.total > 0) {
            newCart.push(element);
          }
        });
        console.log('newCart', newCart);
        this.cart.cart[i].selectedItem = newCart;
        this.cart.cart[i].quantiy = newCart.length;
        if (this.cart.cart[i].quantiy === 0) {
          this.cart.removeItem(this.cart.cart[i].id);
        }
      }
    }
    this.cart.calcuate();
  }

  addQAddos(i, j) {
    console.log(this.cart.cart[i].selectedItem[j]);
    if ((this.cart.cart[i].cid == '13' && (this.cart.cart[i].selectedItem[j].total < this.cart.cart[i].stock)) || this.cart.cart[i].cid != '13') {
      this.cart.cart[i].selectedItem[j].total = this.cart.cart[i].selectedItem[j].total + 1;
      this.cart.calcuate();
    }
  }
}
