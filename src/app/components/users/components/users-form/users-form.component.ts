import { AfterViewInit, Component, Input, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../interfaces/model';
import {
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
  CustomValidators,
  ConfirmValidParentMatcher,
  regExps,
  errorMessages,
} from '../../../../services/custom-validation';
import { successAlert } from 'src/app/utils/constants';
import { UserService } from '../../services/users.service';
import { UsersListComponent } from '../users-list/users-list.component';

@Component({
  selector: 'app-users-form',
  templateUrl: './users-form.component.html',
  styleUrls: ['./users-form.component.scss'],
})
export class UsersFormComponent implements OnInit, AfterViewInit {
  @Input()
  addOnlyForm: boolean = false;

  updateOnlyForm: boolean = false;

  userForm: FormGroup;

  user: User;

  condata: any;

  tyye: any;

  confirmValidParentMatcher = new ConfirmValidParentMatcher();

  errors = errorMessages;

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
    this.tyye = data.type;
  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
      usertype: ['', [Validators.required]],
      staff_id: ['', [Validators.required]],
      status: [''],
    });

    if (this.tyye === 'add') {
      this.addOnlyForm = true;
    } else if (this.tyye === 'update') {
      this.updateOnlyForm = true;
    }
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

  onAdd() {
    const formValues = this.userForm.getRawValue();
    const postData = {
      ...formValues,
      status: 'Active',
    };
    this.userService.storeResource(postData, 'users/saveUsers').subscribe(
      (res) => {
        successAlert('User Added Successfully');
        this.close();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onUpdate() {}
}
