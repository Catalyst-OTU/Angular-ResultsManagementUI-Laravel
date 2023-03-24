import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ModuleService } from 'src/app/components/course-modules/services/course-module.service';
import { StudentsService } from 'src/app/components/students/services/students.service';
import { errorMessages } from 'src/app/services/custom-validation';
import { successAlert, successGradeAlert } from 'src/app/utils/constants';
import { ResultsService } from '../../services/results.service';
import { DialogService } from '../../../../services/dialog.service';
import { Subscription } from 'rxjs';
import { NavigationStart, Router } from '@angular/router';
@Component({
  selector: 'app-confirm-grade',
  templateUrl: './confirm-grade.component.html',
  styleUrls: ['./confirm-grade.component.scss'],
})
export class ConfirmGradeComponent implements OnInit {
  displayedColumns = ['student_id', 'name', 'marks', 'approval', 'action'];
  data!:any;
  dataSource = new MatTableDataSource<any>();
  gradeForm: FormGroup;
  moduleInfo;
  errors = errorMessages;
  subscription: Subscription;
  browserRefresh = false;

  constructor(
    private fb: FormBuilder,
    private moduleService: ModuleService,
    private resultService: ResultsService,
    public dialog: DialogService
  ) {}

  ngOnInit() {
    this.loadInfo(),
      (this.gradeForm = this.fb.group({
        gradeRows: this.fb.array([]),
      }));
    this.loadData();
    this.loadInfo();
  }

  loadData() {
    this.resultService
      .getStudentsUnderCourseBatchByModule(localStorage['module_name'])
      .subscribe((students) => {
        let dd = []
        dd.push(students)
        this.data = dd
        console.log(this.data);

        this.gradeForm = this.fb.group({
          gradeRows: this.fb.array(
            this.data.map((val) =>
              this.fb.group({
                colId: [val.id],
                batch_id: [val.batch_id],
                module_name: [val.module_name],
                staff_name: [val.staff_name],
                status: [val.status],

                student_id: [val.student_id],
                name: [val.name],
                approval: [this.getStatus(val.approval)],
                marks: [
                  val.marks,
                  [
                    Validators.pattern('[0-9]+'),
                    Validators.minLength(1),
                    Validators.maxLength(3),
                    Validators.max(100),
                    Validators.min(0),
                  ],
                ],
                action: new FormControl('existingRecord'),
                isEditable: new FormControl(true),
                isNewRow: new FormControl(false),
              })
            )
          ), //end of fb array
        });
        this.dataSource = new MatTableDataSource(
          (this.gradeForm.get('gradeRows') as FormArray).controls
        );
      });
  }

  loadInfo() {
    this.moduleService.getAllModules().subscribe((result:any) => {
      this.moduleInfo = result.data.find(
        (a) => a.module_name == localStorage.getItem('module_name')
      );
      // console.log(this.moduleInfo);
    });
  }

  applyFilter(event: Event) {
    var filterValue = (event.target as HTMLInputElement).value;

    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  openConfirmDialog(gradeFormElement, i, element) {
    this.dialog
      .confirmDialog({
        title: 'Confirm Result Upload ?',
        message: 'Are you sure you want to upload result ?',
        confirmCaption: 'Yes',
        cancelCaption: 'No',
      })
      .subscribe((yes) => {
        if (yes) {
          this.uploadSingleGrade(gradeFormElement, i, element);
        }
      });
  }
  editGrade(gradeFormElement, i) {
    gradeFormElement.get('gradeRows').at(i).get('isEditable').patchValue(false);
  }
  cancelSave(gradeFormElement, i) {
    gradeFormElement.get('gradeRows').at(i).get('isEditable').patchValue(true);
  }
  saveGrade(gradeFormElement, i, element) {
    gradeFormElement.get('gradeRows').at(i).get('isEditable').patchValue(true);
    console.log(element.value);
  }

  uploadSingleGrade = (gradeFormElement, i, element) => {
    gradeFormElement.get('gradeRows').at(i).get('isEditable').patchValue(true);
    console.log(element.value);
    let data = {
      id: element.value.colId,
      name: element.value.name,
      student_id: element.value.student_id,
      batch_id: element.value.batch_id,
      module_name: element.value.module_name,
      staff_name: element.value.staff_name,

      marks: element.value.marks,

      status: element.value.status,
      approval: false,
    };
    // console.log(data);

    this.resultService
      .updateResource(data, data.id, `api/studentResults/saveStudentResults/${data.id}`)
      .subscribe((d: any) => {
        successAlert('Grade Uploaded Successfully');
      });
  };

  openBulkUpload() {
    this.dialog
      .confirmDialog({
        title: 'Confirm Result Upload ?',
        message: 'Are you sure you want to upload result ?',
        confirmCaption: 'Yes',
        cancelCaption: 'No',
      })
      .subscribe((yes) => {
        if (yes) {
          this.onUpload();
        }
      });
  }
  onUpload() {
    var form = this.gradeForm.value['gradeRows'];
    var ty = [];

    form.forEach((element) => {
      ty.push({
        id: element.colId,
        name: element.name,
        student_id: element.student_id,
        batch_id: element.batch_id,
        module_name: element.module_name,
        staff_name: element.staff_name,

        marks: element.marks,

        status: element.status,
        approval: false,
      });
    });
    // form.forEach((x) => {
    //   (x.module_name = this.moduleInfo['module_name']),
    //     (x.course_name = this.moduleInfo['course_name']),
    //     (x.staff_name = this.moduleInfo['staff_name']),
    //     (x.course_id = this.moduleInfo['course_id']),
    //     (x.module_id = this.moduleInfo['id'])
    // });
    // console.log(ty);
    this.resultService
      .updateResource(ty, 'saveAllResults')
      .subscribe((d: any) => {
        successAlert('Grades Uploaded Successfully');
      });
  }

  
  openConfirmGradeDialog(gradeFormElement, i, element) {
    this.dialog
      .confirmDialog({
        title: 'Confirm Result Approval ?',
        message: 'Are you sure you want to approve result ?',
        confirmCaption: 'Yes',
        cancelCaption: 'No',
      })
      .subscribe((yes) => {
        if (yes) {
          this.updateSingleGrade(gradeFormElement, i, element);
        }
      });
  }

  updateSingleGrade = (gradeFormElement, i, element) => {
    gradeFormElement.get('gradeRows').at(i).get('isEditable').patchValue(true);
    //  console.log(element.value);
    let data = {
      id: element.value.colId,
      name: element.value.name,
      student_id: element.value.student_id,
      batch_id: element.value.batch_id,
      module_name: element.value.module_name,
      staff_name: element.value.staff_name,

      marks: element.value.marks,

      status: element.value.status,
      approval: true,
    };
    // console.log(data);

    this.resultService
      .updateResource(data, data.id, `api/studentResults/saveStudentResults/${data.id}`)
      .subscribe((d: any) => {
        successAlert('Grade Confirmed Successfully');
      });
  };

  getStatus(status) {
    if (status == 0) {
      return 'Not Approved';
    } else if (status == 1) {
      return 'Approved';
    }
  }

  getApprovalStatus(index: number) {
    return (this.gradeForm.get('gradeRows') as FormArray)
      .at(index)
      .get('approval')?.value;
  }

  getScore(index: number) {
    return (this.gradeForm.get('gradeRows') as FormArray).at(index).get('marks')
      ?.value;
  }
}
