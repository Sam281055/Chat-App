import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../service/Utils.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FirebaseService } from '../service/firebase.service';
import { initializeApp } from "firebase/app";
import { collection, doc, getDoc, getDocs, getFirestore } from "firebase/firestore";
import { environment } from 'src/environments/environment';
import { Message } from '../interfaces/message.interface';
import { from, map } from 'rxjs';
@Component({
  selector: 'app-sala1',
  templateUrl: './sala1.component.html',
  styleUrls: ['./sala1.component.scss'],
})
export class Sala1Component  implements OnInit {

  text?:string;
  chatRef!:Message[];
  uid!:string;
  datos:any;
  username!:string;

  constructor(
    private utilsvc:UtilsService,
    private fs:AngularFirestore,
    private firebaseSvc:FirebaseService
  ) { 
  }

  ngOnInit() {
    this.datos=JSON.parse(window.localStorage.getItem("user")!);
    this.username=this.datos!.username;
    this.uid=this.datos!.uid;
    this.getChats()

    // this.chatRef= this.fs.collection('chats').valueChanges().subscribe();
    console.log(this.chatRef);
  }
  async getChats(){
    return this.firebaseSvc.getMessage().subscribe((data:Message[])=>{
      console.log(data);
      this.chatRef=data;
    });
  }
  send(){
    if(this.text != ''){
      console.log(this.datos);
      console.log(this.username);
      console.log(this.uid);
      this.firebaseSvc.sendMessage(this.username!, this.text!, this.uid!);
      this.getChats();
      this.text='';
    }    
  }
  
  formatDateTime(timestamp: any): string {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return timestamp?.toDate().toLocaleString([], options);
  }


  volver(){
    return this.utilsvc.routerLink('/main/home');
  }
}
