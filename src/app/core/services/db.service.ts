import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Question } from '../models/question';
import { Answer } from '../models/answer';
import { AnswerType } from '../models/enums/answerType';
import { User } from '../models/user';
import { Status } from '../models/enums/status';
import { QnAComment } from '../models/qna-comment';

@Injectable({
  providedIn: 'root'
})
export class DBService {

  constructor(private db: AngularFirestore) { }

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
    await qDocRef.set(this.toJson(question));
    return question.questionId;
  }

  async updateQuestion(question: Question) {
    const qDocRef = await this.db.collection('questions').ref.doc(question.questionId).get();
    if (!qDocRef.exists) {
      throw new Error("Question not found");
    }
    await qDocRef.ref.set(this.toJson(question));
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

  async fetchRecentQuestions(limitSize: number, isForward: boolean, pageToken: string) {
    let query = this.db
      .collection<Question>('questions').ref
      .where('status', '==', Status.ACTIVE)
      .orderBy('askedDate', 'desc')
      .limit(limitSize + 1);

    if (pageToken) {
      const docSnap = await this.db.collection('questions').ref.doc(pageToken).get();
      if (!docSnap.exists) {
        throw new Error("Token not found");
      };
      query = isForward
        ? query.startAt(docSnap).limit(limitSize + 1)
        : query.endBefore(docSnap).limitToLast(limitSize + 1);
    }

    let questions: Question[] = [];
    const querySnapshot = await query.get();
    querySnapshot.docs.forEach(questionDoc => {
      questions.push(questionDoc.data());
    });

    let nextPageToken = null, prevPageToken = null;

    if (isForward) {
      if (questions.length === limitSize + 1) {
        nextPageToken = questions[questions.length - 1].questionId;
        questions.splice(-1); // delete extra last element from list
      } else {
        nextPageToken = null;
      }
      if (pageToken) prevPageToken = questions[0].questionId;
    } else {
      if (questions.length === limitSize + 1) {
        prevPageToken = questions[1].questionId;
        questions = questions.slice(1); // delete first element
      } else {
        prevPageToken = null;
      }
      nextPageToken = pageToken;
    }

    return {
      resultList: questions,
      nextPageToken: nextPageToken,
      prevPageToken: prevPageToken
    };
  }

  async addAnswer(answer: Answer) {
    const aDocRef = this.db.collection('answers').ref.doc();
    answer.answerId = aDocRef.id;
    await aDocRef.set(this.toJson(answer));
  }

  async fetchAnswersByQuestionId(questionId: string, answerType: AnswerType, lastFetchedId?: any, limit: number = 10) {
    let query = this.db
      .collection<Answer>('answers').ref
      .where('questionId', '==', questionId)
      .where('status', '==', Status.ACTIVE)
      .limit(limit);

    if (answerType === AnswerType.MOST_VOTED) {
      query = query.orderBy('totalVotes', 'desc').orderBy('answeredDate', 'desc');
    } else if (answerType === AnswerType.OLDEST) {
      query = query.orderBy('answeredDate', 'asc');
    } else {
      query = query.orderBy('answeredDate', 'desc');
    }

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

  async getUsers(userIds: string[]) {
    const usersMap = new Map<string, User>();
    const batchSize = 10;
    for (let i = 0; i < userIds.length; i += batchSize) {
      const batchIds = userIds.slice(i, i + batchSize > userIds.length ? userIds.length : i + batchSize);

      const constraints = this.db
        .collection<User>('users').ref
        .where('userId', 'in', batchIds);

      const querySnapshot = await constraints.get();
      querySnapshot.docs.forEach(element => {
        usersMap.set(element.id, element.data());
      });
    }
    return usersMap;
  }

  async addRemoveQuesUpvote(questionId: string, userId: string, isAdd: boolean): Promise<Question | null> {
    let updatedQues: Question | null = null;
    try {
      await this.db.firestore.runTransaction(async (t) => {
        const quesDocSnap = await t.get(this.db.collection<Question>('questions').doc(questionId).ref);
        if (!quesDocSnap.exists) {
          throw new Error("Question not found");
        }

        const ques = quesDocSnap.data()!;
        if (ques.upvotes === undefined) {
          ques.upvotes = [];
        }

        if (ques.upvotes.includes(userId)) {
          if (isAdd) throw new Error("Already added your vote");
        } else {
          if (!isAdd) throw new Error("You have not upvoted this question");
        }

        if (isAdd) {
          ques.upvotes.push(userId);
          ques.totalVotes++;
        } else {
          const idx = ques.upvotes.indexOf(userId);
          if (idx != -1) {
            ques.upvotes.splice(idx, 1);
            ques.totalVotes--;
          }
        }

        t.update(quesDocSnap.ref, this.toJson(ques));
        updatedQues = ques;
      });
    } catch (e) {
      throw e;
    }
    return updatedQues;
  }

  async addRemoveAnsUpvote(answerId: string, userId: string, isAdd: boolean): Promise<Answer | null> {
    let updatedAns: Answer | null = null;
    try {
      await this.db.firestore.runTransaction(async (t) => {
        const ansDocSnap = await t.get(this.db.collection<Answer>('answers').doc(answerId).ref);
        if (!ansDocSnap.exists) {
          throw new Error("Answer not found");
        }

        const ans = ansDocSnap.data()!;
        if (ans.upvotes === undefined) {
          ans.upvotes = [];
        }

        if (ans.upvotes.includes(userId)) {
          if (isAdd) throw new Error("Already added your vote");
        } else {
          if (!isAdd) throw new Error("You have not upvoted this answer");
        }

        if (isAdd) {
          ans.upvotes.push(userId);
          ans.totalVotes++;
        } else {
          const idx = ans.upvotes.indexOf(userId);
          if (idx != -1) {
            ans.upvotes.splice(idx, 1);
            ans.totalVotes--;
          }
        }

        t.update(ansDocSnap.ref, this.toJson(ans));
        updatedAns = ans;
      });
    } catch (e) {
      throw e;
    }
    return updatedAns;
  }

  async addCommentOnQnA(qnaComment: QnAComment, isQuestionComment: boolean) {
    const qnaId: string = qnaComment.qnaId;
    const qnaDocRef = await this.db.collection(isQuestionComment ? 'questions' : 'answers').doc(qnaId).ref.get()

    if (!qnaDocRef.exists) {
      throw new Error("Document not found");
    }

    const commentsColRef = qnaDocRef.ref.collection('comments');
    const commentDocRef = commentsColRef.doc();
    qnaComment.commentId = commentDocRef.id;
    await commentDocRef.set(this.toJson(qnaComment));
  }

  async fetchQnAComments(qnaId: string, isQuestionComment: boolean) {
    const querySnapshot = await this.db
      .collection(isQuestionComment ? 'questions' : 'answers')
      .doc(qnaId).collection<QnAComment>('comments').ref.get();

    const comments: QnAComment[] = [];
    querySnapshot.docs.forEach((comment) => {
      comments.push(comment.data());
    });

    return comments;
  }
}