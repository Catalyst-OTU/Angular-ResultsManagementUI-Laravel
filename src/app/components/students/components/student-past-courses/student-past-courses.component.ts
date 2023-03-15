import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Course } from 'src/app/components/courses/interfaces/model';
import { CoursesService } from 'src/app/components/courses/services/course.service';
import { StudentsService } from '../../services/students.service';
import { Student } from '../../interfaces/models';
import { PastStudentsService } from '../../services/past-students.service';
import { CourseBatchesService } from 'src/app/components/courses/services/course-batches.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-student-past-courses',
  templateUrl: './student-past-courses.component.html',
  styleUrls: ['./student-past-courses.component.scss'],
})
export class StudentPastCoursesComponent implements OnInit {
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
  batchHistory: any[];
  pastHistory: any[];
  constructor(
    private courseService: CoursesService,
    private router: Router,
    private studentService: StudentsService,
    private pastService: PastStudentsService,
    private batchService: CourseBatchesService
  ) {}
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.loadPastCourses();
    // this.loadInfo();
  }
  loadPastCourses() {
    // this.batchService
    //   .getStudentsPastCoursesUnderBatch(localStorage['student_id'])
    //   .subscribe((results) => {
    //     this.tableData = results.filter((stud) => stud.status === 'Active');
    //     this.dataSource = new MatTableDataSource(this.tableData);
    //   });

    // this.pastService
    //   .getPastStudentCoursBatches(localStorage['student_id'])
    //   .subscribe((results) => {
    //     this.tableData = results.filter((stud) => stud.status === 'Active');
    //     this.dataSource = new MatTableDataSource(this.tableData);
    //   });
    let character = this.batchService.getStudentsPastCoursesUnderBatch(
      localStorage['student_id']
    );
    let characterHomeworld = this.pastService.getPastStudentCoursBatches(
      localStorage['student_id']
    );

    forkJoin([character, characterHomeworld]).subscribe((results) => {
      // results[0] is our character
      // results[1] is our character homeworld
      this.batchHistory = results[0];
      this.pastHistory = results[1];

      //console.log(this.pastHistory);

      this.pastHistory.forEach((element) => {
        let obj = this.batchHistory.find((x: any) => x.id === element.batch_id);

        let index = this.batchHistory.indexOf(obj);

        this.batchHistory.fill(
          ((obj.batch_id = element.batch_id),
          (obj.student_id = element.student_id)),
          index,
          index++
        );
      });
      this.dataSource = new MatTableDataSource(this.batchHistory);
      // console.log(this.batchHistory);
       console.log(this.pastHistory);
    });
  }

  // loadPastCourses() {
  //   this.courseService
  //     .getStudentsPastCourses(localStorage['student_id'])
  //     .subscribe((results) => {
  //       this.tableData = results.filter((stud) => stud.status === 'Active');
  //       this.dataSource = new MatTableDataSource(this.tableData);
  //     });
  // }
  // async loadInfo() {
  //   this.pastService
  //     .findPastStudentByStudentId(localStorage['student_id'])
  //     .subscribe((results) => {
  //       this.studentInfo = results;
  //     });

  // }

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

  async viewGrade(element) {
    // console.log(element);
    await (localStorage.setItem('past_cors', element.batch_id),
    localStorage.setItem('past_stud', element.student_id));
    return this.router.navigate(['/student-past-result']);
  }
  async viewCourse(element) {
    await localStorage.setItem('course_id', element.course_id);
    return this.router.navigate(['/course-info']);
  }
}
