import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AuthGuard, NoAuthGuard} from './authGuard';
import {BoardsPageComponent} from './features/tasks/boards-page/boards-page.component';
import {AuthPageComponent} from './features/auth/auth-page/auth-page.component';
import {setLayout} from './shared/layouts/page-layout.resolver';
import {PageLayout} from './shared/layouts/page-layout.enum';
import { ProfilePageComponent } from './features/profile/profile-page/profile-page.component';
import { userResolver } from './shared/user.resolver';
import { autoLayout } from './shared/layouts/auto-layout.resolver';

export const routes: Routes = [
  // TODO: Reuse when other functionality is added
  // {
  //     path: '',
  //     component: HomePageComponent,
  //     canActivate: [AuthGuard],
  //     resolve:
  //     {
  //         layout: setLayout(PageLayout.Authorized)
  //     }
  // },
  {
    path: 'auth',
    component: AuthPageComponent,
    canActivate: [NoAuthGuard],
    resolve:
      {
        layout: setLayout(PageLayout.Unauthorized)
      }
  },
  {
    path: 'boards',
    component: BoardsPageComponent,
    canActivate: [AuthGuard],
    resolve:
      {
        layout: setLayout(PageLayout.Authorized)
      }
  },
  {
    path: ':username',
    component: ProfilePageComponent,
    resolve:
    {
      username: userResolver(),
      layout: autoLayout()
    }
  },
  {
    path: '**',
    redirectTo: 'boards'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

