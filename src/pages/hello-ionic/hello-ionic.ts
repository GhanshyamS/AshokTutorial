import { Component, NgZone,OnInit, ViewRef } from '@angular/core';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
//import { HTTP } from '@ionic-native/http';
import { HttpModule,Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { App, Button } from 'ionic-angular';
import { HtmlParser, TemplateBinding, templateSourceUrl } from '@angular/compiler';

@Component({
    selector: 'page-hello-ionic',
    templateUrl: 'hello-ionic.html'
})
@Injectable()

export class HelloIonicPage implements OnInit {
    userData = null;
    accesstoken = null;
    pageAccessToken = null;
    postMessageString = '';
    isLoggedIn:boolean=false;
    constructor(private facebook: Facebook, private _ngZone: NgZone,
        private http: HttpClient) {

    }
    ngOnInit(){
        
        this.facebook.getLoginStatus().then((response)=>
        {
           console.log("login status",response);
           
          if(response.status==='connected'){
              //show upload button and hide Login button
             this.isLoggedIn=true;
             console.log('THIS IS THE LOGIN STATUS',this.isLoggedIn);
          }
          else{
              this.isLoggedIn = false;
              console.log( 'THIS IS THE LOGIN STATUS',this.isLoggedIn)
              //hide Upload button and show Login Button
          }
    
        });
    }

   
//once we get pageToken save it in storage.
//first step is to check whether we have token in storage or not.
    uploadPhoto(){

      
    
    }

    loginWithFB() {
        this.isLoggedIn=true;
        
        this.userData = '';
        this.facebook.login(['email', 'public_profile', 'user_photos', 'user_friends']).then((response: FacebookLoginResponse) => {

            //this.facebook.api('/me?fields=name,gender,birthday,email,picture', [])
            this.facebook.api('me?fields=id,name,email,picture.width(720).height(720).as(picture_large)', [])
                .then((profile) => {
                    this._ngZone.run(() => { this.userData = profile; });

                });

               
            this.facebook.getAccessToken().then((token) => {
                this.accesstoken = token;
				this.facebook.api('1224449737693349?fields=access_token', ['manage_pages', 'publish_pages','publish_to_groups'])
                .then((p) => {
					
                    this._ngZone.run(() => { this.pageAccessToken = p.access_token; });
                  //  console.log(this.pageAccessToken);
                    this.postMessageString = "&message=K cha damna?";
          //      let a = 'https://graph.facebook.com/v3.2/1224449737693349/feed?message=k cha&access_token='+this.pageAccessToken;
                let c= 'https://graph.facebook.com/v3.2/1224449737693349/photos?url=https://cdn.pixabay.com/photo/2018/06/09/22/56/peacock-3465442__340.jpg&access_token='+this.pageAccessToken;
               console.log(c);
                                this.postMyMessage(null,c).subscribe(
                                    res => {
                                        let b =res;
                                 //       console.log('b',b);
                                    });
    //   this.http.post(a,this.pageAccessToken,null).then((response)=>{
    //                  console.log("this is the response",response)
    //              });

           //     let d='1224449737693349/feed?message=ke cha,method=POST,'+this.pageAccessToken;
              //  console.log(d);
                // let c='1224449737693349/feed?'+'&access_token=' + this.pageAccessToken+'&message=Hello Page World!';
             //   console.log(c);

            
               /*    this.facebook.api(d,[] ).then((post:any)=>{
                       
                          
                         console.log('this is the error for post ',post);
                        
					
                   
                   
                 }).then((er:any)=>{
                     console.log('er '+er);
                 });*/

                
                
                
            });
        });

    });

}



logout(){
    this.isLoggedIn=false;
    this.facebook.logout().then((response)=>{
    
console.log(response);
    });
}

postMethodCall<T>(postContent: any, url: string): Observable<T> {
    return this.http.post<T>(url,null);
}


postMyMessage(fbContent: any,url:string) {
    return this.postMethodCall<any>(fbContent,url);
}
}

    
