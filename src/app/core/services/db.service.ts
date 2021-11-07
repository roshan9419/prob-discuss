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

  toJson(data: Object) {
    return Object.assign({}, data);
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
    console.log(user);
    await this.db.collection('users').doc(user.userId).ref.set(this.toJson(user));
  }

  async addQuestion(question: Question) {
    const qDocRef = this.db.collection('questions').ref.doc();
    question.questionId = qDocRef.id;
    await qDocRef.set(question.toJson());
    return question.questionId;
  }

  async updateQuestion(question: Question) {
    const qDocRef = await this.db.collection('questions').ref.doc(question.questionId).get();
    if (!qDocRef.exists) {
      throw new Error("Question not found");
    }
    await qDocRef.ref.set(question.toJson());
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
    return answers;
  }

  async fetchUserAnswers(userId: string, limit: number = 10) {
    const query = this.db
      .collection<Answer>('answers').ref
      .where('userId', '==', userId)
      .orderBy('answeredDate', 'desc')
      .limit(limit);

      const answers: Answer[] = [];
      const querySnapshot = await query.get();
      querySnapshot.docs.forEach(answerDoc => {
        answers.push(answerDoc.data());
      });
      return answers;
  }
}
