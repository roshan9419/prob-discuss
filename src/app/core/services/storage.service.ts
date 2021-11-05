import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: AngularFireStorage) { }

  private BUCKET_NAME: string = 'probdiscuss-qna.appspot.com';
  
  getImageUrl(imgPath: string) {
    const encoded = encodeURIComponent(imgPath);
    return `https://firebasestorage.googleapis.com/v0/b/${this.BUCKET_NAME}/o/${encoded}?alt=media`;
  }

  async uploadUserPhoto(userId: string, file: File) {
    const filePath = `users/${userId}`;
    await this.storage.upload(filePath, file);
  }

  async uploadFileForQuestion(questionId: string, files: File[]) {
    const filePaths: string[] = [];
    await Promise.all(files.map(async file => {
      const filePath = `questions/${questionId}/${file.name}`;
      filePaths.push(filePath);
      await this.storage.upload(filePath, file);
    }));
    return filePaths;
  }
}
