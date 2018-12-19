import { Component, AfterViewInit } from '@angular/core';
import {Router} from '@angular/router';
import {MatTabChangeEvent} from '@angular/material';
import {DataProviderService} from './data-provider.service';
import {AuthServiceService} from './auth-service.service';
import {ViewpostsComponent} from './viewposts/viewposts.component';
import {AuthDataService} from './auth-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  public loggedIn: Boolean = false;
  public userData: any;
  public whichComponentToShow: any = 'login';
  private navigationMapNl: any = {0: 'login', 1: 'signup', 2: 'viewposts'};
  private navigationMapl: any = {0: 'viewMyPosts', 1: 'viewposts', 2: 'createPost'};
  public showFeed: Boolean = false;
  public feedStatus:Boolean=false;
  constructor(private router: Router, private auth: AuthServiceService, private authDataSer: AuthDataService) {
    this.loggedIn = this.authDataSer._isLoggedIn;
    // this.loggedIn = this.auth._loggedIn;
    // this.auth.loginStatusUpdate.subscribe((message) => {
    //   if (message) {
    //     this.loggedIn = message.status;
    //   }
    // });
      this.auth.authChecker.subscribe(message => {
          if (message) {
            if (message.success) {
              if (message.type == 'isLoggedInOrNot') {
                this.loggedIn = false;
                this.userData = null;
                this.feedStatus=true;
                this.whichComponentToShow = 'login';
                document.getElementById("root").style.overflow="hidden";
              }
            }
            else if(!message.success)
            {
              this.whichComponentToShow='login';
              document.getElementById("root").style.overflow="hidden";
            }
          }
      });
      this.authDataSer.sendRealDataOnLogin.subscribe(message => {
        if (message) {
          if (message.success && message.type == 'checkLoginStatus') {
            this.loggedIn = message.data.status;
            this.feedStatus=true;
            this.whichComponentToShow='viewMyPosts';
            document.getElementById("root").style.overflow="auto";
            this.userData = this.authDataSer._appComponentLevelUserData;
          }

        }
      });
  }
  ngAfterViewInit() {
    // this.router.navigateByUrl('/login');

  }
  navigate(pageName: any) {
    this.showFeed = false;
   this.router.navigateByUrl('/' + pageName);
  }
  tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
    // if (this.navigationMapNl[tabChangeEvent.index] == 'viewposts') {
    //   this.showFeed = true;
    // }
    // this.showFeed = false;
    // if (!this.loggedIn) {
    // this.navigate(this.navigationMapNl[tabChangeEvent.index]);
    // } else {
    //   this.navigate(this.navigationMapl[tabChangeEvent.index]);
    // }
    if (this.loggedIn) {
      this.whichComponentToShow = this.navigationMapl[tabChangeEvent.index];
    } else {
      this.whichComponentToShow = this.navigationMapNl[tabChangeEvent.index];
    }
    if(this.whichComponentToShow=='login'||this.whichComponentToShow=='signup'||this.whichComponentToShow=='createPost')
      document.getElementById('root').style.overflow='hidden';
    else
      document.getElementById('root').style.overflow='auto';


  }
topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
  logout() {
    this.authDataSer.calulationDone=false;
    this.auth.logout();
  }
}
