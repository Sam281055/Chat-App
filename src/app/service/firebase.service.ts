import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import {
  getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile,
  sendPasswordResetEmail
} from '@angular/fire/auth'

import { AngularFirestore } from '@angular/fire/compat/firestore'
import { getFirestore, setDoc, doc, addDoc, collection, collectionData, query } from '@angular/fire/firestore'
import { getDoc, getDocs, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage'
import { getStorage,ref, deleteObject } from 'firebase/storage'
import { UtilsService } from './Utils.service';
import { User } from '../interfaces/user.interface';
import { Message } from '../interfaces/message.interface';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { from, map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  utilsSvc = inject(UtilsService);
  storage = inject(AngularFireStorage)

  app = initializeApp(environment.firebaseConfig);
  db = getFirestore(this.app);

  //Autentication

  getAuth() {
    return getAuth(this.app);
  }

  SignIn(user: User) {
    return signInWithEmailAndPassword(this.getAuth(), user.email, user.password);
  }

  SignUp(user: User) {
    return createUserWithEmailAndPassword(this.getAuth(), user.email, user.password);
  }

  updateUser(displayName: string) {
    return updateProfile(this.getAuth().currentUser!, { displayName });
  }

  //Reestablecer contraseña

  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(this.getAuth(), email,)
  }


  //Cerrar Sesión
  signOut() {
    this.auth.signOut();
    localStorage.removeItem('user');
    return this.utilsSvc.routerLink('/login');
  }
  //Base de Datos

  getCollectionData(path: string, collectionQuery?: any) {
    const ref = collection(getFirestore(), path);
    return collectionData(query(ref, ...collectionQuery), { idField: 'id' });

  }

  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data()
  }

  //Agregar Documento
  addDocument(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data);
  }


  // Obtener Ruta de la Imagen con su Url
  async getFilePath(url: string) {
    return ref(getStorage(), url).fullPath
  }

  // Eliminar Archivo
  deleteFile(path:string){
    return deleteObject(ref(getStorage(),path));
  }
  
  // Enviar Mensaje
  sendMessage(nombre:string, mensaje:string, userId:string){
    // return this.firestore.collection('chats').add({
    // const data={Message: mensaje,
    //   Name: nombre,
    //   Timestamp: String(Date.now())
    //   }
    // });
    // console.log(data);
    
    // const path=`chats/`;
    // return setDoc(doc(getFirestore(), path), data);
    return addDoc(collection(this.db, "chats"),{
      Name: nombre,
      Timestamp: serverTimestamp(),
      Message: mensaje
    })
  }

  getMessage(){
    const querySnapshot = collection(this.db,"chats");
    const q = query(querySnapshot, orderBy('Timestamp', 'desc'));

    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs.map(doc => doc.data() as Message))
    )
      // return from(querySnapshot).pipe(
      //   map(snapshot => snapshot.docs.map(doc => doc.data() as Message))
      // );
  }
}
 // querySnapshot.forEach((doc)=>{
    //   console.log(doc.data());
    //   this.chatRef=doc.data();
    // });