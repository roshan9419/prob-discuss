import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  nextPageToken: string | null | undefined
  prevPageToken: string | null | undefined

  constructor(private dbService: DBService, private activatedroute: ActivatedRoute, private route: Router) { }

  ngOnInit(): void {
    this.activatedroute.queryParams.subscribe(
      params => {
        console.log(params);
        this.loadRecentQuestions(params.pageToken, params.f);
      }
    );
    console.log('Here');
  }

  async loadRecentQuestions(pageToken: string, forward: boolean | undefined) {
    try {

      this.nextPageToken = null;
      this.prevPageToken = null;

      if (!forward) forward = true;
      const response = await this.dbService.fetchRecentQuestions(5, forward, pageToken);
      if (!response) {
        this.route.navigateByUrl('404');
        return;
      }

      console.log(response);

      this.nextPageToken = response.nextPageToken;
      this.prevPageToken = response.prevPageToken;
      this.questionsList = [];
      response.resultList.forEach(quesItem => this.questionsList.push(quesItem));
      if (response.resultList.length === 0) {
        console.log("No data available");
      }

      this.isLoading = false;
    } catch (e) {
      console.log(e);
    }
  }

}
