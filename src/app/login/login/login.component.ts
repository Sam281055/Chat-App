import { Component, inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user.interface';
import { FirebaseService } from 'src/app/service/firebase.service';
import { UtilsService } from 'src/app/service/Utils.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  onRegister = false;
  onForgot = false;

  firebaseSvc = inject(FirebaseService);
  utilSvc = inject(UtilsService);
  firestore = inject(AngularFirestore)

  constructor(
    private firebaseService: FirebaseService,
    private router: Router
  ) { }

  formLogin = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
  formRegister = new FormGroup({
    uid: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  formPassword = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  ngOnInit() { }

  toggle() {
    return this.onRegister = !this.onRegister
  }
  toggle2() {
    return this.onForgot = !this.onForgot
  }

  async login() {
    try{
    if (this.formLogin.valid) {
      console.log(this.formLogin.value);

      const loading = await this.utilSvc.loading();
        await loading.present();
        this.firebaseService.SignIn(this.formLogin.value as User).then(res => {
          this.getUserInfo(res.user.uid);

        }).catch(error => {
          console.log(error)
          alert(error)
          this.utilSvc.presentToast({
            message: error.message,
            duration: 2500,
            color: 'primary',
            position: 'middle',
            icon: 'alert-circle-outline'
          })
        })
          .finally(() => {
            loading.dismiss();
          });
      } }catch(error){
        alert(error)
      }
  }
  async getUserInfo(uid: string) {
    if (this.formLogin.valid) {
      const loading = await this.utilSvc.loading();
      await loading.present();
      let path = `users/${uid}`
      this.firebaseSvc.getDocument(path).then((user) => {
        console.log(user);
        this.utilSvc.saveInLocalStorage('user', user);
        this.utilSvc.routerLink('/main/home');
        this.formLogin.reset();
      }).catch(error => {
        console.log(error)
      }).finally(() => {
        loading.dismiss();
      });
    }
  }


  async register() {

    console.log(this.formRegister.value.username);

    const usernameQuerySnapshot = await this.firestore.collection('users', ref => ref.where('name', '==', this.formRegister.value.username)).get().toPromise();
    if (!usernameQuerySnapshot?.empty) {
      this.utilSvc.presentToast({
        message: "Username already taken",
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
      this.utilSvc.routerLink('/login');
      return;
    }
    if (this.formRegister.valid) {
      const loading = await this.utilSvc.loading();
      await loading.present();
      this.firebaseSvc.SignUp(this.formRegister.value as User).then(async res => {
        await this.firebaseSvc.updateUser(this.formRegister.value.username!);
        let uid = res.user.uid;
        this.formRegister.controls.uid.setValue(uid);
        this.setUserInfo(uid)
      }).catch(error => {
        console.log(error)
        this.utilSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        })
      })
        .finally(() => {
          loading.dismiss();
        })
    }
  }
  async setUserInfo(uid: string) {
    if (this.formRegister.valid) {
      const loading = await this.utilSvc.loading();
      await loading.present();
      let path = `users/${uid}`
      delete this.formRegister.value.password;
      this.firebaseSvc.setDocument(path, this.formRegister.value).then(async res => {
        this.utilSvc.saveInLocalStorage('user', this.formRegister.value);
        this.utilSvc.routerLink('/main/home');
        this.formRegister.reset();
      }).finally(() => {
        loading.dismiss();
      }).catch(error => {
        console.log(error)
        this.utilSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        })
      })

    }

  }

  async forgotPassword() {
    if (this.formPassword.valid) {
      const loading = await this.utilSvc.loading();
      await loading.present();
      this.firebaseSvc.sendRecoveryEmail(this.formPassword.value.email!).then(res => {

        this.utilSvc.presentToast({
          message: 'Correo enviado con éxito',
          duration: 1500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        })

        this.utilSvc.routerLink('/auth');
        this.formPassword.reset();
      }).catch(error => {
        console.log(error)
        this.utilSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        })
      })
        .finally(() => {
          loading.dismiss();
        })
    }

  }
}
