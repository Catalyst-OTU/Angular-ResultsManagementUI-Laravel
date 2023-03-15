import { AfterViewInit, Component, Input, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { CourseModule } from 'src/app/components/course-modules/interfaces/models';
import { CoursesService } from '../../services/course.service';
import { CourseListComponent } from '../course-list/course-list.component';
import {
  CustomValidators,
  ConfirmValidParentMatcher,
  regExps,
  errorMessages,
} from '../../../../services/custom-validation';
import { StaffService } from '../../../staff/services/staff.service';
import { ModuleService } from 'src/app/components/course-modules/services/course-module.service';
import { successAlert } from 'src/app/utils/constants';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-module',
  templateUrl: './add-module.component.html',
  styleUrls: ['./add-module.component.css'],
})
export class AddModuleComponent implements OnInit {
  @Input()
  addOnlyForm: boolean = false;
  confirmValidParentMatcher = new ConfirmValidParentMatcher();

  errors = errorMessages;
  moduleForm: FormGroup;
  course_module: CourseModule;
  condata: [];
  tyye: any;
  courseInstructors: any[];
  courseList: any[];
  minDate = new Date();
  constructor(
    public datepipe: DatePipe,
    private fb: FormBuilder,
    private courseService: CoursesService,
    private moduleService: ModuleService,
    private staffService: StaffService,
    private dialogRef: MatDialogRef<CourseListComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.condata = data;
  }

  ngOnInit(): void {
    this.loadInstructors();
    this.moduleForm = this.fb.group({
      module_name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      course_name: [{ value: '', disabled: true }],
      lecturer: [''],
      module_end_date: [''],
      module_start_date: [''],
    });
  }

  close() {
    this.dialogRef.close();
  }

  loadInstructors() {
    this.staffService.getInstructors().subscribe((instructors) => {
      this.courseInstructors = instructors
        .filter((stud) => stud.status === 'Active')
        .map(({ id, name }) => ({
          id,
          name,
        }));
    });
  }

  ngAfterViewInit() {
    if (this.condata) {
      Promise.resolve().then(() =>
        this.moduleForm.patchValue({ course_name: this.condata['course_name'] })
      );
    }
  }

  onAdd() {
    if (this.moduleForm.valid) {
      const formValues = this.moduleForm.getRawValue();

      const moduleData = {
        module_name: formValues.module_name,
        //course_name: formValues.course_name,
        //staff_name: formValues.lecturer,
        course_id: this.condata['id'],
        // module_end_date: this.datepipe.transform(
        //   formValues.module_end_date,
        //   'yyyy/MM/dd'
        // ),
        // module_start_date: this.datepipe.transform(
        //   formValues.module_start_date,
        //   'yyyy/MM/dd'
        // ),
        status: 'Active',
      };
      this.moduleService
        .storeResource(moduleData, 'api/modules/saveModules')
        .subscribe((d: any) => {
          this.close();
          successAlert('Module Created Successfully');
        });
    }
  }
}
