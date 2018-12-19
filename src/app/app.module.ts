import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatCheckboxModule, MatGridListModule, MatCardModule, MatSidenavModule,MatChipsModule, MatProgressSpinnerModule, MatBadgeModule, MatSnackBarModule, MatTabsModule, MatButtonModule, MatIconModule, MatSelectModule, MatInputModule, MatFormFieldModule} from '@angular/material';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ViewpostsComponent } from './viewposts/viewposts.component';
import { MypostsComponent } from './myposts/myposts.component';
import { CreatepostComponent } from './createpost/createpost.component';


const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'viewposts', component: ViewpostsComponent},
  {path: 'viewMyPosts', component: MypostsComponent}

];
@NgModule({
  declarations: [

    AppComponent,
    LoginComponent,
    SignupComponent,
    ViewpostsComponent,
    MypostsComponent,
    CreatepostComponent,
  ],
  imports: [
    RouterModule.forRoot(routes),
    MatCardModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatBadgeModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTabsModule,
    MatSidenavModule,
    MatGridListModule,
    MatCheckboxModule,
    BrowserAnimationsModule,
    BrowserModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
