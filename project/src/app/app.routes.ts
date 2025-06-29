import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard, NoAuthGuard } from './authGuard';
import { HomePageComponent } from './features/home/home-page/home-page.component';
import { BoardsPageComponent } from './features/tasks/boards-page/boards-page.component';
import { AuthorizationPageComponent } from './features/auth/authorization-page/authorization-page.component';
import { AuthorizedLayoutComponent } from './shared/layouts/authorized/authorized-layout.component';

export const routes: Routes = [
    { path: '', component: AuthorizedLayoutComponent, canActivate: [AuthGuard] },
    { path: 'auth', component: AuthorizationPageComponent, canActivate: [NoAuthGuard]},
    { path: 'boards', component: BoardsPageComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }