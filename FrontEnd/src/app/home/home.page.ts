import { Component } from '@angular/core';
import {Socket} from 'ngx-socket-io';
import { log } from 'util';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  message = '';
  messages = [];
  currentUser = '';

  constructor(private socket: Socket, private toastCtrl: ToastController) {}

  ngOnInit(){
    this.socket.connect();
    console.log('check');
    

    let name = `User-${new Date().getTime()}`;
    this.currentUser = name;

    this.socket.emit('set-name',name);

    this.socket.fromEvent('users-changed').subscribe(data =>{ 
      console.log('got data', data);
      let user = data['user'];
      if(data['event'] == 'left'){
        this.showToast(`User left; ${user}`);
      }else{
        this.showToast(`User joined; ${user}`)
      }
      
    });
    this.socket.fromEvent('message').subscribe(message =>{
      console.log('New: ', message);
      this.messages.push(message)
      
    })

  }

//  Sending message
  sendMessage(){
    this.socket.emit('send-message', {text: this.message});
    this.message = '';
  }

  // when you leave the page
  ionViewWillLeave(){
    this.socket.disconnect();
  }

  async showToast(msg){
    let toast = await this.toastCtrl.create({
      message:msg,
      position:'top',
      duration:2000
    });
    toast.present();
  }


}
