import { Injectable } from '@angular/core';
import {DataProviderService} from './data-provider.service';
import {AuthServiceService} from './auth-service.service';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthDataService {
  private preSaveData: any = null;
  public sampleRef: any;
  public sendRealDataOnLogin = new BehaviorSubject<any>(this.sampleRef);
  private allPostsData: any = null;
  private userPosts: any = null;
  public calulationDone: Boolean = false;
  private userLikedPosts: any = null;
  private userDisLikedPosts: any = null;
  private db: any = null;
  private uid: any = null;
  private isLoggedIn: Boolean = false;
  private appComponentLevelUserData: any = {};
  constructor(private globalDataSer: DataProviderService, private authSer: AuthServiceService) {
    this.db = this.authSer._database;
    this.globalDataSer.allPostsDataProvider.subscribe(data => {
        this.allPostsData = data;
      }
    );
    this.authSer.onLoginDataProvider.subscribe(message => {
      if (message && ((message['type'] == 'onLoginSuccess' && !this.calulationDone)) && message['success']) {
        this.preSaveData = message['data'];
        this.uid = message['data']['uid'];
        // take user posts
        this.userPosts = message['data']['myPosts'];
        this.userLikedPosts = message['data']['likedPosts'];
        this.userDisLikedPosts = message['data']['disLikedPosts'];
        this.appComponentLevelUserData['emailId'] = message['data']['emailId'];
        this.appComponentLevelUserData['displayName'] = message['data']['displayName'];
        this.appComponentLevelUserData['profileImgUrl'] = message['data']['profileImgUrl'];
        this.isLoggedIn = true;
        this.calulationDone = true;
        //required data is condtructed now publish it to myposts
        this.sendRealDataOnLogin.next({'type': 'recieveData', 'data': {'userPosts': this.userPosts}, 'success': true});
        this.sendRealDataOnLogin.next({'type': 'checkLoginStatus', 'data': {'status': true}, 'success': true});
      } else if (message && message['type'] == 'isLoggedInOrNot' && message.success) {
        this.isLoggedIn = false;
        this.userPosts = [];
        this.calulationDone = false;
      } else if (message && message['type'] == 'userLikedPosts') {
        this.userLikedPosts.push(message.data.postKey);
      } else if (message && message['type'] == 'userDisLikedPosts') {
        this.userDisLikedPosts.push(message.data.postKey);
      }

    });
  }
  get _isLoggedIn() {
    return this.isLoggedIn;
  }
  get _appComponentLevelUserData() {
    return this.appComponentLevelUserData;
  }
  get _userPosts() {
    return this.userPosts;
  }
  get _userLikedPosts() {
    return this.userLikedPosts;
  }
  get _userDisLikedPosts() {
    return this.userDisLikedPosts;
  }
  get _uid() {
    return this.uid;
  }
  get _preSaveData() {
    return this.preSaveData;
  }
}
