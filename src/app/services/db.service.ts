import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Question } from '../models/question';

@Injectable({
  providedIn: 'root'
})
export class DBService {

  constructor(private db: AngularFirestore) { }

  async fetchRecentQuestions(lastFetchedId?: any, limit = 10) {
    let query = this.db.collection<Question>('questions').ref.orderBy('askedDate', 'desc').limit(limit);
    if (lastFetchedId) {
      query = query.startAfter(lastFetchedId);
    }

    const questions: Question[] = [];
    const querySnapshot = await query.get();
    querySnapshot.docs.forEach(questionDoc => {
      questions.push(questionDoc.data());
    });
    return questions;
  }

  async addNewQuestion(question: Question) {
    const qDocRef = this.db.collection('questions').ref.doc();
    question.questionId = qDocRef.id;
    await qDocRef.set(question.toJson());
  }
}
