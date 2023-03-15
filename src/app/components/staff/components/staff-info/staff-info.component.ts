import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { StaffService } from '../../services/staff.service';
import { CoursesService } from 'src/app/components/courses/services/course.service';
import { Course } from 'src/app/components/courses/interfaces/model';
import { Staff } from '../../interfaces/models';
import { Router } from '@angular/router';
import { ModuleService } from '../../../course-modules/services/course-module.service';
import { CourseBatchesService } from 'src/app/components/courses/services/course-batches.service';


@Component({
  selector: 'app-staff-info',
  templateUrl: './staff-info.component.html',
  styleUrls: ['./staff-info.component.scss'],
})
export class StaffInfoComponent implements OnInit {
  data: any[];
  tableData: any[];
  staffInfo: Staff | undefined;
  displayedColumns: string[] = [
    'course_name',
    'course_level',
    'course_start_date',
    'course_end_date',
  ];
  dataSource: MatTableDataSource<Course> = new MatTableDataSource([]);

  constructor(
    private service: StaffService,
    private courseService: CoursesService,
    private router: Router,
    private moduleService: ModuleService,
    private batchService: CourseBatchesService
  ) {}

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.loadInfo();
    this.loadCourse();
    this.data = this.service.getAllStaff();
    const user = this.data.find(
      (a) => a.id == JSON.parse(localStorage['staff_id'])
    );
    console.log(user);
  }

  // loadCourse() {
  //   this.courseService
  //     .getStaffsCourses(localStorage['staff_id'])
  //     .subscribe((results) => {
  //       this.tableData = results.filter((stud) => stud.status === 'Active');
  //       this.dataSource = new MatTableDataSource(this.tableData);
  //     });
  // }


  openInfoDialog(data) {
    this.router.navigate(['/batch-info']);
    localStorage.setItem('batch_id', data.id);
  }


  loadCourse() {
    this.batchService
      .getStaffCoursesUnderBatch(localStorage['staff_id'])
      .subscribe((results:any) => {
        this.tableData = results.filter((stud) => stud.status === 'Active');
        this.dataSource = new MatTableDataSource(this.tableData);
      });
  }

  loadModules() {
    this.courseService
      .getStaffsCourses(localStorage['staff_id'])
      .subscribe((results) => {
        this.tableData = results.filter((stud) => stud.status === 'Active');
        this.dataSource = new MatTableDataSource(this.tableData);
      });
  }
  async loadInfo() {
    this.service.getAllStaffs().subscribe((result) => {
      this.staffInfo = result.find((a) => a.id == localStorage['staff_id']);
      console.log(this.staffInfo);
    });
  }
  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    setTimeout(() => (this.dataSource.paginator = this.paginator));
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  viewCourse(element) {
    this.router.navigate(['/course-info']);
    localStorage.setItem('course_id', element.id);
  }
}
