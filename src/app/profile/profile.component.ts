import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Answer } from '../core/models/answer';
import { Question } from '../core/models/question';
import { User } from '../core/models/user';
import { DBService } from '../core/services/db.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  active = 1;
  activityTabs: string[] = ['Questions','Answers'];
  selectedActTab = this.activityTabs[0];

  user: User = new User();

  questionsList: Question[] = [];
  answersList: Answer[] = [];

  isProfileLoading: boolean = true;
  isActivityLoading: boolean = true;

  currentActIndex: number = 0;

  constructor(private activatedroute: ActivatedRoute, private route: Router, private dbService: DBService) { }

  ngOnInit(): void {
    this.activatedroute.params.subscribe(
      params => {
        this.user.userId = params.userId;
        console.log(this.user.userId);
        if (!this.user.userId) {
          console.log("Url not found");
          this.route.navigateByUrl('404');
        }
        this.loadProfile();
      }
    );
  }

  async loadProfile() {
    try {
      const res = await this.dbService.getUser(this.user.userId);
      if (res) this.user = res;
      await this.loadUserQuestions();
      await this.loadUserAnswers();
      this.isProfileLoading = false;
    } catch (error) {
      this.route.navigateByUrl('404');
    }
  }

  async loadUserQuestions() {
    this.questionsList = await this.dbService.fetchUserQuestions(this.user.userId);  
  }

  async loadUserAnswers() {
    this.answersList = await this.dbService.fetchUserAnswers(this.user.userId);  
  }

  onViewQuestion(questionId: string) {
    this.route.navigateByUrl(`/question/${questionId}`);
  }

  switchTab(index: number) {
    if (index === this.currentActIndex) return;
    console.log("Switched to Tab", index);
    if (index === 0) {
      // fetch questions
      this.loadUserQuestions();
    } else {
      // fetch answers
      this.loadUserAnswers();
    }
    this.currentActIndex = index;
  }

}
