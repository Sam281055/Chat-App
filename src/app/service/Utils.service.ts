import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, AlertOptions, LoadingController, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  modalCtrl = inject(ModalController);
  alertCtrl = inject(AlertController);
  router = inject(Router);






  async presentAlert(opts:AlertOptions) {
    const alert = await this.alertCtrl.create(opts);
    await alert.present();
  }

//loading

  loading() {
    return this.loadingCtrl.create({ spinner: 'crescent' })
  }


  //Toast
  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }

  //Enrutamiento
  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  //Guardar en localStorage
  saveInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  //Obtener elemento de localStorage
  getFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key)!);
  }

  //ModalCtrl
  async presentModal(opts: ModalOptions){
    const modal = await this.modalCtrl.create(opts);
    await modal.present();

    const {data} = await modal.onWillDismiss();
    if(data) return data;
  }
  dismissModal(data?:any){
    return this.modalCtrl.dismiss(data);
  }
}
