import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//404
import { NotpagefoundComponent } from './notpagefound/notpagefound.component';

//Pages
import { PagesRoutingModule } from './pages/pages.routing';
import { AuthRoutingModule } from './auth/auth.routing';

const routes:Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  { path: '**', component: NotpagefoundComponent }
];


@NgModule({
  declarations: [],
  imports: [ 
    RouterModule.forRoot(routes , { useHash: true} ),
    PagesRoutingModule,
    AuthRoutingModule
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
