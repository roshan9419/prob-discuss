import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  // baseUrl: string = 'http://localhost:8000/';
  baseUrl: string = 'https://probdiscuss-api.herokuapp.com/';

  async onQuestionAdded(questionId: string) {
    const token = await this.authService.getUserToken();
    // console.log(token);
    if (!token) throw Error("Please try again!");
    this.http.post<any>(this.baseUrl + 'questions', { questionId: questionId }, {
      headers: {
        authorization: token
      }
    }).subscribe(resp => {
      // console.log(resp);
    });
  }
}
