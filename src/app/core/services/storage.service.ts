import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: AngularFireStorage) { }

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
