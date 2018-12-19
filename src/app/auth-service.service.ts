import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import {BehaviorSubject} from 'rxjs';
import {AuthDataService} from './auth-data.service';
import {DataProviderService} from './data-provider.service';
import {post} from '../../node_modules/@types/selenium-webdriver/http';
import {promise} from 'selenium-webdriver';
@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private sampleRef: any;
  public authChecker = new BehaviorSubject<any>(this.sampleRef);
  public onLoginDataProvider = new BehaviorSubject<any>(this.sampleRef);
  private userConfigObject: any = {
    apiKey: '**********',
    authDomain: '**********',
    databaseURL: '**********',
    projectId: '**********',
    storageBucket: '**********',
    messagingSenderId: '**********'
  };
  private provider: any;
  private loggedIn: Boolean = false;
  private dataBase: any;
  constructor() {

    firebase.initializeApp(this.userConfigObject);
    this.provider = new firebase.auth.GoogleAuthProvider();
    this.provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    firebase.auth().languageCode = 'en';
    // using cloud database
    this.dataBase = firebase.firestore();
    this.dataBase.settings({timestampsInSnapshots: true});
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        this.loggedIn = true;
        const userColRef = this._database.collection('users');
        userColRef.doc(user['uid']).get().then((doc) => {
          if (doc.exists) {
            const alteredData = doc.data();
            alteredData['uid'] = user['uid'];
            this.onLoginDataProvider.next({'type': 'onLoginSuccess', 'data': alteredData, 'success': true});
          } else {
            const userInitialData = {
              'emailId': user['email'],
              'displayName': user['displayName'],
              'myPosts': [],
              'likedPosts': [],
              'disLikedPosts': [],
              'profileImgUrl': 'https://secure.webtoolhub.com/static/resources/icons/set39/5dc05f7d.png',
              'uid': user['uid']
            };
            userColRef.doc(user['uid']).set(userInitialData).then(() => {
              this.onLoginDataProvider.next({'type': 'onLoginSuccess', 'data': userInitialData, 'success': true});
            }).catch((err) => {alert(err); });
          }

        });
      } else {
        this.loggedIn = false;
        this.authChecker.next({'type': 'isLoggedInOrNot', 'data': {'status': false}, 'success': true});
      }
      // this.loginStatusUpdate.next({'status': this.loggedIn});

    }.bind(this));

  }

  login(emailId, Password) {
    firebase.auth().signInWithEmailAndPassword(emailId, Password).then((data) => {
    }).catch((err) => {
    this.authChecker.next({'type': 'siginIn', 'data': err, 'success': false});
    }
    );
  }
  register(emailId, password) {
    firebase.auth().createUserWithEmailAndPassword(emailId, password).then((data) => {
    // this.authChecker.next({'type': 'siginUp', 'data': data, 'success': true});
    //   this.onLoginDataProvider.next({'type': 'onLoginSuccess', 'data': data, 'success': true});
  }).catch((err) => {
      this.authChecker.next({'type': 'siginUp', 'data': err, 'success': false});
    }
  );
  //   const actionCodeSettings = {
  //     // URL you want to redirect back to. The domain (www.example.com) for this
  //     // URL must be whitelisted in the Firebase Console.
  //     url: 'http://gopikrishna44.github.io',
  //     // This must be true.
  //     handleCodeInApp: true,
  //   };
    // firebase.auth().signup(emailId, actionCodeSettings)
    //   .then(function() {
    //     // The link was successfully sent. Inform the user.
    //     // Save the email locally so you don't need to ask the user for it again
    //     // if they open the link on the same device.
    //     alert('Verfication link sent ');
    //   })
    //   .catch(function(error) {
    //     // Some error occurred, you can inspect the code: error.code
    //   });
  }
  logout() {
    firebase.auth().signOut();
  }
  failedCreatePost(error: any): Promise<any> {
    // alert(error);
    // window.location.reload();
    return Promise.reject('Unsuccessfull');
  }
  createPost(postData: any) {
    const postColRef = this._database.collection('posts');
    postColRef.add(postData).then((postRef) => {
      //alert('success');
      // this.updateUserData(postData.uid, {'myPosts': postRef.id}, 'myPosts');
      const docRef = this._database.collection('users').doc(postData.uid);
      docRef.get().then(doc => {
        const myPosts = doc.data()['myPosts'];
        myPosts.push(postRef.id);
        docRef.update({'myPosts': myPosts}).then(() => {
          //alert('success');
          window.location.reload();
        }).catch(err => {this.failedCreatePost(err); });
      }).catch(err => {this.failedCreatePost(err); });


    }).catch((err) => {
     this.failedCreatePost(err);
    });
  }
  // updateUserData(userUid: any, jsonData: any, key= null) {
  //
  //   const userRef = this._database.collection('users');
  //   if (key)  {
  //       let savedData: any;
  //       savedData = this.authDataSer._preSaveData[key.keyid];
  //       savedData.push(jsonData[key.keyid]);
  //       // savedData['uid'] = userUid;
  //       userRef.doc(userUid).update({type: savedData}).then((doc) => {
  //         // this.onLoginDataProvider.next({'type': 'onLoginSuccess', 'data': savedData, 'success': true});
  //
  //         if (key.keyid == 'likedPosts' || key.keyid == 'disLikedPosts') {
  //           // return this.likeOrDisLikePost(jsonData[key.keyid], userUid, key.data);
  //           this.likeOrDisLikePost(jsonData[key.keyid], userUid, key.data);
  //         }
  //       })
  //         .catch((err) => {});
  //
  //
  //   } else {
  //     userRef.doc(userUid).update(jsonData).then(() => {
  //
  //     }).catch((err) => {} );
  //   }
  //
  // }
  // likeOrDisLikePost(postKey: any, userUid: any, status: any) {
  //
  //   const postColRef = this._database.collection('posts');
  //   if (status) {
  //
  //     const arr = this.dataSer._allPostData['likedUsers'];
  //
  //     arr.push(postKey);
  //     // update the arr in the firebase
  //     return postColRef.doc(postKey).update({'likedUsers': arr})
  //       .then(() => {})
  //       .catch((err) => {});
  //
  //   } else {
  //
  //     const arr = this.dataSer._allPostData['dislikedUsers'];
  //
  //     arr.push(postKey);
  //     // update the arr in the firebase
  //     return postColRef.doc(postKey).update({'likedUsers': arr})
  //       .then(() => {})
  //       .catch((err) => {});
  //   }
  // }
  //


  get _loggedIn(): any {
    return this.loggedIn;
  }
  get _database(): any {
    return this.dataBase;
  }
}
