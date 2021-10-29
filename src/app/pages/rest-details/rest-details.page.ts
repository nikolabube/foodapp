import { VariationsPage } from './../variations/variations.page';
import { element } from 'protractor';
import { NavController, ModalController } from '@ionic/angular';
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
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';
import * as moment from 'moment';
@Component({
  selector: 'app-rest-details',
  templateUrl: './rest-details.page.html',
  styleUrls: ['./rest-details.page.scss'],
})
export class RestDetailsPage implements OnInit {

  slideOpts = {
    slidesPerView: 2.3,
  };
  id: any;
  name: any;
  descritions: any;
  cover: any = '';
  address: any;
  ratting: any;
  time: any;
  totalRatting: any;
  dishPrice: any;
  cusine: any[] = [];
  foods: any[] = [];
  dummyFoods: any[] = [];
  categories: any[] = [];
  dummy = Array(50);
  veg: boolean = true;
  totalItem: any = 0;
  totalPrice: any = 0;
  deliveryAddress: any = '';
  images: any[] = [];
  isOpen: boolean = false;
  open: any;
  close: any;
  email: any;
  phone: any;
  banners = [];
  storeData: any;

  constructor(
    private route: ActivatedRoute,
    public api: ApisService,
    public util: UtilService,
    public cart: CartService,
    private navCtrl: NavController,
    private router: Router,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(data => {
      console.log('data=>', data);
      if (data.hasOwnProperty('id')) {
        this.id = data.id;
        this.getVenueDetails();
      }
    });
  }

  getVenueDetails() {
    const body = {
      id: this.id
    };

    this.api.post('stores/getByUid', body).then((datas: any) => {
      console.log(datas);
      if (datas && datas.status === 200 && datas.data.length > 0) {
        const data = datas.data[0];
        this.storeData = data;
        if (data) {
          this.name = data.name;
          this.descritions = data.descriptions;
          this.cover = data.cover;
          this.address = data.address;
          this.ratting = data.rating ? data.rating : 0;
          this.totalRatting = data.total_rating ? data.total_rating : 0;
          this.dishPrice = data.dish;
          this.time = data.time;
          if (data.cusine && data.cusine !== '') {
            this.cusine = JSON.parse(data.cusine);
          } else {
            this.cusine = [];
          }
          this.images = JSON.parse(data.images);
          this.open = moment('10-10-2020 ' + data.open_time).format('LT');
          this.close = moment('10-10-2020 ' + data.close_time).format('LT');
          this.phone = data.mobile;
          const format = 'HH:mm:ss';

          const currentTime = moment().format(format);
          console.log(currentTime);
          const time = moment(currentTime, format);
          const beforeTime = moment(data.open_time, format);
          const afterTime = moment(data.close_time, format);

          if (time.isBetween(beforeTime, afterTime)) {
            console.log('is between');
            this.isOpen = true;
          } else {
            this.isOpen = false;
            console.log('is not between');
          }
          this.getBanners();
        }
      }
    }, error => {
      console.log(error);
      this.util.errorToast(this.util.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
      this.util.errorToast(this.util.translate('Something went wrong'));
    });
  }

  getBanners() {
    const body = {
      store_id: this.storeData.uid
    };

    this.api.post('banners/getRestBanners', body).then((data: any) => {
      console.log('getRestBanners-->>', data);
      if (data && data.status === 200 && data.data && data.data.length) {
        this.banners = [];
        data.data.forEach(element => {
          console.log(element);
          // if (element.value == this.storeData.id) {
          //   this.banners.push(element);
          // }
          const { banner_id, banner, value, type, message, banner_status, banner_extra_field, qty, store_id, ...others } = element;
          var temp = others;
          temp['selectedItem'] = [];
          temp['quantiy'] = 0;
          temp.variations = JSON.parse(temp.variations);
          element['prod_detail'] = others;
          this.banners.push(element);
        });
      }
      console.log('banners detail -->>', this.banners);
    }).catch((error: any) => {
      console.log('error=>', error);
    });
  }

  add(prod) {
    if (!this.cart.d_date || !this.cart.d_time) {
      this.util.showWarningAlert('Please select delivery date and time');
      this.navCtrl.pop();
      return;
    }
    const uid = localStorage.getItem('uid');
    console.log('uid', localStorage.getItem('uid'));
    if (uid && uid != null && uid !== 'null') {
      if (this.cart.cart.length === 0) {
        console.log('cart is empty');
        if (prod.variations && prod.variations.length) {
          console.log('open modal');
          this.openVariations(prod);
        } else {
          prod.quantiy = 1;
          this.cart.addItem(prod);
          this.router.navigate(['tabs/tab3']);
        }
      } else {
        console.log('cart is full');
        const restIds = this.cart.cart.filter(x => x.restId === this.storeData.uid);
        console.log(restIds);
        if (restIds && restIds.length > 0) {
          if (prod.variations && prod.variations.length) {
            console.log('open modal');
            this.openVariations(prod);
          } else {
            prod.quantiy = 1;
            this.cart.addItem(prod);
            this.router.navigate(['tabs/tab3']);
          }
        }
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  async openVariations(prod) {
    const modal = await this.modalCtrl.create({
      component: VariationsPage,
      cssClass: 'custom_modal2',
      componentProps: {
        name: this.name,
        food: prod
      }
    });
    modal.onDidDismiss().then((data) => {
      console.log('from variations', data.data);
      console.log('data.data', data.role);
      let isValid = false;
      if (data.role === 'new') {
        prod.quantiy = 1;
        const carts = {
          item: data.data,
          total: 1
        };
        prod.selectedItem.push(carts);
        console.log('id===>?>>', prod.id);
        this.cart.addVariations(prod, carts, data.role);
        isValid = true;
      } else if (data.role === 'sameChoice') {
        prod.selectedItem = data.data;
        console.log('length=>', prod.selectedItem);
        prod.quantiy = prod.selectedItem.length;
        if (prod.quantiy === 0) {
          prod.quantiy = 0;
          this.cart.removeItem(prod.id);
        } else {
          this.cart.addVariations(prod, 'carts', data.role);
          isValid = true;
        }
      } else if (data.role === 'newCustom') {
        const carts = {
          item: data.data,
          total: 1
        };
        prod.selectedItem.push(carts);
        prod.quantiy = prod.quantiy + 1;
        this.cart.addVariations(prod, carts, data.role);
        isValid = true;
      } else if (data.role === 'remove') {
        console.log('number', data.data);
        prod.quantiy = 0;
        prod.selectedItem = [];
        isValid = true;
      } else if (data.role === 'dismissed') {
        console.log('dismissed');
        prod.quantiy = 1;
        const carts = {
          item: data.data,
          total: 1
        };
        prod.selectedItem.push(carts);
        console.log('id===>?>>', prod.id);
        this.cart.addVariations(prod, carts, 'new');
        isValid = true;
      }
      if (isValid) {
        console.log('isValid', isValid);
        this.cart.calcuate();
        this.router.navigate(['tabs/tab3']);
      }
    });
    return await modal.present();
  }

}
