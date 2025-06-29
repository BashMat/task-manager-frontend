import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard, NoAuthGuard } from './authGuard';
import { HomePageComponent } from '../home-page/home-page.component';
import { BoardsPageComponent } from '../boards-page/boards-page.component';
import { AuthorizationPageComponent } from '../authorization-page/authorization-page.component';

export const routes: Routes = [
    { path: '', component: HomePageComponent, canActivate: [AuthGuard] },
    { path: 'auth', component: AuthorizationPageComponent, canActivate: [NoAuthGuard]},
    { path: 'boards', component: BoardsPageComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }