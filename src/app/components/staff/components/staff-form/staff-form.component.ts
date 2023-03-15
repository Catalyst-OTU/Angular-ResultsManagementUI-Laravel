import { AfterViewInit, Component, Input, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Staff } from '../../interfaces/models';
import {
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { StaffListComponent } from '../staff-list/staff-list.component';
import {
  CustomValidators,
  ConfirmValidParentMatcher,
  regExps,
  errorMessages,
} from '../../../../services/custom-validation';
import { CoursesService } from '../../../courses/services/course.service';
import { StaffService } from '../../services/staff.service';
import { successAlert } from 'src/app/utils/constants';
import { UserService } from '../../../users/services/users.service';

@Component({
  selector: 'app-staff-form',
  templateUrl: './staff-form.component.html',
  styleUrls: ['./staff-form.component.css'],
})
export class StaffFormComponent implements OnInit, AfterViewInit {
  confirmValidParentMatcher = new ConfirmValidParentMatcher();

  errors = errorMessages;
  usertypes = [
    { id: 1, name: 'Director of Studies' },
    { id: 2, name: 'Academic Secretary' },
    //{ id: 3, name: 'Course Cordinator' },
    { id: 4, name: 'Faculty' },
    //{ id: 4, name: 'Instructor' },
  ];
  statusList = [
    { name: 'Active', value: 'Active' },
    { name: 'InActive', value: 'InActive' },
  ];
  @Input()
  addOnlyForm: boolean = false;
  addCourseForm: boolean = false;
  updateOnlyForm: boolean = false;

  staffForm: FormGroup;
  courseForm: FormGroup;
  courseList: any[];
  staff: Staff;
  condata: any;
  tyye: any;
  constructor(
    private fb: FormBuilder,
    private courseService: CoursesService,
    private dialogRef: MatDialogRef<StaffListComponent>,
    private staffService: StaffService,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    (this.condata = data), (this.tyye = data.type);
  }

  ngOnInit(): void {
    this.staffForm = this.fb.group({
      staff_id: [''],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      email: ['', [Validators.email, Validators.required]],
      contact: [
        '',
        [
          Validators.pattern('[0-9]+'),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      usertype: ['', [Validators.required]],
      course: [''],
      status: [''],
      password: [''],
    });
    this.courseForm = this.fb.group({
      course: [''],
    });
    this.loadCourses();
    if (this.tyye === 'add') {
      this.addOnlyForm = true;
    } else if (this.tyye === 'course') {
      this.addCourseForm = true;
    } else if (this.tyye === 'update') {
      this.updateOnlyForm = true;
    }
  }

  close() {
    this.dialogRef.close();
  }

  loadCourses = () => {
    this.courseService.getAllCourse().subscribe((courses) => {
      this.courseList = courses
        .filter((stud) => stud.status === 'Active')
        .map(({ id, course_name, course_level }) => ({
          id,
          course_name,
          course_level,
        }));
    });
  };

  ngAfterViewInit() {
    if (this.condata?.id) {
      this.staff = { ...this.condata };
      const formValues: any = { ...this.staff };
      Promise.resolve().then(() => this.staffForm.patchValue(formValues));
    }
  }

  onAdd() {
    if (this.staffForm.valid) {
      const formValues = this.staffForm.getRawValue();
      const staffData = {
        staff_id: formValues.staff_id,
        name: formValues.name,
        email: formValues.email,
        contact: formValues.contact,
        usertype: formValues.usertype,
        course_id: formValues.course,
        status: 'Active',
      };
      const userData = {
        password: formValues.password,
        email: formValues.email,
        usertype: formValues.usertype,
        status: 'Active',
        staff_id: formValues.staff_id,
      };
      // this.staffService
      //   .storeResource(userData, 'users/saveUsers')
      //   .subscribe((d: any) => {
      //     console.log('doine');
      //     // this.close()
      //     // successAlert('Staff Created Successfully')
      //   });

      this.staffService
        .storeResource(staffData, 'api/staffs/saveStaff')
        .subscribe((d: any) => {
          this.close();
          successAlert('Staff Created Successfully');
        });
    }
  }

  onUpdate() {
    const formValues = this.staffForm.getRawValue();
    const updateData = {
      id: this.staff.id,
      staff_id: formValues.staff_id,
      name: formValues.name,
      email: formValues.email,
      contact: formValues.contact,
      usertype: formValues.usertype,
      course_id: formValues.course || this.staff.course_id,
      status: formValues.status,
    };
    const userData = {
      id: this.staff.id,
      email: formValues.email,
      usertype: formValues.usertype,
      status: formValues.status,
      staff_id: formValues.staff_id,
    };

    if (this.staff.id) {
      this.userService
        .updateResource(userData, 'updateUsers')
        .subscribe((d: any) => {
          console.log('doine');
          this.close();
          successAlert('Staff Created Successfully');
        });
    }
  }

  addCourse() {
    if (this.courseForm.valid) {
      const formValues = this.courseForm.getRawValue();
      const staffData = {
        id: this.staff.id,
        staff_id: this.staff.staff_id,
        name: this.staff.name,
        email: this.staff.email,
        contact: this.staff.contact,
        usertype: this.staff.usertype,
        course_id: formValues.course,

        status: this.staff.status,
      };
      // console.log(studentData);
      this.staffService
        .updateResource(staffData, 'updateStaff')
        .subscribe((d: any) => {
          this.close();
          successAlert('Course Updated Successfully');
        });
    }
  }
}
