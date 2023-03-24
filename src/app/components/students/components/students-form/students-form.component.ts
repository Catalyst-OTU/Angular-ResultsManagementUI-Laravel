import { AfterViewInit, Component, Input, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Student } from '../../interfaces/models';
import {
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { StudentsListComponent } from '../students-list/students-list.component';
import {
  CustomValidators,
  ConfirmValidParentMatcher,
  regExps,
  errorMessages,
} from '../../../../services/custom-validation';
import { StudentsService } from '../../services/students.service';
import { successAlert } from 'src/app/utils/constants';
import { CoursesService } from '../../../courses/services/course.service';
import { ResultsService } from '../../../upload-grade/services/results.service';
import { CourseBatchesService } from 'src/app/components/courses/services/course-batches.service';

@Component({
  selector: 'app-students-form',
  templateUrl: './students-form.component.html',
  styleUrls: ['./students-form.component.css'],
})
export class StudentsFormComponent implements OnInit {
  @Input()
  addOnlyForm: boolean = false;
  addCourseForm: boolean = false;
  updateOnlyForm: boolean = false;

  endtoday = new Date();
  selectedGender: string;
  genders = [
    { name: 'Male', checked: true },
    { name: 'Female', checked: false },
  ];
  statusList = [
    { name: 'Active', value: 'Active' },
    { name: 'InActive', value: 'InActive' },
  ];
  feesList = [
    { name: 'Full Payment', value: 'Full Payment' },
    { name: 'Part Payment', value: 'Part Payment' },
  ];

  maxDate = new Date();

  confirmValidParentMatcher = new ConfirmValidParentMatcher();

  errors = errorMessages;

  studentForm: FormGroup;
  courseForm: FormGroup;
  student: Student;
  condata: any;
  tyye: any;
  courseList: any[];
  courseBatches: any[];
  constructor(
    private fb: FormBuilder,
    private studentService: StudentsService,
    private courseService: CoursesService,
    private config: MatDialogConfig,
    private dialogRef: MatDialogRef<StudentsListComponent>,
    private resultService: ResultsService,
    private batchService: CourseBatchesService,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    (this.condata = data), (this.tyye = data.type);
  }

  ngOnInit(): void {
    this.studentForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      contact: [
        '',
        [
          Validators.pattern('[0-9]+'),
          Validators.minLength(10),
          Validators.maxLength(20),
        ],
      ],
      course_id: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      student_id: ['', [Validators.required]],
      date_of_birth: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      status: [''],
      fees: ['', [Validators.required]],
      batch_id: ['', [Validators.required]],
    });
    this.courseForm = this.fb.group({
      student_id: ['', [Validators.required]],

      course_id: ['', [Validators.required]],
      batch_id: ['', [Validators.required]],
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
  ngAfterViewInit(): void {
    if (this.condata?.id) {
      this.student = { ...this.condata };
      const formValues: any = { ...this.student };
      Promise.resolve().then(() => this.studentForm.patchValue(formValues));
    }
  }

  //   public findInvalidControls() {
  //     const invalid = [];
  //     const controls = this.studentForm.controls;
  //     for (const name in controls) {
  //         if (controls[name].invalid) {
  //             invalid.push(name);
  //         }
  //     }
  //       console.log(invalid)
  // }

  onAdd() {
    if (this.studentForm.valid) {
      const formValues = this.studentForm.getRawValue();
      const studentData = {
        name: formValues.name,
        contact: formValues.contact,
        student_id: formValues.student_id,
        date_of_birth: formValues.date_of_birth,
        gender: formValues.gender,
        //usertype: 'Student',
        email: formValues.email,
        // course_name: formValues.course,
        //course_id: formValues.course_id,
        status: 'Active',
        fees: formValues.fees,
        batch_id: formValues.batch_id,
      };


      // console.log(studentData);
      this.studentService
        .storeResource(studentData, 'api/students/saveStudent')
        .subscribe((d: any) => {
          this.close();
          successAlert('Student Created Successfully');
        });

      // this.resultService
      //   .storeResource(resultDatea, 'studentResults/saveOnlyStudent')
      //   .subscribe((d: any) => {
      //     this.close();
      //     successAlert('Student Created Successfully');
      //   });
    }
  }

  getBatchesUnderCourse() {
    const id = this.studentForm.get('course_id').value;
    this.batchService.getBatchesUnderCourse(id).subscribe((result:any) => {
      this.courseBatches = result.map(
        ({ id, course_level, course_start_date }) => ({
          id,
          course_level,
          course_start_date,
        })
      );
    });
  }

  getBatchesUnderCourse2() {
    const id = this.courseForm.get('course_id').value;
    this.batchService.getBatchesUnderCourse(id).subscribe((result:any) => {
      console.log(result)

      this.courseBatches = result.map(
        ({ id, course_level, course_start_date }) => ({
          id,
          course_level,
          course_start_date,
        })
      );
    });
  }

  onUpdate() {
    const formValues = this.studentForm.getRawValue();
    const updateData = {
      name: formValues.name,
      contact: formValues.contact,
      student_id: formValues.student_id,
      date_of_birth: formValues.date_of_birth,
      gender: formValues.gender,
      //usertype: 'Student',
      email: formValues.email,
      // course_name: formValues.course,
      course_id: formValues.course_id,
      status: formValues.status,
      fees: formValues.fees,
      id: this.student.id,
      batch_id: formValues.batch_id,
    };
    if (this.student.id) {
      // console.log(updateData);
      this.studentService
        .updateResource(updateData, 'updateStudent')
        .subscribe((d: any) => {
          this.close();
          successAlert('Student Updated Successfully');
        });
    }
  }

  addToCourse() {
    if (this.courseForm.valid) {
      const formValues = this.courseForm.getRawValue();
      const studentData = {
        name: this.student.name,
        contact: this.student.contact,
        student_id: formValues.student_id,
        date_of_birth: this.student.date_of_birth,
        gender: this.student.gender,
        //usertype: 'Student',
        email: this.student.email,
        // course_name: formValues.course,
        //course_id: formValues.course_id,
        status: 'Active',
        fees: this.student.fees,
        id: this.student.id,
        batch_id: formValues.batch_id,
      };
      // console.log(studentData);
      this.studentService
        .updateResource(studentData, studentData.id,`api/students/updateStudent/${studentData.id}`)
        .subscribe((d: any) => {
          this.close();
          successAlert('Course Updated Successfully');
        });
    }
  }
}
