import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-qna-user-info',
  templateUrl: './qna-user-info.component.html',
  styleUrls: ['./qna-user-info.component.css']
})
export class QnaUserInfoComponent implements OnInit {

  @Input() name: string | undefined | null = ''
  @Input() userId: string | undefined | null = ''
  @Input() imageUrl: string = 'https://firebasestorage.googleapis.com/v0/b/probdiscuss-qna.appspot.com/o/users%2Fdefault?alt=media'
  @Input() date: Date | undefined | null
  @Input() isQues!: boolean

  constructor() { }

  ngOnInit(): void {
  }

}
