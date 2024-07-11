import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Message } from '../interfaces/message.interface';

@Injectable({providedIn: 'root'})
export class MessageService {
    constructor(private firestore: AngularFirestore) { }

  getMessages(): Observable<Message[]> {
    return this.firestore.collection<Message>('messages', ref => ref.orderBy('timestamp')).valueChanges();
  }

  sendMessage(content: string, user: string) {
    const timestamp = new Date().getTime();
    this.firestore.collection('messages').add({ content, timestamp, user });
  }

}