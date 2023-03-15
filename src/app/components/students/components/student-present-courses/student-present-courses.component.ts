import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Course } from 'src/app/components/courses/interfaces/model';
import { CoursesService } from 'src/app/components/courses/services/course.service';
import { Student } from '../../interfaces/models';
import { StudentsService } from '../../services/students.service';
import { CourseBatchesService } from 'src/app/components/courses/services/course-batches.service';

@Component({
  selector: 'app-student-present-courses',
  templateUrl: './student-present-courses.component.html',
  styleUrls: ['./student-present-courses.component.scss'],
})
export class StudentPresentCoursesComponent implements OnInit {
  data: any[];
  tableData: any[];
  condata: any;
  studentInfo: Student | undefined;

  displayedColumns: string[] = [
    'course_name',
    'course_level',
    'course_start_date',
    'course_end_date',

    'action',
  ];
  dataSource: MatTableDataSource<Course> = new MatTableDataSource([]);
  constructor(
    private courseService: CoursesService,
    private router: Router,
    private studentService: StudentsService,
    private batchService: CourseBatchesService
  ) {}
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.loadCourse();
    this.loadInfo();
  }

  loadCourse() {
    this.batchService
      .getStudentsCoursesUnderBatch(localStorage['student_id'])
      .subscribe((results:any) => {
        this.tableData = results.filter((stud) => stud.status === 'Active');
        this.dataSource = new MatTableDataSource(this.tableData);
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
  }
  async loadInfo() {
    this.studentService.getAllStudent().subscribe((result) => {
      this.studentInfo = result.find((a) => a.id == localStorage['student_id']);
      // console.log(this.studentInfo);
    });
  }

  async viewGrade() {
    await (localStorage.setItem('fetch_cors', this.studentInfo.batch_id),
    localStorage.setItem('fetch_stud', this.studentInfo.student_id));
    return this.router.navigate(['/student-result']);
  }
  async viewCourse(element) {
    await localStorage.setItem('course_id', element.course_id);
    return this.router.navigate(['/course-info']);
  }
}
