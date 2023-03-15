import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { showButton } from 'src/app/interfaces/all-models';
import { Router } from '@angular/router';
@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.css'],
})
export class ErrorDialogComponent implements OnInit {
  dattrue: any;
  rerouter: any;
  constructor(
    private router: Router,
    @Inject(MAT_DIALOG_DATA)
    public data: { message: string; status?: number; internal?: boolean }
  ) {}
  ngOnInit(): void {
    this.reRoute;
  }

  reRoute = () => {
    if (this.dattrue == true && this.router.url == '**') {
      this.rerouter = true;
      this.router.navigate(['/dashboard']);
    }
  };
}
