import { Component, OnInit } from '@angular/core';
import {AuthDataService} from '../auth-data.service';
import {AuthServiceService} from '../auth-service.service';
import {DataProviderService} from '../data-provider.service';
import {AppComponent} from '../app.component';

@Component({
  selector: 'app-myposts',
  templateUrl: './myposts.component.html',
  styleUrls: ['./myposts.component.css']
})
export class MypostsComponent implements OnInit {
  public loggedIn: Boolean = false;
  public userPosts: any = [];
  public globalPosts: any = null;
  public feedStatus: any = null;
  public preLoaderStatus: any = null;
  constructor(private authDataSer: AuthDataService, private authSer: AuthServiceService, private datsSer: DataProviderService,private appSer:AppComponent) {
    this.loggedIn = this.authSer._loggedIn;
    this.authSer.authChecker.subscribe(message => {

      if (message) {
        if (message.success) {
          if (message.type == 'isLoggedInOrNot') {
            this.loggedIn = false;
            this.userPosts = null;
          }
        }
      }
    });
    this.authDataSer.sendRealDataOnLogin.subscribe(message => {
      if (message) {
        if (message.success) {
        if (message.type == 'recieveData') {
         this.loggedIn = true;
         this.userPosts = message.data['userPosts'];
         console.log('userPosts' + this.userPosts);
         this.feedStatus = 'Content';
         this.globalPosts = this.datsSer._allPostData;
        }}
      }
    });
  }

  ngOnInit() {
  }
  public delete(postKey: any) {
    // delete this.globalPosts[postKey];
    // //this.authSer.onLoginDataProvider.next({'type': 'postDelete', 'data': {'postKey': postKey}, 'success': true});
    this.appSer.feedStatus=false;
    this.feedStatus=false;
    var uP = this.authDataSer._userPosts;
    uP.splice(uP.indexOf(postKey),1);
    // let p=this.datsSer._allPostData;
    // delete p[postKey];
    this.preLoaderStatus = false;
    this.authSer._database.collection('users').doc(this.authDataSer._uid).update({'myPosts': uP})
      .then(() => {
        this.authSer._database.collection('posts').doc(postKey).delete()
          .then(() => { window.location.reload(); })
          .catch(() => {});

      })
      .catch((err) => {});
  }

}
