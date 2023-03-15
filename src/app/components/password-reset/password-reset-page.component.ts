import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/auth.service';
import { StaffService } from '../staff/services/staff.service';
import { successAlert } from '../../utils/constants';
@Component({
  selector: 'app-password-reset-page',
  templateUrl: './password-reset-page.component.html',
  styleUrls: ['./password-reset-page.component.scss'],
})
export class PasswordResetPageComponent implements OnInit {
  loginForm!: FormGroup;
  hide = true;
  userDetails: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private staffService: StaffService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(50),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validator: this.checkIFMatchingPasswords('password', 'confirmPassword'),
      }
    );
    this.getDetailsFromToken();
  }

  checkIFMatchingPasswords(
    passwordKey: string,
    passwordConfirmationKey: string
  ) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordKey],
        passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({ notEquivalent: true });
      } else {
        return passwordConfirmationInput.setErrors(null);
      }
    };
  }

  getDetailsFromToken() {
    const token = this.router.url.split('?token=')[1];
    // console.log(token);
    this.staffService.getStaffDetailsWithToken(token).subscribe((res) => {
      if (res) {
        this.userDetails = res;
      }
    });
    console.log(this.userDetails);
  }
  resetPassword() {
    let details = this.userDetails;
    details.password = this.loginForm.value.password;
    this.staffService
      .updatePut(details, 'api/staffs/updateStaffDetailsAfterResetPassword')
      .subscribe((res) => {
        successAlert('Password Reset Successfully');
        this.router.navigate(['/login']);
      });
  }
}
