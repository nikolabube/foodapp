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
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { ApisService } from '../services/apis.service';
import { Observable } from 'rxjs';
import { UtilService } from '../services/util.service';
@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(
        private api: ApisService,
        private router: Router,
        private util: UtilService
    ) { }

    canActivate(): Observable<boolean> | Promise<boolean> | boolean {
        return new Promise(res => {
            this.util.show('Verifying');
            this.api.post_private('users/validateUserToken', {}).then(
                (data: any) => {
                    this.util.hide();
                    if (data && data.status === 200 && data.data && data.data.status === 200) {
                        res(true);
                    } else {
                        localStorage.removeItem('uid');
                        localStorage.removeItem('token');
                        this.router.navigate(['/login']);
                        res(false);
                    }
                },
                (error) => {
                    console.log(error);
                    this.util.hide();
                    localStorage.removeItem('uid');
                    localStorage.removeItem('token');
                    this.router.navigate(['/login']);
                    res(false);
                }
            ).catch((error) => {
                console.log(error);
                this.util.hide();
                localStorage.removeItem('uid');
                localStorage.removeItem('token');
                this.router.navigate(['/login']);
                res(false);
            });

        });
    }
}
