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
import { Observable } from 'rxjs';
import { ApisService } from '../services/apis.service';

@Injectable({
    providedIn: 'root'
})
export class LocationGuard implements CanActivate {

    constructor(private authServ: ApisService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot): any {
        const location = localStorage.getItem('location');
        console.log('location', localStorage.getItem('location'));
        if (location && location != null && location !== 'null') {
            return true;
        }
        this.router.navigate(['/location']);
        return false;
    }
}
