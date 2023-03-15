import { AfterViewInit, Component, Input, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Course } from '../../interfaces/model';
import {
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { CourseListComponent } from '../course-list/course-list.component';
import {
  CustomValidators,
  ConfirmValidParentMatcher,
  regExps,
  errorMessages,
} from '../../../../services/custom-validation';
import { successAlert } from 'src/app/utils/constants';
import { CoursesService } from '../../services/course.service';
import { DatePipe } from '@angular/common';
import { StaffService } from 'src/app/components/staff/services/staff.service';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.css'],
})
export class CourseFormComponent implements OnInit {
  @Input()
  addOnlyForm: boolean = false;

  courseForm: FormGroup;
  course: Course;
  condata: any;
  tyye: any;
  courseCordinators: any[];
  minDate = new Date();

  confirmValidParentMatcher = new ConfirmValidParentMatcher();

  errors = errorMessages;
  constructor(
    public datepipe: DatePipe,
    private courseService: CoursesService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseListComponent>,
    private staffService: StaffService,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.condata = data;
    this.tyye = data.type;
  }

  statusList = [
    { name: 'Active', value: 'Active' },
    { name: 'InActive', value: 'InActive' },
  ];

  ngOnInit(): void {
    this.courseForm = this.fb.group({
      course_name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      course_level: [
        '',
        [
          Validators.minLength(2),
          Validators.maxLength(10),
        ],
      ],
      // course_level:['', [Validators.pattern('[1-9]+'),Validators.required]],
      course_start_date: [''],
      course_end_date: [''],
      certificate_issuedate: [''],
      status: [''],
      coordinator: [''],
    });
    if (this.tyye === 'add') {
      this.addOnlyForm = true;
    }
    this.loadCordinators();
  }
  loadCordinators() {
    this.staffService.getCordinators().subscribe((cordinators:any) => {
      this.courseCordinators = cordinators
        .data.filter((stud) => stud.status === 'Active')
        .map(({ id, name }) => ({
          id,
          name,
        }));
    });
  }

  close() {
    this.dialogRef.close();
  }

  ngAfterViewInit() {
    if (this.condata?.id) {
      this.course = { ...this.condata };
      const formValues: any = { ...this.course };
      Promise.resolve().then(() => this.courseForm.patchValue(formValues));
    }
  }

  onAdd() {
    if (this.courseForm.valid) {
      const formValues = this.courseForm.getRawValue();
      const courseData = {
        course_name: formValues.course_name,
        // coordinator: formValues.coordinator,
        // course_level: formValues.course_level,
        // course_start_date: this.datepipe.transform(
        //   formValues.course_start_date,
        //   'yyyy/MM/dd'
        // ),
        // course_end_date: this.datepipe.transform(
        //   formValues.course_end_date,
        //   'yyyy/MM/dd'
        // ),
        // certificate_issuedate: this.datepipe.transform(
        //   formValues.certificate_issuedate,
        //   'yyyy/MM/dd'
        // ),
        status: 'Active',
      };
      this.courseService
        .storeResource(courseData, 'api/courses/saveCourses')
        .subscribe((d: any) => {
          this.close();
          successAlert('Course Created Successfully');
        });
    }
  }

  onUpdate() {
    const formValues = this.courseForm.getRawValue();
    const updateData = {
      id: this.course.id,
      course_name: formValues.course_name,
      course_level: formValues.course_level,
      coordinator: formValues.coordinator,
      course_start_date: this.datepipe.transform(
        formValues.course_start_date,
        'yyyy/MM/dd'
      ),
      course_end_date: this.datepipe.transform(
        formValues.course_end_date,
        'yyyy/MM/dd'
      ),
      certificate_issuedate: this.datepipe.transform(
        formValues.certificate_issuedate,
        'yyyy/MM/dd'
      ),
      status: formValues.status,
    };

    if (this.course.id) {
      this.courseService
        .updateResource(updateData, 'updateCourses')
        .subscribe((d: any) => {
          this.close();
          successAlert('Course Updated Successfully');
        });
    }
  }
}
