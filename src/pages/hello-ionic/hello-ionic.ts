import { Component, NgZone,OnInit, ViewRef } from '@angular/core';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
//import { HTTP } from '@ionic-native/http';
import { HttpModule,Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { App, Button } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HtmlParser, TemplateBinding, templateSourceUrl } from '@angular/compiler';
import { SourceMapGenerator } from '@angular/compiler/src/output/source_map';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { ImagePicker, OutputType } from '@ionic-native/image-picker';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import * as $ from "jquery";


@Component({
    selector: 'page-hello-ionic',
    templateUrl: 'hello-ionic.html'
})
@Injectable()

export class HelloIonicPage implements OnInit {
    abc=null;
    userData = null;
    accesstoken = null;
    path="";
    buttonclicked:boolean=false;
    storedtodatabase=null;
    pageAccessToken = null;
    postMessageString = '';
    isLoggedIn:boolean=false;
    constructor(private facebook: Facebook, private _ngZone: NgZone,
        private http: HttpClient,private storage: Storage,private photoLibrary: PhotoLibrary,private imagePicker: ImagePicker,private camera: Camera) {

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

        if(this.storage.get('useraccesstoken')===null)
        {
             this.storedtodatabase=false;
             console.log('this is the stored database resul', this.storedtodatabase);
        }
        else
        {
            this.storedtodatabase=true;
            console.log('this is the stored database resul', this.storedtodatabase);
        }

    }

   
//once we get pageToken save it in storage.
//first step is to check whether we have token in storage or not.
    uploadPhoto(){
      //  this.choosephoto();
      
      this.takephoto();
      console.clear();
      console.log('this is the path',this.path);
      

      
     
      

    
        }


        choosephoto()
        {
            let options={
                title:"select picture",
                message:"please select picture",
                maximumImagesCount:1,
                OutputType:0
            };
            this.imagePicker.getPictures(options).then((results) => {
                for (var i = 0; i < results.length; i++) {
                    console.log('Image URI: ' + results[i]);
                }
        });
    }
     

    takephoto()
    {
        const options: CameraOptions = {
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE
          }
          this.camera.getPicture(options).then((imageData) => {
              this.path=imageData;
              
            //  console.log('this is image data',imageData);
            this.photoLibrary.saveImage(imageData,"app");
            
              this.photoLibrary.getPhoto(imageData).then((res)=>
              {
                  this.path=imageData;
                 //   console.log('this is the blob',res);
              });

           //   this.publishaction();
               
    });
}


//start of login with fb

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
                this.storage.set('useraccesstoken', this.accesstoken).then((res)=>{
                 //  console.log(res);
                });

                
                     this.storage.remove('useraccesstoken').then((res)=>
                     {
                         console.log(' this is stored access token is',res);
                     });










				this.facebook.api('1224449737693349?fields=access_token', ['manage_pages', 'publish_pages','publish_to_groups'])
                .then((p) => {
					
                    this._ngZone.run(() => { this.pageAccessToken = p.access_token;
                    this.storage.set('pageaccesstoken',this.pageAccessToken);
                    });
                  //  console.log(this.pageAccessToken);
                    this.postMessageString = "&message=K cha damna?";
          //      let a = 'https://graph.facebook.com/v3.2/1224449737693349/feed?message=k cha&access_token='+this.pageAccessToken;
                let c= 'https://graph.facebook.com/v3.2/1224449737693349/photos?url=https://cdn.pixabay.com/photo/2018/06/09/22/56/peacock-3465442__340.jpg&access_token='+this.pageAccessToken;
               console.log(c);
                                this.postMyMessage(this.abc,c).subscribe(
                                    res => {
                                        let b =res;
                                 //       console.log('b',b);
                                    });
    
					
                   
                   
                 }).then((er:any)=>{
                     console.log('er '+er);
                 });

                
                
                
            });
        });

    

}


publishaction()
{
    this.abc= new FormData();
   this.abc.append('image',this.abc);
   

    this.facebook.getAccessToken().then((token) => {
        this.accesstoken = token;

        this.facebook.api('1224449737693349?fields=access_token', ['manage_pages', 'publish_pages','publish_to_groups'])
                .then((p) => {
                    this._ngZone.run(() => { this.pageAccessToken = p.access_token;
                        this.storage.set('pageaccesstoken',this.pageAccessToken);
                        });
                      
                      
                  
                //    let c= 'https://graph.facebook.com/v3.2/1224449737693349/photos?url=https://cdn.pixabay.com/photo/2018/06/09/22/56/peacock-3465442__340.jpg&access_token='+this.pageAccessToken;
                 let d='https://graph.facebook.com/v3.2/1224449737693349/photos?source='+this.path+'&access_token='+this.pageAccessToken;
                   console.log(d);
                                    this.postMyMessage(this.abc,d).subscribe(
                                        res => {
                                            let b =res;
                                     //       console.log('b',b);
                                        });


                                      
      
                   


                });
               


    });

}



 PostImageToFacebook()
{
    
    var fd = new FormData();
    fd.append("access_token",this.pageAccessToken);
    fd.append("source", this.path);
    fd.append("message","Photo Text");
    
        $.ajax({
            url:"https://graph.facebook.com/1224449737693349/photos?access_token=" + this.pageAccessToken,
            type:"POST",
            data:fd,
            processData:false,
            contentType:false,
            cache:false,
            success:function(data){
                console.log("success " + data);
            },
            error:function(shr,status,data){
                console.log("error " + data + " Status " + shr.status);
            },
            complete:function(){
                console.log("Posted to facebook");
            }
        });
    }













logout(){
    this.isLoggedIn=false;
    this.facebook.logout().then((response)=>{
    
console.log(response);
    });
}

postMethodCall<T>(postContent: any, url: string): Observable<T> {
    return this.http.post<T>(url,this.abc);
}


postMyMessage(fbContent: any,url:string) {
    return this.postMethodCall<any>(fbContent,url);
}
}


    
