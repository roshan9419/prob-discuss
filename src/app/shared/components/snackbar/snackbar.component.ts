import { Component, Input, OnInit } from '@angular/core';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.css']
})
export class SnackbarComponent implements OnInit {

  message: any;
  constructor(private snackbarService: SnackbarService) { }

  ngOnInit(): void {
    this.snackbarService.getMessage().subscribe((message: any) => {
      this.message = message;
      const x = document.getElementById("snackbar");
      x!.className = "show";
      setTimeout(function () { x!.className = x!.className.replace("show", ""); }, 3000);
    });
  }
}
