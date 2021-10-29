/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 foodies app
  Created : 28-Feb-2021
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { TestBed, async, inject } from '@angular/core/testing';

import { LocationGuard } from './location.guard';

describe('LocationGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocationGuard]
    });
  });

  it('should ...', inject([LocationGuard], (guard: LocationGuard) => {
    expect(guard).toBeTruthy();
  }));
});