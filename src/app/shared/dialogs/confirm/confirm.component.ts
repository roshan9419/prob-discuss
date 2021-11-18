import { Component, OnInit } from '@angular/core';
import { DialogService } from 'src/app/core/services/dialog.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {
  message: any = '';

  constructor(private dialogService: DialogService) { }

  ngOnInit(): void {
    this.dialogService.getMessage().subscribe((message: any) => {
      this.message = message;
    });
  }

}
