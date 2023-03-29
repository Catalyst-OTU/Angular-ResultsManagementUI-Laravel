import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  FormArray,
  Validators,
} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { errorMessages } from 'src/app/services/custom-validation';
import { CourseBatchesService } from '../../services/course-batches.service';
import { StaffService } from 'src/app/components/staff/services/staff.service';
import { DialogService } from 'src/app/services/dialog.service';
import { DatePipe } from '@angular/common';
import { StaffRoleService } from '../../services/staff-role.service';
import { successAlert } from '../../../../utils/constants';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/all-models';

@Component({
  selector: 'app-course-batch-modules',
  templateUrl: './course-batch-modules.component.html',
  styleUrls: ['./course-batch-modules.component.scss'],
})
export class CourseBatchModulesComponent implements OnInit, AfterViewChecked {
  displayedColumns: string[] = [
    'module_name',
    'staff_name',
    'module_start_date',
    'module_end_date',
    'actions',
  ];
  data;
  dataSource = new MatTableDataSource<any>();
  gradeForm: FormGroup;
  staffList = [];
  minDate = new Date();

  errors = errorMessages;

  //staffRole: StaffRole;
  courseBatchInfo: any = {};
  user: User;
  constructor(
    private fb: FormBuilder,
    private courseBatchService: CourseBatchesService,
    private staffService: StaffService,
    public dialog: DialogService,
    public datepipe: DatePipe,
    private staffRoleService: StaffRoleService,
    private router: Router,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
    this.user = JSON.parse(localStorage.getItem('user'));
  }
  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }
  ngOnInit() {
    this.gradeForm = this.fb.group({
      gradeRows: this.fb.array([]),
    });
    this.fetchBatchModules();
    this.loadStaffData();
    this.fetchBatchInfo();
  }
  loadStaffData = () => {
    this.staffService.getCordinators().subscribe((staffs) => {
      this.staffList = staffs;
    });
  };

  getStartDate(index: number) {
    return (this.gradeForm.get('gradeRows') as FormArray)
      .at(index)
      .get('module_start_date')?.value;
  }

  getStaffname(index: number) {
    return (this.gradeForm.get('gradeRows') as FormArray)
      .at(index)
      .get('staff_name')?.value;
  }

  fetchBatchInfo() {
    this.courseBatchService
      .getCourseBatchById(localStorage['batch_id'])
      .subscribe((data: any) => {
        this.courseBatchInfo = data;
      });
  }

  fetchBatchModules() {
    this.courseBatchService
      .getModulesUnderCourseBatch(localStorage['batch_id'])
      .subscribe((res: any) => {
        this.data = res;
        console.log(this.data)
        this.gradeForm = this.fb.group({
          gradeRows: this.fb.array(
            this.data.map((val) =>
              
              this.fb.group({
                colId: [val.id],
                module_name: [val.module_name],
                staff_name: [val.staff_name],
                module_start_date: [val.module_start_date],
                module_end_date: [val.module_end_date],
                status: ['Active'],
                batch_id: [val.batch_id],
                course_id: [val.course_id],
                actions: new FormControl('existingRecord'),
                isEditable: new FormControl(true),
                isNewRow: new FormControl(false),
              })
            )
          ),
        });

        this.dataSource = new MatTableDataSource(
          (this.gradeForm.get('gradeRows') as FormArray).controls
        );
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
        title: 'Confirm Module Assignment?',
        message: 'Are you sure you want to assign module ?',
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
    console.log(element)
    let saveStaffRoleData = {
      id: element.value.colId,
      module_end_date: this.datepipe.transform(
        element.value.module_end_date,
        'yyyy/MM/dd'
      ),
      module_start_date: this.datepipe.transform(
        element.value.module_start_date,
        'yyyy/MM/dd'
      ),
      module_name: element.value.module_name,
      staff_name: element.value.staff_name,
      status: element.value.status,
      batch_id: element.value.batch_id,
      course_id: element.value.course_id,
    };
    //console.log(saveStaffRoleData);

    this.staffRoleService
      .updateResource(saveStaffRoleData, saveStaffRoleData.id, `api/staffRole/saveStaffRole/${saveStaffRoleData.id}`)
      .subscribe((res) => {
        successAlert('Module Updated Successfully');
      });

    // this.resultService
    //   .updateResource(data, 'saveStudentResults')
    //   .subscribe((d: any) => {
    //     successAlert('Grade Uploaded Successfully');
    //   });
  };

  async openUpload(data) {
    await localStorage.setItem('module_name', data.value.module_name);
    return this.router.navigate(['/upload-grade']);
  }

  async openConfirmGrade(data) {
    await localStorage.setItem('module_name', data.value.module_name);
    return this.router.navigate(['/confirm-grade']);
  }
}
