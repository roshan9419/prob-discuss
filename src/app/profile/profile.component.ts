import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Answer } from '../core/models/answer';
import { Question } from '../core/models/question';
import { User } from '../core/models/user';
import { AuthService } from '../core/services/auth.service';
import { DBService } from '../core/services/db.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  activityTabs: string[] = ['Questions', 'Answers'];
  selectedActTab: string = this.activityTabs[0];

  // loggedUserId: string = ''
  viewUserObj: User = new User();

  questionsList: Question[] = [];
  answersList: Answer[] = [];

  isProfileLoading: boolean = true;

  // Skills
  isEditSkillEnabled: boolean = false;
  userEditSkills: string[] = [];
  skillInp: string = '';


  constructor(private activatedroute: ActivatedRoute, private route: Router, private dbService: DBService, private authService: AuthService) { }

  ngOnInit(): void {
    this.activatedroute.params.subscribe(
      params => {
        if (!params.userId) {
          console.log("Url not found");
          this.route.navigateByUrl('404');
        }
        this.loadProfile(params.userId);
      }
    );
  }

  async loadProfile(userId: string) {
    try {
      const res = await this.dbService.getUser(userId);
      if (res) {
        this.viewUserObj = res;
        if (this.viewUserObj.skills) {
          this.userEditSkills = [];
          this.viewUserObj.skills?.forEach(skill => this.userEditSkills.push(skill));
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
    this.questionsList = await this.dbService.fetchUserQuestions(this.viewUserObj.userId);
  }

  async loadUserAnswers() {
    this.answersList = await this.dbService.fetchUserAnswers(this.viewUserObj.userId);
  }

  toggleEditSkillBtn() {
    this.isEditSkillEnabled = !this.isEditSkillEnabled;
    if (!this.isEditSkillEnabled) {
      if (this.viewUserObj.skills) {
        this.userEditSkills = [];
        this.viewUserObj.skills?.forEach(skill => this.userEditSkills.push(skill));
      }
      console.log("Cancel Tapped");
    }
  }

  async saveUserSkills() {
    this.viewUserObj.skills = this.userEditSkills;
    await this.dbService.updateUser(this.viewUserObj);
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

  isUserOwnProfile() {
    return (this.authService.userId === this.viewUserObj.userId);
  }

}
