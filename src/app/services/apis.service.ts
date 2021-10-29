import { UtilService } from 'src/app/services/util.service';
import { Platform } from '@ionic/angular';
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
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HTTP } from '@ionic-native/http/ngx';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApisService {
  baseUrl: any = '';
  mediaURL: any = '';
  odoo_api: any = environment.odoo_api;

  constructor(
    private http: HttpClient,
    private nativeHttp: HTTP,
    private platform: Platform,
    private util: UtilService
  ) {
    this.baseUrl = environment.baseURL;
    this.mediaURL = environment.mediaURL;
  }

  translate(str) {
    return str;
  }

  alerts(title, message, type) {
    Swal.fire(
      title,
      message,
      type
    );
  }

  uploadFile(files: File[]) {
    const formData = new FormData();
    Array.from(files).forEach(f => formData.append('userfile', f));
    return this.http.post(this.baseUrl + 'users/upload_image', formData);
  }

  instaPay(url, body, key, token) {
    return this.nativeHttp.post(url, body, {
      'X-Api-Key': `${key}`,
      'X-Auth-Token': `${token}`
    });
  }



  getCurrencyCode() {
    return 'none';
  }

  getCurrecySymbol() {
    return 'none';
  }


  sendNotification(msg, title, id) {
    const body = {
      app_id: environment.onesignal.appId,
      include_player_ids: [id],
      headings: { en: title },
      contents: { en: msg },
      data: { task: msg }
    };
    const header = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Basic ${environment.onesignal.restKey}`)
    };
    return this.http.post('https://onesignal.com/api/v1/notifications', body, header);
  }

  JSON_to_URLEncoded(element, key?, list?) {
    let new_list = list || [];
    if (typeof element === 'object') {
      for (let idx in element) {
        this.JSON_to_URLEncoded(
          element[idx],
          key ? key + '[' + idx + ']' : idx,
          new_list
        );
      }
    } else {
      new_list.push(key + '=' + encodeURIComponent(element));
    }
    return new_list.join('&');
  }

  public post(url, body): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const header = {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Basic', `${environment.authToken}`)
      };
      const param = this.JSON_to_URLEncoded(body);
      console.log(param);
      this.http.post(this.baseUrl + url, param, header).subscribe((data) => {
        resolve(data);
      }, error => {
        reject(error);
      });
      // return this.http.post(this.baseUrl + url, param, header);
    });
  }

  public post_private(url, body): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const header = {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Basic', `${environment.authToken}`)
          .set('Authorization', `Bearer ${localStorage.getItem('token')}`)
      };
      const param = this.JSON_to_URLEncoded(body);
      console.log(param);
      this.http.post(this.baseUrl + url, param, header).subscribe((data) => {
        resolve(data);
      }, error => {
        reject(error);
      });
      // return this.http.post(this.baseUrl + url, param, header);
    });
  }

  public post_token(url, body, token): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const header = {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Basic', `${environment.authToken}`)
          .set('Authorization', `Bearer ${token}`)
      };
      const param = this.JSON_to_URLEncoded(body);
      console.log(param);
      this.http.post(this.baseUrl + url, param, header).subscribe((data) => {
        resolve(data);
      }, error => {
        reject(error);
      });
      // return this.http.post(this.baseUrl + url, param, header);
    });
  }

  public customGet(url, orderId): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const header = {
        // params: new HttpParams().set('order_id', orderId)
        params: {
          order_id: orderId
        }
      };
      const params = {
        order_id: orderId
      }
      if (this.platform.is('hybrid')) {
        this.nativeHttp.setDataSerializer('json');
        return this.nativeHttp.post(url, params, {}).then(result => {
          resolve(JSON.parse(result.data))
        }).catch(error => {
          reject(error)
        })
      } else {
        this.http.post(url, params, {}).subscribe((data) => {
          resolve(data);
        }, error => {
          reject(error);
        });
      }
    })
  }

  public getStocks(url, senddata): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      if (this.platform.is('hybrid')) {
        this.nativeHttp.setDataSerializer('json');
        return this.nativeHttp.post(url, senddata, {}).then(result => {
          resolve(JSON.parse(result.data))
        }).catch(error => {
          reject(error)
        })
      } else {
        this.http.post(url, senddata, {}).subscribe((data) => {
          resolve(data);
        }, error => {
          reject(error);
        });
      }
    })
  }

  public get(url): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const header = {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Basic', `${environment.authToken}`)
      };
      this.http.get(this.baseUrl + url, header).subscribe((data) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  public get_private(url): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const header = {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Basic', `${environment.authToken}`)
          .set('Authorization', `Bearer ${localStorage.getItem('token')}`)
      };
      this.http.get(this.baseUrl + url, header).subscribe((data) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  public externalGet(url): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      if (this.platform.is('hybrid')) {
        this.nativeHttp.setDataSerializer('json');
        return this.nativeHttp.get(url, null, {}).then(result => {
          console.log('externalGet == ', result);
          resolve(JSON.parse(result.data))
        }).catch(error => {
          reject(error)
        })
      } else {
        const header = {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .set('Basic', `${environment.authToken}`)
        };
        this.http.get(url, header).subscribe((data) => {
          resolve(data);
        }, error => {
          reject(error);
        });
      }
    });
  }

  nativePost(url, post) {
    console.log(this.baseUrl + url, post);
    return this.nativeHttp.post(this.baseUrl + url, post, {
      Basic: `${environment.authToken}`
    });
  }

  httpGet(url, key) {
    const header = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Authorization', `Bearer ${key}`)
    };

    return this.http.get(url, header);
  }

  externalPost(url, body, key) {
    const header = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Authorization', `Bearer ${key}`)
    };
    const order = this.JSON_to_URLEncoded(body);
    console.log(order)
    return this.http.post(url, order, header);
  }

  getSettings(): Promise<any> {
    const lng = localStorage.getItem('language');
    return new Promise<any>((resolve, reject) => {
      if (!lng || lng === null) {
        this.get('users/getDefaultSettings').then((data: any) => {
          if (data && data.status === 200 && data.data) {
            const settings = data.data.settings;
            if (settings && settings.length > 0) {
              const info = settings[0];
              this.util.direction = info.appDirection;
              this.util.cside = info.currencySide;
              this.util.currecny = info.currencySymbol;
              this.util.logo = info.logo;
              this.util.twillo = info.twillo;
              this.util.delivery = info.delivery;
              this.util.user_login = info.user_login;
              this.util.home_type = info.home_ui;
              this.util.reset_pwd = info.reset_pwd;
              this.util.tax_enabled = info.tax_enabled && (info.tax_enabled as string).toLowerCase() == 'true' ? true : false;
              this.util.delivery_enabled = info.delivery_enabled && (info.delivery_enabled as string).toLowerCase() == 'true' ? true : false;
              document.documentElement.dir = this.util.direction;
              // this.odoo_api = info.odoo_api ? info.odoo_api : 'http://500.ahorasoft.com:22012/as_app_api/order/create';

            } else {
              this.util.direction = 'ltr';
              this.util.cside = 'right';
              this.util.currecny = '$';
              document.documentElement.dir = this.util.direction;
              this.util.tax_enabled = false;
              this.util.delivery_enabled = false;
              // this.odoo_api = 'http://500.ahorasoft.com:22012/as_app_api/order/create';
            }
            resolve('');
          } else {
            reject('');
          }
        }, error => {
          console.log('default settings', error);
          reject(error);
        });
      } else {
        const param = {
          id: localStorage.getItem('language')
        };
        this.post('users/getDefaultSettingsById', param).then((data: any) => {
          const settings = data.data.settings;
          if (settings && settings.length > 0) {
            const info = settings[0];
            this.util.direction = info.appDirection;
            this.util.cside = info.currencySide;
            this.util.currecny = info.currencySymbol;
            this.util.logo = info.logo;
            this.util.twillo = info.twillo;
            this.util.delivery = info.delivery;
            this.util.user_login = info.user_login;
            this.util.home_type = info.home_ui;
            this.util.reset_pwd = info.reset_pwd;
            this.util.tax_enabled = info.tax_enabled && (info.tax_enabled as string).toLowerCase() == 'true' ? true : false;
            this.util.delivery_enabled = info.delivery_enabled && (info.delivery_enabled as string).toLowerCase() == 'true' ? true : false;
            document.documentElement.dir = this.util.direction;
            // this.odoo_api = info.odoo_api ? info.odoo_api : 'http://500.ahorasoft.com:22012/as_app_api/order/create';

          } else {
            this.util.direction = 'ltr';
            this.util.cside = 'right';
            this.util.currecny = '$';
            document.documentElement.dir = this.util.direction;
            this.util.tax_enabled = false;
            this.util.delivery_enabled = false;
            // this.odoo_api = 'http://500.ahorasoft.com:22012/as_app_api/order/create';
          }
          resolve('');
        }, error => {
          console.log('default settings by id', error);
          reject(error);
        });
      }
    });
  }
}
