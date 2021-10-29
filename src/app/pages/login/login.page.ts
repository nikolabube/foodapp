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
import { login } from 'src/app/interfaces/login';
import { NavigationExtras, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';
import { MenuController, ModalController, NavController } from '@ionic/angular';
import Swal from 'sweetalert2';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { mobile } from 'src/app/interfaces/mobile';
import { SelectCountryPage } from '../select-country/select-country.page';
import { mobileLogin } from 'src/app/interfaces/mobileLogin';
import { VerifyPage } from '../verify/verify.page';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  
  login: login = { email: '', password: '' };
  mobile: mobile = { ccCode: '', phone: '', password: '' };
  mobileLogin: mobileLogin = { ccCode: '', phone: '' };
  submitted = false;
  isLogin: boolean = false;
  userDetail;

  constructor(
    private router: Router,
    public api: ApisService,
    public util: UtilService,
    private navCtrl: NavController,
    private oneSignal: OneSignal,
    private menuController: MenuController,
    private modalController: ModalController,
    private modalCtrl: ModalController
  ) {
    console.log('--------------- user login', this.util.user_login);
    this.mobile.ccCode = '+591';
    this.mobileLogin.ccCode = '+591';
    this.oneSignal.getIds().then((data) => {
      console.log('iddddd==========', data);
      localStorage.setItem('fcm', data.userId);
    });
  }

  ngOnInit() {

  }

  onLogin(form: NgForm) {
    console.log('form', form);
    this.submitted = true;
    if (form.valid) {
      const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailfilter.test(this.login.email)) {
        this.util.showToast(this.util.translate('Please enter valid email'), 'danger', 'bottom');
        return false;
      }
      console.log('login');
      this.isLogin = true;

      this.api.post('users/loginUser', this.login).then((data: any) => {
        this.isLogin = false;
        console.log(data);
        if (data && data.status === 200) {

          if (data && data.data && data.data.data.type === 'user') {
            if (data.data.data.status === '1') {
              console.log('tokne', data.data.token);
              localStorage.setItem('uid', '' + data.data.data.id);
              localStorage.setItem('token', data.data.token);
              this.util.userInfo = data.data.data;
              localStorage.setItem('lg_user', JSON.stringify(this.util.userInfo));
              const fcm = localStorage.getItem('fcm');
              if (fcm && fcm !== null && fcm !== 'null') {
                const updateParam = {
                  id: data.data.data.id,
                  fcm_token: fcm
                };
                this.api.post_private('users/edit_profile', updateParam).then((data: any) => {
                  console.log('user info=>', data);
                }, error => {
                  console.log(error);
                }).catch(error => {
                  console.log(error);
                });
              }

              const favParam = {
                id: data.data.data.id
              }
              this.api.post_private('favourite/getByUid', favParam).then((data: any) => {
                console.log('fav data', data);
                if (data && data.status === 200 && data.data.length > 0) {
                  this.util.haveFav = true;
                  try {
                    this.util.favIds = data.data[0].ids.split(',');
                  } catch (error) {
                    console.log('eroor', error);
                  }
                } else {
                  this.util.haveFav = false;
                }
              }, error => {
                this.util.haveFav = false;
                console.log('fav error', error);
              }).catch(error => {
                this.util.haveFav = false;
                console.log('fav error', error);
              });

              this.navCtrl.navigateRoot(['']);
            } else {
              console.log('not valid');
              Swal.fire({
                title: this.util.translate('Error'),
                text: this.util.translate('Your are blocked please contact administrator'),
                icon: 'error',
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonText: this.util.translate('Need Help?'),
                backdrop: false,
                background: 'white'
              }).then(status => {
                if (status && status.value) {
                  // localStorage.setItem('helpId', data.data.id);
                  // this.router.navigate(['inbox']);
                  const inboxParam: NavigationExtras = {
                    queryParams: {
                      id: 0,
                      name: 'Support',
                      uid: data.data.data.id,
                      token: data.data.token
                    }
                  };
                  this.router.navigate(['inbox'], inboxParam);
                }
              });
            }
          } else {
            this.util.errorToast(this.util.translate('Not valid user'));

          }
        } else if (data && data.status === 500) {
          this.util.errorToast(data.data.message);
        } else {
          this.util.errorToast(this.util.translate('Something went wrong'));
        }
      }, error => {
        console.log(error);
        this.isLogin = false;
        this.util.errorToast(this.util.translate('Something went wrong'));
      }).catch(error => {
        console.log(error);
        this.isLogin = false;
        this.util.errorToast(this.util.translate('Something went wrong'));
      });

    }
  }

  onPhoneLogin(form: NgForm) {
    console.log('form', form, this.mobile);
    console.log(this.mobile.ccCode + this.mobile.phone);

    this.submitted = true;
    if (form.valid) {
      const param = {
        cc: this.mobile.ccCode,
        mobile: this.mobile.phone,
        password: this.mobile.password
      };
      this.isLogin = true;
      this.api.post('users/loginWithPhoneAndPasswordUser', param).then((data: any) => {
        this.isLogin = false;
        console.log(data);
        if (data && data.status === 200) {
          if (data && data.data && data.data.data.type === 'user') {
            if (data.data.data.status === '1') {
              localStorage.setItem('uid', '' + data.data.data.id);
              localStorage.setItem('token', data.data.token);
              this.util.userInfo = data.data.data;
              localStorage.setItem('lg_user', JSON.stringify(this.util.userInfo));
              const fcm = localStorage.getItem('fcm');
              if (fcm && fcm !== null && fcm !== 'null') {
                const updateParam = {
                  id: data.data.data.id,
                  fcm_token: fcm
                };
                this.api.post_private('users/edit_profile', updateParam).then((data: any) => {
                  console.log('user info=>', data);
                }, error => {
                  console.log(error);
                }).catch(error => {
                  console.log(error);
                });
              }

              const favParam = {
                id: data.data.data.id
              }
              this.api.post_private('favourite/getByUid', favParam).then((data: any) => {
                console.log('fav data', data);
                if (data && data.status === 200 && data.data.length > 0) {
                  this.util.haveFav = true;
                  try {
                    this.util.favIds = data.data[0].ids.split(',');
                  } catch (error) {
                    console.log('eroor', error);
                  }
                } else {
                  this.util.haveFav = false;
                }
              }, error => {
                this.util.haveFav = false;
                console.log('fav error', error);
              }).catch(error => {
                this.util.haveFav = false;
                console.log('fav error', error);
              });

              this.navCtrl.navigateRoot(['']);
            } else {
              console.log('not valid');
              Swal.fire({
                title: this.util.translate('Error'),
                text: this.util.translate('Your are blocked please contact administrator'),
                icon: 'error',
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonText: this.util.translate('Need Help?'),
                backdrop: false,
                background: 'white'
              }).then(status => {
                if (status && status.value) {
                  // localStorage.setItem('helpId', data.data.id);
                  // this.router.navigate(['inbox']);
                  const inboxParam: NavigationExtras = {
                    queryParams: {
                      id: 0,
                      name: 'Support',
                      uid: data.data.data.id,
                      token: data.data.token
                    }
                  };
                  this.router.navigate(['inbox'], inboxParam);
                }
              });
            }
          } else {
            this.util.errorToast(this.util.translate('Not valid user'));
          }
        } else if (data && data.status === 500) {
          this.util.errorToast(data.data.message);
        } else {
          this.util.errorToast(this.util.translate('Something went wrong'));
        }
      }, error => {
        console.log(error);
        this.isLogin = false;
        this.util.errorToast(this.util.translate('Something went wrong'));
      }).catch(error => {
        console.log(error);
        this.isLogin = false;
        this.util.errorToast(this.util.translate('Something went wrong'));
      });
    }


  }



  onOTPLogin(form: NgForm) {
    console.log(this.mobileLogin);
    this.submitted = true;
    if (form.valid) {
      const param = {
        mobile: this.mobileLogin.phone,
        cc: this.mobileLogin.ccCode
      };
      this.isLogin = true;
      this.api.post('users/checkMobileNumber', param).then((data) => {
        this.isLogin = false;
        console.log(data);
        if (data && data.status === 200) {
          console.log('open modal');
          this.openModal(data.data.id);
        } else if (data && data.status === 500) {
          this.util.errorToast(data.data.message);
        } else {
          this.util.errorToast(this.util.translate('Something went wrong'));
        }
      }, error => {
        console.log(error);
        this.isLogin = false;
        this.util.errorToast(this.util.translate('Something went wrong'));
      }).catch(error => {
        console.log(error);
        this.isLogin = false;
        this.util.errorToast(this.util.translate('Something went wrong'));
      });
    }
  }

  async openModal(uid) {
    console.log('uid', uid);
    const modal = await this.modalCtrl.create({
      component: VerifyPage,
      componentProps: { code: this.mobileLogin.ccCode, phone: this.mobileLogin.phone }
    });

    modal.onDidDismiss().then((data) => {
      console.log(data);
      if (data && data.role === 'ok') {
        const param = {
          id: uid
        };
        this.api.post('users/getByIDAfterVerify', param).then((data: any) => {
          console.log('user data', data);
          if (data && data.status === 200 && data.data && data.data.data.length && data.data.data[0].type === 'user') {
            this.util.userInfo = data.data.data[0];
            localStorage.setItem('lg_user', JSON.stringify(this.util.userInfo));
            if (data && data.data && data.data.data[0].type === 'user') {
              if (data.data.data[0].status === '1') {
                localStorage.setItem('uid', '' + uid);
                localStorage.setItem('token', data.data.token);
                const fcm = localStorage.getItem('fcm');
                if (fcm && fcm !== null && fcm !== 'null') {
                  const updateParam = {
                    id: uid,
                    fcm_token: fcm
                  };
                  this.api.post_private('users/edit_profile', updateParam).then((data: any) => {
                    console.log('user info=>', data);
                  }, error => {
                    console.log(error);
                  }).catch(error => {
                    console.log(error);
                  });
                }

                const favParam = {
                  id: uid
                }
                this.api.post_private('favourite/getByUid', favParam).then((data: any) => {
                  console.log('fav data', data);
                  if (data && data.status === 200 && data.data.length > 0) {
                    this.util.haveFav = true;
                    try {
                      this.util.favIds = data.data[0].ids.split(',');
                    } catch (error) {
                      console.log('eroor', error);
                    }
                  } else {
                    this.util.haveFav = false;
                  }
                }, error => {
                  this.util.haveFav = false;
                  console.log('fav error', error);
                }).catch(error => {
                  this.util.haveFav = false;
                  console.log('fav error', error);
                });

                this.navCtrl.navigateRoot(['']);
              } else {
                console.log('not valid');
                Swal.fire({
                  title: this.util.translate('Error'),
                  text: this.util.translate('Your are blocked please contact administrator'),
                  icon: 'error',
                  showConfirmButton: true,
                  showCancelButton: true,
                  confirmButtonText: this.util.translate('Need Help?'),
                  backdrop: false,
                  background: 'white'
                }).then(status => {
                  if (status && status.value) {
                    const inboxParam: NavigationExtras = {
                      queryParams: {
                        id: 0,
                        name: 'Support',
                        uid: uid,
                        token: data.data.token
                      }
                    };
                    this.router.navigate(['inbox'], inboxParam);
                  }
                });
              }
            } else {
              this.util.errorToast(this.util.translate('Not valid user'));
            }
          } else if (data && data.status === 500) {
            this.util.errorToast(data.data.message);
          } else {
            this.util.errorToast(this.util.translate('Something went wrong'));
          }
        }, error => {
          localStorage.removeItem('uid');
          console.log(error);
        }).catch(error => {
          localStorage.removeItem('uid');
          console.log(error);
        });

      }
    });
    modal.present();
  }

  resetPass() {
    this.router.navigate(['/forgot']);
  }

  register() {
    this.router.navigate(['register']);
  }

  ionViewWillEnter() {
    this.menuController.enable(false);
  }
  ionViewWillLeave() {
    this.menuController.enable(true);
  }

  async openCountry() {
    console.log('open ccode');
    const modal = await this.modalController.create({
      component: SelectCountryPage,
      backdropDismiss: false,
      showBackdrop: true,
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
      if (data && data.role === 'selected') {
        console.log('ok');
        this.mobile.ccCode = '+' + data.data;
        this.mobileLogin.ccCode = '+' + data.data;
      }
    });
    await modal.present();
  }
}
