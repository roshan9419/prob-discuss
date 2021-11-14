import { Component, OnInit } from '@angular/core';
import { Question } from 'src/app/core/models/question';
import { DBService } from 'src/app/core/services/db.service';

@Component({
  selector: 'app-home-questions',
  templateUrl: './home-questions.component.html',
  styleUrls: ['./home-questions.component.css']
})
export class HomeQuestionsComponent implements OnInit {

  isLoading: boolean = true
  questionsList: Question[] = []

  tokens: Object =  { nextPageToken: '', previousPageToken: '' };

  constructor(private dbService: DBService) {}

  ngOnInit(): void {
    this.loadRecentQuestions();
  }

  async loadRecentQuestions() {
    try {
      const response = await this.dbService.fetchRecentQuestions();
      response.forEach(quesItem => this.questionsList.push(quesItem));
      if (response.length === 0) {
        console.log("No data available");
      }
      this.isLoading = false;
    } catch (e) {
      console.log(e);
    }
  }

}
