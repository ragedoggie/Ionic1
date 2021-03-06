import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { HomePage } from '../home/home';
/**
 * Generated class for the AddRoomPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-room',
  templateUrl: 'add-room.html',
})
export class AddRoomPage {
roomReference;
messagesList;
newmessage;
newRoom;
finder;
findRoomName;
roomCalling;
roomName;
addedRoom = false;
password;
name;
passwordRef;
enterPassword;
callingPassword;
checkRoom;
foundRoom = false;
foundPassword;
passwordString;
start;
user;
email;
emailCut;
username;
usernameString;
usernameCut;
addRoomPass;
roomCallingName;
  constructor(public navCtrl: NavController, public navParams: NavParams, public alert: AlertController, public fAuth: AngularFireAuth) {
  this.roomReference = firebase.database().ref('privateRooms');
  
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddRoomPage');
    // this.alert.create({
  	// 	title:'Username',
  	// 	inputs:[{
  	// 		name:'username',
  	// 		placeholder: 'username'
  	// 	}],
  	// 	buttons:[{
  	// 		text: 'Continue',
  	// 		handler: username =>{
  	// 			this.name = username
  	// 		}
  	// 	}]
    // }).present();
    this.user = firebase.auth().currentUser;
      if (this.user != null) {
        this.email = this.user.email;
        console.log(this.email);
        this.emailCut = this.email.split('@')[0];
      } else {
        this.navCtrl.push('LoginScreenPage');
      }
      this.name = firebase.database().ref('users/'+this.emailCut);
      this.name.on('value',data => {
        let nameBase = [];
        data.forEach( data => {
          nameBase.push({
            username: data.val().username
          })
        });
        this.username = nameBase;
        console.log(this.username);
        this.usernameString = JSON.stringify(this.username);
        console.log(this.usernameString);
        this.usernameCut = this.usernameString.substring(14, this.usernameString.length-3);
        console.log(this.usernameCut);
      });
  }

  addRoom() {
    this.newRoom = (<HTMLInputElement>document.getElementById("new")).value;
    this.password = (<HTMLInputElement>document.getElementById("pwd")).value;
    this.roomCalling = firebase.database().ref('privateRooms/'+this.newRoom);
    console.log(this.newRoom);
    console.log(this.password);
    this.addedRoom = true;
    this.foundRoom = false;
    // this.roomCallingPass.on('value', data => {
    //   let recreated = [];
    //   data.forEach( data => {
    //     recreated.push({
    //       password: data.val().password
    //     })
    //   });
    //   this.addRoomPass = recreated;
    //   console.log(this.addRoomPass);
    //   if (this.password !== this.addRoomPass) {
    //     this.alert.create({
    //       title: 'Room Already Exists!',
    //       buttons: [{
    //         text: 'Ok',
    //       }]
    //     }).present();
    //   } else {
        this.alert.create ({
          title: 'New Room: '+this.newRoom,
          buttons: [{
            text: 'Got it!'
          }
        ]
        }).present();
        this.roomCalling.push({
          password: this.password
        });
    //   }
    // });
    
    
  }

  findRoom(){
    this.findRoomName = (<HTMLInputElement>document.getElementById("look")).value;
    this.finder = firebase.database().ref('privateRooms/'+this.findRoomName);
    this.enterPassword = (<HTMLInputElement>document.getElementById("enterPwd")).value;
    this.passwordRef = firebase.database().ref('privateRooms/'+this.findRoomName).limitToFirst(1);
    this.passwordRef.on('value', data => {
      let findingPass = [];
      data.forEach( data => {
        findingPass.push({
          password: data.val().password
        })
      });
      this.callingPassword = findingPass;
      console.log(this.callingPassword);
      this.foundPassword = JSON.stringify(this.callingPassword);
      console.log(this.foundPassword);
      this.passwordString = this.foundPassword.substring(14, this.foundPassword.length-3);
      console.log(this.passwordString);
    if (this.passwordString == this.enterPassword) {
      this.foundRoom = true;
      this.addedRoom = false;
      console.log("password matches!");
      this.finder.on('value',data => {
        let privRm = [];
        data.forEach( data => {
          privRm.push({
            username: data.val().username,
            message: data.val().message,
            time: data.val().time
          })
        });
        this.messagesList = privRm;
      });
      this.alert.create({
        title: 'Found Room!',
        buttons: [{
          text: 'Ok',
        }]
      }).present();
    }
    if (this.passwordString !== this.enterPassword) {
      console.log("not matching");
      this.alert.create({
        title: 'Incorrect Password or Room Does Not Exist!',
        buttons: [{
          text: 'Ok',
        }]
      }).present();
    }
    });
  }

  send() {
    this.start = new Date().toLocaleString();
    // if (this.newmessage.length > 22) {
    // code to split message into multiple lines if too long!
    // }
    if (this.addedRoom == true && this.foundRoom == false) {
      this.roomCalling.push({
      username: this.usernameCut,
      message: this.newmessage,
      time: this.start
    });
    this.roomCalling.on('value',data => {
      let rm2 = [];
      data.forEach( data => {
        rm2.push({
          username: data.val().username,
          message: data.val().message,
          time: data.val().time
        })
      });
      this.messagesList = rm2;
      });
  } else if (this.foundRoom == true && this.addedRoom == false) {
      this.finder.push({
        username: this.usernameCut,
        message: this.newmessage,
        time: this.start
      });
        this.finder.on('value',data => {
          let founded = [];
          data.forEach( data => {
            founded.push({
              username: data.val().username,
              message: data.val().message,
              time: data.val().time
            })
          });
          this.messagesList = founded;
          });
    } else {
      this.alert.create({
        title: 'Make/Find a Room First!',
        buttons: [{
          text: 'Ok',
        }]
      }).present();
    }
    this.newmessage = "";
  }

  wait(ms){
    var end = this.start;
    while(end < this.start + ms) {
      end = new Date().getTime();
   }
 }
  logout() {
    this.fAuth.auth.signOut();
    console.log("Logged out");
    this.navCtrl.setRoot(HomePage);
  }
}
