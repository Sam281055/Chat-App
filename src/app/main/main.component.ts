import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../service/firebase.service';
import { user } from '@angular/fire/auth';
import { User } from '../interfaces/user.interface';
import { UtilsService } from '../service/Utils.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent  implements OnInit {

  User:any;
  username='';
  constructor(
    private firebaseService:FirebaseService,
    private utilsvc:UtilsService
  ) { }

  ngOnInit(){
    this.User=JSON.parse(window.localStorage.getItem("user")!);
    console.log(this.User);
    this.username= this.User!.username;
    console.log(this.username);
  }
  onSala1(){
    return this.utilsvc.routerLink("/sala1");
  }

  logout(){
    return this.firebaseService.signOut();
  }
}
