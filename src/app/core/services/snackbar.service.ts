import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { SnackbarType } from '../models/enums/snackbarType';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  private subject = new Subject<any>();
  
  constructor() { 
    console.log("Snackbar Service initialized");
  }

  showSnackbar(message: string, type: SnackbarType) {
    this.setSnackbar(message, type);
  }

  setSnackbar(message: string, type: SnackbarType) {
    let that = this;
    this.subject.next({
      type: type,
      text: message,
    });

  }
  
  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}