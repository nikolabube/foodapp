/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 foodies app
  Created : 28-Feb-2021
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { Injectable } from '@angular/core';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  public cart: any[] = [];
  public itemId: any[] = [];
  public totalPrice: any = 0;
  public grandTotal: any = 0;
  public coupon: any;
  public discount: any = 0;
  public orderTax: any = 0;
  public orderPrice: any;
  public shipping: any;
  public shippingPrice: any = 0;
  public minOrderPrice: any = 0;
  public freeShipping: any = 0;
  public datetime: any;
  public deliveryAddress: any;
  public deliveryPrice: any = 0;
  public stores: any[] = [];
  public totalItem: any;
  public bulkOrder: any[] = [];
  public flatTax: any;
  public cartStoreInfo: any;
  public orderNotes: any;
  public invoice_id: any;
  public d_date: any;
  public d_time: any;

  constructor(
    public util: UtilService
  ) {
    this.util.getCouponObservable().subscribe(data => {
      if (data) {
        console.log('------------->>', data);
        this.coupon = data;
        this.coupon.discount = parseFloat(data.discount);
        this.coupon.min = parseFloat(data.min);
        this.calcuate();
      }
    });
    this.util.getKeys('userCart').then((data: any) => {
      console.log('first???', data);
      if (data && data !== null && data !== 'null') {
        const userCart = JSON.parse(data);
        if (userCart && userCart.length > 0) {
          this.cart = userCart;
          this.itemId = [...new Set(this.cart.map(item => item.id))];
          this.calcuate();
          console.log('0???', data);
        } else {
          console.log('1???', data);
          this.calcuate();
        }
      } else {
        console.log('2???', data);
        this.calcuate();
      }
    });
  }

  clearCart() {
    this.cart = [];
    this.itemId = [];
    this.totalPrice = 0;
    this.grandTotal = 0;
    this.coupon = undefined;
    this.discount = 0;
    this.orderPrice = 0;
    this.datetime = undefined;
    this.stores = [];
    this.util.clearKeys('cart');
    this.totalItem = 0;
    this.calcuate();
  }

  addVariations(info, cart, type) {
    if (type === 'new') {
      console.log('-->> new--->>', info, cart);
      // info['d_date'] = this.d_date;
      // info['d_time'] = this.d_time;
      this.cart.push(info);
      this.itemId.push(info.id);
    } else if (type === 'sameChoice') {
      const index = this.cart.findIndex(x => x.id === info.id);
      console.log('index--', index);
      this.cart[index].selectedItem = info.selectedItem;
    } else if (type === 'newCustom') {
      const index = this.cart.findIndex(x => x.id === info.id);
      console.log('index--', index);
      this.cart[index].selectedItem = info.selectedItem;
      this.cart[index].quantiy = info.quantiy;
    }

    this.calcuate();
  }

  addItem(item) {
    console.log('item to adde', item);
    // item['d_date'] = this.d_date;
    // item['d_time'] = this.d_time;
    this.cart.push(item);
    this.itemId.push(item.id);
    this.calcuate();
  }

  addQuantity(quantity, id) {
    console.log('iddd-->>', id);
    console.log('quantity', quantity);
    this.cart.forEach(element => {
      if (element.id === id) {
        element.quantiy = quantity;
      }
    });
    this.calcuate();
  }

  removeItem(id) {
    console.log('remove this item from cart');
    console.log('current cart items', this.cart);
    this.cart = this.cart.filter(x => x.id !== id);
    this.itemId = this.itemId.filter(x => x !== id);

    console.log('====>>>>>>>>>', this.cart);
    console.log('items====>>>', this.itemId);
    this.calcuate();
  }

  repeatOrder(order) {
    this.cart = order;
    this.itemId = [...new Set(this.cart.map(item => item.id))];
    this.calcuate();
  }

  async calcuate() {
    console.log('CART=======>', this.cart);
    // new
    const item = this.cart.filter(x => x.quantiy > 0);
    this.cart.forEach(element => {
      if (element.quantiy === 0) {
        element.selectedItem = [];
      }
    });
    this.totalPrice = 0;
    this.totalItem = 0;
    this.cart = [];
    item.forEach(element => {
      console.log('itemsss----->>>', element);
      if (element && element.selectedItem && element.selectedItem.length > 0 && element.size === '1') {
        let subPrice = 0;
        element.selectedItem.forEach(subItems => {
          subItems.item.forEach(realsItems => {
            subPrice = subPrice + (realsItems.value);
          });
          subPrice = subPrice * subItems.total;
          this.totalItem = this.totalItem + subItems.total;
        });
        this.totalPrice = this.totalPrice + subPrice;
      } else if (element && element.selectedItem && element.selectedItem.length > 0 && element.size === '0') {
        let subPrice = 0;
        element.selectedItem.forEach(subItems => {
          subPrice = 0;
          subItems.item.forEach(realsItems => {
            subPrice = subPrice + (realsItems.value);
          });
          subPrice = subPrice * subItems.total;
          this.totalItem = this.totalItem + subItems.total;
          this.totalPrice = this.totalPrice + subPrice;
        });
      } else {
        this.totalItem = this.totalItem + element.quantiy;
        this.totalPrice = this.totalPrice + (parseFloat(element.price) * parseInt(element.quantiy));
      }
      this.cart.push(element);
    });
    localStorage.removeItem('userCart');
    localStorage.setItem('userCart', JSON.stringify(this.cart));
    this.util.clearKeys('userCart');
    this.util.setKeys('userCart', JSON.stringify(this.cart));
    this.totalPrice = parseFloat(this.totalPrice).toFixed(2);

    const appTax = this.util.general && this.util.general.tax ? parseFloat(this.util.general.tax) : 21;
    if (this.util.tax_enabled) {
      const tax = (parseFloat(this.totalPrice) * appTax) / 100;
      this.orderTax = tax.toFixed(2);
    }

    let distance;
    if (this.deliveryAddress && this.deliveryAddress.address && this.cartStoreInfo && this.cartStoreInfo.address) {
      distance = await this.distanceInKmBetweenEarthCoordinates(this.deliveryAddress.lat, this.deliveryAddress.lng,
        this.cartStoreInfo.lat, this.cartStoreInfo.lng);
    } else {
      distance = 0;
    }

    if (this.util.delivery_enabled) {
      if (this.freeShipping > this.totalPrice) {
        if (this.shipping === 'km') {
          const distancePricer = distance * this.shippingPrice;
          this.deliveryPrice = Math.floor(distancePricer).toFixed(2);
        } else {
          this.deliveryPrice = this.shippingPrice;
        }

        if (distance == 0) {
          this.deliveryPrice = 0;
        }
      } else {
        this.deliveryPrice = 0;
      }
    }

    this.grandTotal = parseFloat(this.totalPrice) + parseFloat(this.orderTax) + parseFloat(this.deliveryPrice);
    this.grandTotal = this.grandTotal.toFixed(2);
    if (this.coupon && this.coupon.code && this.totalPrice >= parseFloat(this.coupon.min)) {
      if (this.coupon.type === 'per') {
        function percentage(num, per) {
          return (num / 100) * per;
        }
        const totalPrice = percentage(parseFloat(this.totalPrice).toFixed(2), this.coupon.discount);
        this.discount = totalPrice.toFixed(2);
        this.grandTotal = parseFloat(this.totalPrice) + parseFloat(this.orderTax) + parseFloat(this.deliveryPrice);
        this.grandTotal = this.grandTotal - this.discount;
        this.grandTotal = this.grandTotal.toFixed(2);
      } else {
        this.discount = this.coupon.discount;
        this.grandTotal = parseFloat(this.totalPrice) + parseFloat(this.orderTax) + parseFloat(this.deliveryPrice);
        this.grandTotal = this.grandTotal - this.discount;
        this.grandTotal = this.grandTotal.toFixed(2);
      }
    } else {
      this.coupon = null;
      localStorage.removeItem('coupon');
    }
    if (this.totalItem === 0) {
      const lng = localStorage.getItem('language');
      const selectedCity = localStorage.getItem('selectedCity');
      localStorage.setItem('language', lng);
      localStorage.setItem('selectedCity', selectedCity);
      this.totalItem = 0;
      this.totalPrice = 0;
    }
  }



  checkProductInCart(id) {
    return this.itemId.includes(id);
  }

  degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
  }

  distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
    console.log(lat1, lon1, lat2, lon2);
    const earthRadiusKm = 6371;

    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLon = this.degreesToRadians(lon2 - lon1);

    lat1 = this.degreesToRadians(lat1);
    lat2 = this.degreesToRadians(lat2);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
  }
}
