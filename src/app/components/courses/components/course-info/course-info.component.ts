import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { Course } from '../../interfaces/model';
import { MatPaginator } from '@angular/material/paginator';
import { CoursesService } from '../../services/course.service';
import { ModuleService } from 'src/app/components/course-modules/services/course-module.service';
import { Student } from '../../../students/interfaces/models';
import { StudentsService } from 'src/app/components/students/services/students.service';
import { CourseBatchesService } from '../../services/course-batches.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course-info',
  templateUrl: './course-info.component.html',
  styleUrls: ['./course-info.component.scss'],
})
export class CourseInfoComponent implements OnInit {
  data: any[];
  tableData: any[];
  courseInfo: Course | undefined;
  displayedColumns: string[] = ['module_name'];
  displayedStudentColumns: string[] = [
    'student_id',
    'name',
    'email',
    'fees',
    'status',
  ];
  displayedBatchColumns: string[] = [
    'course_name',
    'course_level',
    'coordinator',
    'course_start_date',
    'course_end_date',
    'actions',
  ];
  dataSource: MatTableDataSource<Course> = new MatTableDataSource([]);
  studentDataSource: MatTableDataSource<Student> = new MatTableDataSource([]);
  batchDataSource: MatTableDataSource<any> = new MatTableDataSource([]);

  courseModules;
  totalModules;
  totalStudents;
  totalBatches;
  constructor(
    private courseService: CoursesService,
    private moduleService: ModuleService,
    private studentService: StudentsService,
    private batchService: CourseBatchesService,
    private router: Router
  ) {}

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.loadInfo();
    this.getModulesUnderCourse();
    // this.getTotalModules();
    this.getBatchesUnderCourse();
  }
  split(string) {
    return string.split(' ').join('');
  }
  async loadInfo() {
    this.courseService.getAllCourse().subscribe((result) => {
      this.courseInfo = result.find((a) => a.id == localStorage['course_id']);
    });
  }

  loadStudentData = () => {
    this.studentService
      .getAllCourseStudent(localStorage['course_id'])
      .subscribe((stdudents) => {
        this.data = stdudents.filter((stud) => stud.status === 'Active');
        this.studentDataSource = new MatTableDataSource(this.data);
      });
  };

  getBatchesUnderCourse() {
    this.batchService
      .getBatchesUnderCourse(localStorage['course_id'])
      .subscribe((result) => {
        this.batchDataSource = new MatTableDataSource(result);
        this.totalBatches = result?.length;
      });
  }
  getTotalStudents() {
    this.courseService
      .getTotalStudents(localStorage['course_id'])
      .subscribe((result) => {
        this.totalStudents = result;
      });
  }

  openInfoDialog(data) {
    this.router.navigate(['/batch-info']);
    localStorage.setItem('batch_id', data.id);
  }

  getModulesUnderCourse() {
    this.moduleService
      .getCourseModules(localStorage['course_id'])
      .subscribe((results) => {
        this.courseModules = results.filter((stud) => stud.status === 'Active');
        this.tableData = results.filter((stud) => stud.status === 'Active');
        this.totalModules = results.length;
        this.dataSource = new MatTableDataSource(this.tableData);
      });
  }

  getBatches() {
    this.batchService.getAllCourseBatches().subscribe((result) => {
      this.batchDataSource = new MatTableDataSource(result);
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
}
