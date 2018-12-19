import { Component, OnInit } from '@angular/core';
import {AuthDataService} from '../auth-data.service';
import {AuthServiceService} from '../auth-service.service';
import {MatSnackBar} from '@angular/material';
import {AppComponent} from '../app.component';

@Component({
  selector: 'app-createpost',
  templateUrl: './createpost.component.html',
  styleUrls: ['./createpost.component.css']
})
export class CreatepostComponent implements OnInit {

  constructor(private authDataSer: AuthDataService, private authSer: AuthServiceService, private snackBar: MatSnackBar,private appSer:AppComponent) { }

  ngOnInit() {
  }
  public createPost() {
    const postTitle = (<HTMLInputElement>document.getElementById('postTitle')).value;
    const postContent = (<HTMLInputElement>document.getElementById('postContent')).value;
    const genre = (<HTMLInputElement>document.getElementById('genre')).value;
    if (postTitle.trim().length < 6 || postContent.trim().length < 6 || postContent.trim().length > 30) {
      this.snackbarMessage('invalid format');
      return; }
    const post = {
      'like': 0,
      'dislike': 0,
    };
    post['Title'] = postTitle;
    post['Content'] = postContent;
    post['genre'] = genre;
    post['uid'] = this.authDataSer._uid;
    post['displayName'] = this.authDataSer._appComponentLevelUserData.displayName;
    if (!post['displayName']) {
      post['displayName'] = 'Anonymous';
    }
    const date = new Date();
    post['timeStamp'] = date.getTime();
    post['likedUsers'] = [];
    post['dislikedUsers'] = [];
  this.appSer.feedStatus=false;
    this.authSer.createPost(post);

  }
  public snackbarMessage(msg: any) {
    this.snackBar.open(msg, 'close', {duration: 1000});
  }
}
