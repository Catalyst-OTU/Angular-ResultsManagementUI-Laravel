import { AfterViewInit, Component, Input, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../interfaces/model';
import {
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { UserService } from '../../services/users.service';
import { UsersListComponent } from '../users-list/users-list.component';

@Component({
  selector: 'app-users-info',
  templateUrl: './users-info.component.html',
  styleUrls: ['./users-info.component.css'],
})
export class UsersInfoComponent implements OnInit, AfterViewInit {
  userForm: FormGroup;

  user: User;

  condata: any;

  usertypes = [
    { id: 1, name: 'Instructor' },
    { id: 2, name: 'Course Cordinator' },
    { id: 3, name: 'Director of Studies' },
    { id: 4, name: 'Academic Secretary' },
  ];
  statusList = [
    { name: 'Active', value: 'Active' },
    { name: 'InActive', value: 'InActive' },
  ];
  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UsersListComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.condata = data;
  }
  ngOnInit(): void {
    this.userForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
      usertype: ['', [Validators.required]],
      staff_id: ['', [Validators.required]],
      status: [''],
    });
    this.userForm.disable();
  }

  close() {
    this.dialogRef.close();
  }

  ngAfterViewInit() {
    if (this.condata?.id) {
      this.user = { ...this.condata };
      const formValues: any = { ...this.user };
      Promise.resolve().then(() => this.userForm.patchValue(formValues));
    }
  }
}
