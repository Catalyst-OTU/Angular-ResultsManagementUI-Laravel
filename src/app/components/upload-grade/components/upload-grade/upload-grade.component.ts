import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ModuleService } from 'src/app/components/course-modules/services/course-module.service';
import { StudentsService } from 'src/app/components/students/services/students.service';
import { ResultsService } from '../../services/results.service';
import { successAlert } from '../../../../utils/constants';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-upload-grade',
  templateUrl: './upload-grade.component.html',
  styleUrls: ['./upload-grade.component.scss'],
})
export class UploadGradeComponent implements OnInit {
  displayedColumns: string[] = ['student_id', 'name', 'marks', 'action'];
  dataSource = new MatTableDataSource<any>();
  data: any;
  isLoading = true;
  pageNumber: number = 1;
  VOForm: FormGroup;
  isEditableNew: boolean = true;
  moduleInfo;

  constructor(
    private studentService: StudentsService,
    private fb: FormBuilder,
    private _formBuilder: FormBuilder,
    private moduleService: ModuleService,
    private resultService: ResultsService
  ) {}

  ngOnInit(): void {
    this.loadInfo();
    this.VOForm = this._formBuilder.group({
      VORows: this._formBuilder.array([]),
    });
    this.studentService
      .getStudentsUnderModule(localStorage['module_id'])
      .subscribe((stdudents) => {
        this.data = stdudents;

        this.VOForm = this.fb.group({
          VORows: this.fb.array(
            this.data.map((val) =>
              this.fb.group({
                student_id: new FormControl(val.student_id),
                name: new FormControl(val.name),
                marks: new FormControl(val.marks, [
                  Validators.pattern('[0-100 ]*'),
                ]),
                action: new FormControl('existingRecord'),
                isEditable: new FormControl(true),
                isNewRow: new FormControl(false),
              })
            )
          ), //end of fb array
        });

        // end of form group cretation
        this.isLoading = false;
        this.dataSource = new MatTableDataSource(
          (this.VOForm.get('VORows') as FormArray).controls
        );
        this.dataSource.paginator = this.paginator;
      });

    const filterPredicate = this.dataSource.filterPredicate;
    this.dataSource.filterPredicate = (data: AbstractControl, filter) => {
      return filterPredicate.call(this.dataSource, data.value, filter);
    };

    //Custom filter according to name column
    // this.dataSource.filterPredicate = (data: {name: string}, filterValue: string) =>
    //   data.name.trim().toLowerCase().indexOf(filterValue) !== -1;
  }

  loadInfo() {
    this.moduleService.getAllModules().subscribe((result) => {
      this.moduleInfo = result.find((a) => a.id == localStorage['module_id']);
      console.log(this.moduleInfo);
    });
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.paginatorList = document.getElementsByClassName(
      'mat-paginator-range-label'
    );

    this.onPaginateChange(this.paginator, this.paginatorList);

    this.paginator.page.subscribe(() => {
      // this is page change event
      this.onPaginateChange(this.paginator, this.paginatorList);
    });
  }

  applyFilter(event: Event) {
    //  debugger;
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // @ViewChild('table') table: MatTable<PeriodicElement>;
  // AddNewRow() {
  //   // this.getBasicDetails();
  //   const control = this.VOForm.get("VORows") as FormArray;
  //   control.insert(0, this.initiateVOForm());
  //   this.dataSource = new MatTableDataSource(control.controls);
  //   // control.controls.unshift(this.initiateVOForm());
  //   // this.openPanel(panel);
  //   // this.table.renderRows();
  //   // this.dataSource.data = this.dataSource.data;
  // }

  // this function will enabled the select field for editing
  EditSVO(VOFormElement, i) {
    // VOFormElement.get('VORows').at(i).get('name').disabled(false)
    VOFormElement.get('VORows').at(i).get('isEditable').patchValue(false);
    // this.isEditableNew = true;
  }

  // On click of correct button in table (after click on edit) this method will call
  SaveVO(VOFormElement, i, element) {
    // alert('SaveVO')
    VOFormElement.get('VORows').at(i).get('isEditable').patchValue(true);
    console.log(element.value);
  }

  // On click of cancel button in the table (after click on edit) this method will call and reset the previous data
  CancelSVO(VOFormElement, i) {
    VOFormElement.get('VORows').at(i).get('isEditable').patchValue(true);
  }

  paginatorList: HTMLCollectionOf<Element>;
  idx: number;
  onPaginateChange(paginator: MatPaginator, list: HTMLCollectionOf<Element>) {
    setTimeout(
      (idx) => {
        let from = paginator.pageSize * paginator.pageIndex + 1;

        let to =
          paginator.length < paginator.pageSize * (paginator.pageIndex + 1)
            ? paginator.length
            : paginator.pageSize * (paginator.pageIndex + 1);

        let toFrom = paginator.length == 0 ? 0 : `${from} - ${to}`;
        let pageNumber =
          paginator.length == 0
            ? `0 of 0`
            : `${paginator.pageIndex + 1} of ${paginator.getNumberOfPages()}`;
        let rows = `Page ${pageNumber} (${toFrom} of ${paginator.length})`;

        if (list.length >= 1) list[0].innerHTML = rows;
      },
      0,
      paginator.pageIndex
    );
  }

  // initiateVOForm(): FormGroup {
  //   return this.fb.group({
  //     position: new FormControl(234),
  //     student_id: new FormControl(""),
  //     name: new FormControl(""),
  //     action: new FormControl("newRecord"),
  //     isEditable: new FormControl(false),
  //     isNewRow: new FormControl(true),
  //   });
  // }

  onUpload() {
    var form = this.VOForm.value['VORows'];

    form.forEach((x) => {
      (x.module_id = this.moduleInfo['id']),
        (x.course_id = this.moduleInfo['course_id']);
    });
    // this.resultService
    //   .storeResource(form, 'results/saveAllResults')
    //   .subscribe((d: any) => {
    //     successAlert('Grads Uploaded Successfully');
    //   });
    console.log(form);
  }
}
