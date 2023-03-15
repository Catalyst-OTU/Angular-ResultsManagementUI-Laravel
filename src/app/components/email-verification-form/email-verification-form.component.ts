import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { StaffService } from '../staff/services/staff.service';
import { successAlert } from '../../utils/constants';
import { errorAlert } from 'src/app/utils/constants';

@Component({
  selector: 'app-email-verification-form',
  templateUrl: './email-verification-form.component.html',
  styleUrls: ['./email-verification-form.component.scss'],
})
export class EmailVerificationFormComponent implements OnInit {
  resetForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<LoginComponent>,
    private staffService: StaffService
  ) {}
  ngOnInit() {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }
  close() {
    this.dialogRef.close();
  }

  sendEmailConfirmation() {
    const email = this.resetForm.getRawValue().email;
    this.staffService.sendEmailVerification(email).subscribe((res) => {
      if (res.success == 1) {
        successAlert('We have sent a reset password link to your email');
      } else if(res.success == 0){
        errorAlert("Invalid Email");
      }
    });
  }



  // sendEmailConfirmation() {
  //   const email = this.resetForm.getRawValue().email;
  //   this.staffService.sendEmailVerification(email).subscribe((res) => {
  //     if (res.success == 1) {
  //       successAlert('Email sent successfully');
  //     } else if (res.ok === false) {
  //       errorAlert('Email not sent!! Check your email address!!');
  //     }
  //   });
  // }
}
