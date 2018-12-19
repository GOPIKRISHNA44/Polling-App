import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {AuthServiceService} from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class DataProviderService {
  public sampleRef: any;
  private database: any;
  private allPostsData: any = {};
  public allPostsDataProvider = new BehaviorSubject<any>(this.sampleRef);
  constructor(private auth: AuthServiceService) {
   this.database = this.auth._database;
   // pre calculate the data
    this.collectGlobalPosts();

  }
  collectGlobalPosts() {
    const docRef = this.database.collection('posts');
    docRef.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.data());
        this.allPostsData[doc.id] = doc.data();
      });
      this.allPostsDataProvider.next(this.allPostsData);
    });

  }
  get _allPostData()
  {
    return this.allPostsData;
  }

}
