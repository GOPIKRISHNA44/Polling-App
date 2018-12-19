import { Component, OnInit } from '@angular/core';
import {DataProviderService} from '../data-provider.service';
import {AuthServiceService} from '../auth-service.service';
import {MatSnackBar} from '@angular/material';
import {AuthDataService} from '../auth-data.service';
@Component({
  selector: 'app-viewposts',
  templateUrl: './viewposts.component.html',
  styleUrls: ['./viewposts.component.css']
})
export class ViewpostsComponent implements OnInit {
  public allPostsDataKeys: any = [];
  public postData: any = null;
  public feedStatus: any = null;
  constructor(private dataSer: DataProviderService, private authSer: AuthServiceService, private snackBar: MatSnackBar, private authDataSer: AuthDataService) {}



  ngOnInit() {
    this.dataSer.allPostsDataProvider.subscribe(data => {

      if (data) {
        this.allPostsDataKeys = Object.keys(data);
      if (this.allPostsDataKeys.length == 0) {
        this.feedStatus = 'NoContent';
      } else {
        this.feedStatus = 'Content';
        this.postData = data;
      }
    }

    });
  }
  public deletePost() {

  }

  public likeOrDisklike(status: Boolean, postKey: any) {
    if (!this.authSer._loggedIn) {
      this.snackBar.open('Please login', 'close', {duration: 3000});
    } else {

         if (this.authDataSer._userPosts.includes(postKey)) {
           this.snackBar.open('This is your post', 'close', {duration: 3000});
           return; }
         if (this.authDataSer._userLikedPosts.includes(postKey) || this.authDataSer._userDisLikedPosts.includes(postKey)) {
           this.snackBar.open('Already polled by you', 'close', {duration: 3000});
         return; }

         if (status) {

           const likedPosts = this.authDataSer._userLikedPosts;
           likedPosts.push(postKey);
           this.postData[postKey]['like'] += 1;
           //this.dataSer._allPostData[postKey]['like'] += 1;
          // this.authSer.onLoginDataProvider.next({'type': 'userLikedPosts', 'data': {'postKey': postKey} , 'success': true});
           this.authSer._database.collection('users').doc(this.authDataSer._uid).update({'likedPosts': likedPosts})
             .then(() => {
              this.authSer._database.collection('posts').doc(postKey).update({'like': this.postData[postKey]['like']})
                .then(() => {})
                .catch(() => {});

               this.snackBar.open('Liked', 'close', {duration: 3000});
             })
             .catch((err) => { this.snackBar.open('unable to like', 'close', {duration: 3000}); });
         } else {
           const dislikedPosts = this.authDataSer._userDisLikedPosts;
           dislikedPosts.push(postKey);
           this.postData[postKey]['dislike'] += 1;
          // this.dataSer._allPostData[postKey]['dislike'] += 1;
           this.authSer.onLoginDataProvider.next({'type': 'userDisLikedPosts', 'data': {'postKey': postKey} , 'success': true});
           this.authSer._database.collection('users').doc(this.authDataSer._uid).update({'disLikedPosts': dislikedPosts})
             .then(() => {

               this.authSer._database.collection('posts').doc(postKey).update({'dislike': this.postData[postKey]['dislike'] + 1})
                 .then(() => {})
                 .catch(() => {});

               this.snackBar.open('disLiked', 'close', {duration: 3000});
             })
             .catch((err) => { this.snackBar.open('unable to dislike', 'close', {duration: 3000}); });



         }
       }
  }

}
