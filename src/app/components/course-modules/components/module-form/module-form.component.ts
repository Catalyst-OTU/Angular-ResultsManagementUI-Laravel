import { AfterViewInit, Component, Input, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseModule } from '../../interfaces/models';
import {
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ModuleListComponent } from '../module-list/module-list.component';
import { StaffService } from '../../../staff/services/staff.service';
import { CoursesService } from '../../../courses/services/course.service';
import {
  CustomValidators,
  ConfirmValidParentMatcher,
  regExps,
  errorMessages,
} from '../../../../services/custom-validation';
import { ModuleService } from '../../services/course-module.service';
import { successAlert } from 'src/app/utils/constants';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-module-form',
  templateUrl: './module-form.component.html',
  styleUrls: ['./module-form.component.css'],
})
export class ModuleFormComponent implements OnInit {
  @Input()
  addOnlyForm: boolean = false;
  confirmValidParentMatcher = new ConfirmValidParentMatcher();

  errors = errorMessages;
  moduleForm: FormGroup;

  course_module: CourseModule;
  condata: any;
  tyye: any;
  courseInstructors: any[];
  courseList: any[];
  updateList: any[];
  course_id: any;
  course_name = 'option2';
  course_level = '';
  statusList = [
    { name: 'Active', value: 'Active' },
    { name: 'InActive', value: 'InActive' },
  ];
  minDate = new Date();
  yesterday = new Date();
  constructor(
    public datepipe: DatePipe,

    private fb: FormBuilder,
    private moduleService: ModuleService,
    private dialogRef: MatDialogRef<ModuleListComponent>,
    private staffService: StaffService,
    private courseService: CoursesService,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.yesterday.setDate(this.yesterday.getDate() - 1);
    (this.condata = data), (this.tyye = data.type);
  }

  ngOnInit(): void {
    this.loadInstructors();
    this.loadCourses();
    this.moduleForm = this.fb.group({
      module_name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      course_name: [''],
      staff_name: [''],
      update_name: [{ value: '', disabled: true }],
      status: [''],
      module_start_date: [''],
      module_end_date: [''],
    });

    if (this.tyye === 'add') {
      this.addOnlyForm = true;
    }
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

  loadCourses = () => {
    this.courseService.getAllCourse().subscribe((courses) => {
      this.courseList = courses
        .filter((stud) => stud.status === 'Active')
        .map(({ id, course_name, course_level }) => ({
          id,
          course_name,
          course_level,
        }));
      this.updateList = courses
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
      this.course_module = { ...this.condata };
      const formValues: any = { ...this.course_module };
      Promise.resolve().then(
        () => (
          this.moduleForm.patchValue(formValues),
          this.moduleForm.patchValue({ update_name: this.condata.course_name })
        )
      );
    }
  }

  onChange(data) {
    this.moduleForm.patchValue({
      course_name:
        this.courseList[data].course_name +
        ' --- ' +
        this.courseList[data].course_level,
    });

    this.course_id = this.courseList[data].id;
    // console.log(this.course_id + this.moduleForm.get('course_name').value)
    // console.log("selected --->"+this.courseList[data].id+' '+this.courseList[data].course_name);
  }

  onAdd() {
    if (this.moduleForm.valid) {
      const formValues = this.moduleForm.getRawValue();
      const moduleData = {
        module_name: formValues.module_name,
        //course_name: formValues.course_name,
        //staff_name: formValues.staff_name,
        course_id: this.course_id,
        status: 'Active',
        // module_end_date: this.datepipe.transform(
        //   formValues.module_end_date,
        //   'yyyy/MM/dd'
        // ),
        // module_start_date: this.datepipe.transform(
        //   formValues.module_start_date,
        //   'yyyy/MM/dd'
        // ),
      };
      // console.log(moduleData);
      this.moduleService
        .storeResource(moduleData, 'api/modules/saveModules')
        .subscribe((d: any) => {
          console.log(d);
        });
        this.close();
        successAlert('Module Updated Successfully');
      // this.staffService.sendEmail().subscribe((d: any) => {
      //   
        
      // });
    }
  }

  onUpdate() {
    const formValues = this.moduleForm.getRawValue();
    const updateData = {
      id: this.course_module.id,
      module_name: formValues.module_name,
      //course_name: formValues.course_name,
      //staff_name: formValues.staff_name,
      course_id: this.course_module.course_id,
      status: formValues.status,
      // module_end_date: this.datepipe.transform(
      //   formValues.module_end_date,
      //   'yyyy/MM/dd'
      // ),
      // module_start_date: this.datepipe.transform(
      //   formValues.module_start_date,
      //   'yyyy/MM/dd'
      // ),
    };

    if (this.course_module.id) {
      this.moduleService
        .updateResource(updateData, updateData.id, `api/modules/updateModule/${updateData.id}`)
        .subscribe((d: any) => {
          console.log(d);
        });
        this.close();
        successAlert('Module Updated Successfully');
      // this.staffService.sendEmail().subscribe((d: any) => {
      //   
        
      // });
    }
  }
}
