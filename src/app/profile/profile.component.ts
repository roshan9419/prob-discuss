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

  activityTabs: string[] = ['Questions', 'Answers'];
  selectedActTab: string = this.activityTabs[0];

  user: User = new User();

  questionsList: Question[] = [];
  answersList: Answer[] = [];

  isProfileLoading: boolean = true;

  // Skills
  isEditSkillEnabled: boolean = false;
  userEditSkills: string[] = [];
  skillInp: string = '';


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
      if (res) {
        this.user = res;
        if (this.user.skills) {
          this.user.skills?.forEach(skill => this.userEditSkills.push(skill));
        }
      }
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

  toggleEditSkillBtn() {
    this.isEditSkillEnabled = !this.isEditSkillEnabled;
    if (!this.isEditSkillEnabled) {
      console.log(this.user.skills);
      if (this.user.skills) {
        this.userEditSkills = [];
        this.user.skills?.forEach(skill => this.userEditSkills.push(skill));
      }
      console.log("Cancel Tapped");
    }
  }

  async saveUserSkills() {
    this.user.skills = this.userEditSkills;
    await this.dbService.updateUser(this.user);
    this.isEditSkillEnabled = false;
  }

  addNewSkill() {
    console.log(this.skillInp);
    if (this.skillInp) {
      this.userEditSkills.push(this.skillInp);
      this.skillInp = '';
    }
  }

  onSkillTapped(skill: string) {
    console.log(skill);
    if (!this.isEditSkillEnabled) return;
    const skillIdx = this.userEditSkills.indexOf(skill);
    console.log(skillIdx);
    if (skillIdx !== -1) {
      this.userEditSkills.splice(skillIdx, 1);
    }
  }

}
