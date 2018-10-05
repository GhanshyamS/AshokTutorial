import { Component,NgZone } from '@angular/core';
import {Facebook,FacebookLoginResponse} from '@ionic-native/facebook';

@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage {
  userData=null;
  constructor(private facebook:Facebook,private _ngZone: NgZone) {

  }
  loginWithFB(){
    this.userData = '';
    this.facebook.login(['email','public_profile','user_photos','user_friends']).then((response:FacebookLoginResponse)=>{
      
   //this.facebook.api('/me?fields=name,gender,birthday,email,picture', [])
   this.facebook.api('me?fields=id,name,email,picture.width(720).height(720).as(picture_large)',[])
      .then((profile)=>{
        this._ngZone.run(() => {this.userData = profile; });
          
       // this.userData = {email:profile['email'],first_name:profile['first_name'],picture:profile['picture_large']['data']['url'],username:profile['name']};
      });
    });
      
  }
}
