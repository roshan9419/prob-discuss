import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Question } from '../models/question';

@Injectable({
  providedIn: 'root'
})
export class DBService {

  constructor(private db: AngularFirestore) { }

  async addNewQuestion(question: Question) {
    const qDocRef = this.db.collection('questions').ref.doc();
    question.questionId = qDocRef.id;
    await qDocRef.set(Object.assign({}, question));
  }
}
