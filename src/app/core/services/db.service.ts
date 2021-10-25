import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Question } from '../models/question';
import { Answer } from '../models/answer';
import { AnswerType } from '../models/enums/answerType';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class DBService {

  constructor(private db: AngularFirestore) { 
    console.log("DBService Initialized");
  }

  async isUserExists(userId: string) {
    return (await this.db.collection('users').ref.doc(userId).get()).exists;
  }

  async getUser(userId: string) {
    const userDocSnap = await this.db.collection<User>('users').ref.doc(userId).get();
    if (!userDocSnap.exists) {
      throw new Error("No such user found");
    }
    return userDocSnap.data();
  }

  async updateUser(user: User) {
    await this.db.collection('users').doc(user.userId).ref.set(user.toJson());
  }

  async addQuestion(question: Question) {
    const qDocRef = this.db.collection('questions').ref.doc();
    question.questionId = qDocRef.id;
    await qDocRef.set(question.toJson());
  }

  async getQuestionById(questionId: string) {
    const quesDoc = await this.db.collection<Question>('questions').doc(questionId).ref.get();
    if (!quesDoc.exists) {
      throw new Error('Question not found');
    }
    return quesDoc.data();
  }

  async fetchUserQuestions(userId: string, lastFetchedId?: any, limit: number = 10) {
    let query = this.db
      .collection<Question>('questions').ref
      .where('userId', '==', userId)
      .orderBy('askedDate', 'desc')
      .limit(limit);

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

  async fetchRecentQuestions(lastFetchedId?: any, limit = 20) {
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

  async addAnswer(answer: Answer) {
    const aDocRef = this.db.collection('answers').ref.doc();
    answer.answerId = aDocRef.id;
    await aDocRef.set(answer.toJson());
  }

  async fetchAnswersByQuestionId(questionId: string, answerType: AnswerType, lastFetchedId?: any, limit: number = 10) {
    let query = this.db
      .collection<Answer>('answers').ref
      .where('questionId', '==', questionId)
      .limit(limit);

    if (answerType == AnswerType.MOST_VOTED) {
      query = query.orderBy('totalVotes', 'desc');
    }
    // filter by latest
    query = query.orderBy('answeredDate', 'desc');

    if (lastFetchedId) {
      query = query.startAfter(lastFetchedId);
    }

    const answers: Answer[] = [];
    const querySnapshot = await query.get();
    querySnapshot.docs.forEach(answerDoc => {
      answers.push(answerDoc.data());
    });
    console.log(answers);
    return answers;
  }
}
