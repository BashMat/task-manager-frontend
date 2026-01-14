import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard, NoAuthGuard } from './authGuard';
import { HomePageComponent } from './features/home/home-page/home-page.component';
import { BoardsPageComponent } from './features/tasks/boards-page/boards-page.component';
import { BoardsPageMaterialComponent } from './features/tasks/boards-page-material/boards-page-material.component';
import { AuthorizationPageComponent } from './features/auth/authorization-page/authorization-page.component';
import { AuthPageMaterialComponent } from './features/auth/auth-page-material/auth-page-material.component';
import { setLayout } from './shared/layouts/page-layout.resolver';
import { PageLayout } from './shared/layouts/page-layout.enum';

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
        component: AuthPageMaterialComponent,
        canActivate: [NoAuthGuard],
        resolve: 
        {
            layout: setLayout(PageLayout.Unauthorized)
        }
    },
    {
        path: 'boards',
        component: BoardsPageMaterialComponent,
        canActivate: [AuthGuard],
        resolve: 
        {
            layout: setLayout(PageLayout.Authorized)
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
export class AppRoutingModule { }