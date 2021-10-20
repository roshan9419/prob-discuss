import { Component, OnInit } from '@angular/core';
import { DBService } from 'src/app/services/db.service';
import { Question } from 'src/app/models/question';

@Component({
  selector: 'app-home-questions',
  templateUrl: './home-questions.component.html',
  styleUrls: ['./home-questions.component.css']
})
export class HomeQuestionsComponent implements OnInit {

  questionsList: Question[] = []

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
    } catch (e) {
      console.log(e);
    }
  }

}
