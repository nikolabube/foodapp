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

import { UserGuard } from './auth.guard';

describe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserGuard]
    });
  });

  it('should ...', inject([UserGuard], (guard: UserGuard) => {
    expect(guard).toBeTruthy();
  }));
});