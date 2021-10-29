/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 foodies app
  Created : 28-Feb-2021
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guard/auth.guard';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../home/home.module').then(m => m.HomePageModule)
          },
          {
            path: 'category',
            loadChildren: () => import('../category/category.module').then(m => m.CategoryPageModule)
          }
        ]
      },
      {
        path: 'tab2',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../history/history.module').then(m => m.HistoryPageModule),
            canActivate: [AuthGuard]
          }
        ]
      },
      {
        path: 'tab3',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../cart/cart.module').then(m => m.CartPageModule),
            canActivate: [AuthGuard]
          }
        ]
      },
      {
        path: 'tab4',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../account/account.module').then(m => m.AccountPageModule),
            canActivate: [AuthGuard]
          },
          {
            path: 'profile',
            loadChildren: () =>
              import('../account/account.module').then(m => m.AccountPageModule),
          },
          {
            path: 'about',
            loadChildren: () =>
              import('../about/about.module').then(m => m.AboutPageModule)
          },
          {
            path: 'contacts',
            loadChildren: () =>
              import('../contacts/contacts.module').then(m => m.ContactsPageModule)
          },
          {
            path: 'languages',
            loadChildren: () =>
              import('../languages/languages.module').then(m => m.LanguagesPageModule)
          },
          {
            path: 'faqs',
            loadChildren: () =>
              import('../faqs/faqs.module').then(m => m.FaqsPageModule)
          },
          {
            path: 'help',
            loadChildren: () =>
              import('../help/help.module').then(m => m.HelpPageModule)
          }
        ]
      },
      {
        path: 'category',
        children: [
          {
            path: '',
            loadChildren: () => import('../category/category.module').then(m => m.CategoryPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
