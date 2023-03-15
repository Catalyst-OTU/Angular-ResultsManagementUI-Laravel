import {
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { AfterViewInit, Component, Input, OnInit, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
} from '@angular/forms';
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
import { CourseBatchesComponent } from '../course-batches/course-batches.component';
import { CourseBatchesService } from '../../services/course-batches.service';
import { ICourseBatch } from '../../interfaces/model';

@Component({
  selector: 'app-add-course-batch',
  templateUrl: './add-course-batch.component.html',
  styleUrls: ['./add-course-batch.component.scss'],
})
export class AddCourseBatchComponent implements OnInit {
  statusList = [
    { name: 'Active', value: 'Active' },
    { name: 'InActive', value: 'InActive' },
  ];
  addOnlyForm: boolean = false;
  courseBatchForm: FormGroup;
  errors = errorMessages;
  minDate = new Date();
  courseCordinators: any[];
  condata: any;
  tyye: any;
  courseList: any[];
  courseBatch: ICourseBatch;
  origin: string;

  constructor(
    public datepipe: DatePipe,
    private courseService: CoursesService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseBatchesComponent>,
    private staffService: StaffService,
    private batchService: CourseBatchesService,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.condata = data;
    this.tyye = data.type;
    this.origin = data.origin;
  }

  ngAfterViewInit() {
    if (this.condata?.id) {
      this.courseBatch = { ...this.condata };
      const formValues: any = { ...this.courseBatch };
      Promise.resolve().then(() => this.courseBatchForm.patchValue(formValues));
    }
  }
  ngOnInit(): void {
    this.courseBatchForm = this.fb.group({
      course_name: ['', [Validators.required]],
      course_level: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(10),
        ],
      ],
      course_start_date: ['', [Validators.required]],
      course_end_date: ['', [Validators.required]],
      certificate_issuedate: [''],
      status: [''],
      coordinator: ['', [Validators.required]],
    });
    if (this.tyye === 'add') {
      this.addOnlyForm = true;
    }
    this.loadCordinators();
    this.loadCourses();
  }

  loadCordinators() {
    this.staffService.getCordinators().subscribe((cordinators) => {
      this.courseCordinators = cordinators
        // .filter((stud) => stud.status === 'Active')
        .map(({ id, name }) => ({
          id,
          name,
        }));
    });
  }

  close() {
    this.dialogRef.close();
  }
  loadCourses() {
    this.courseService.getAllCourse().subscribe((courses) => {
      this.courseList = courses
        // .filter((stud) => stud.status === 'Active')
        .map(({ id, course_name }) => ({
          id,
          course_name,
        }));
    });
  }

  addCourseBatch() {
    if (this.courseBatchForm.valid) {
      const courseBatch = { ...this.courseBatchForm.value };
      courseBatch.course_start_date = this.datepipe.transform(
        courseBatch.course_start_date,
        'yyyy-MM-dd'
      );
      courseBatch.course_end_date = this.datepipe.transform(
        courseBatch.course_end_date,
        'yyyy-MM-dd'
      );
      courseBatch.certificate_issuedate = this.datepipe.transform(
        courseBatch.certificate_issuedate,
        'yyyy-MM-dd'
      );
      courseBatch.status = 'Active';
      courseBatch.course_id = this.courseList.find(
        (course) => course.course_name === courseBatch.course_name
      ).id;

      this.batchService.createCourseBatch(courseBatch).subscribe((res) => {
        this.dialogRef.close();
        successAlert('Course Batch Added Successfully');
      });
    }
  }

  updateCourseBatch() {
    const formValues: any = { ...this.courseBatchForm.value };
    const updateData = {
      id: this.courseBatch.id,
      course_id: this.courseBatch.course_id,
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
    if (this.courseBatch.id) {
      this.batchService.editCourseBatch(updateData).subscribe((res) => {
        this.dialogRef.close();
        successAlert('Course Batch Updated Successfully');
      });
    }
  }
}
