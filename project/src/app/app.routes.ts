import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard, NoAuthGuard } from './authGuard';
import { HomePageComponent } from './features/home/home-page/home-page.component';
import { BoardsPageComponent } from './features/tasks/boards-page/boards-page.component';
import { AuthorizationPageComponent } from './features/auth/authorization-page/authorization-page.component';
import { setLayout } from './shared/layouts/page-layout.resolver';
import { PageLayout } from './shared/layouts/page-layout.enum';

export const routes: Routes = [
    {
        path: '', 
        component: HomePageComponent, 
        canActivate: [AuthGuard], 
        resolve: 
        {
            layout: setLayout(PageLayout.Authorized)
        } 
    },
    {
        path: 'auth',
        component: AuthorizationPageComponent,
        canActivate: [NoAuthGuard]
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
        path: '**',
        redirectTo: ''
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }