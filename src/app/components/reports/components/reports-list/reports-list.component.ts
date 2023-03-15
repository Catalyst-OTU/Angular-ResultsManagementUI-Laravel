import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { CardItem } from '../../interfaces/models';
import { CoursesService } from 'src/app/components/courses/services/course.service';
import { ModuleService } from 'src/app/components/course-modules/services/course-module.service';
import { StaffService } from 'src/app/components/staff/services/staff.service';
import { StudentsService } from 'src/app/components/students/services/students.service';

@Component({
  selector: 'app-reports-list',
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.css'],
})
export class ReportsListComponent implements OnInit, AfterViewInit {
  cardsData: CardItem[] = [
    {
      messages: [{ headerMessage: 'Total Students', headerValue: '14' }],
      headerIcon: 'fas fa-user-graduate',
      headerColor: '#ef5350',
    },
    {
      messages: [{ headerMessage: 'Total Staff', headerValue: '10' }],
      headerIcon: 'fas fa-chalkboard-teacher',
      headerColor: '#50C8EF',
    },
    {
      messages: [{ headerMessage: 'Total Courses', headerValue: '10' }],
      headerIcon: 'fas fa-scroll',
      headerColor: '#68EF50',
    },
    {
      messages: [{ headerMessage: 'Total Modules', headerValue: '10' }],
      headerIcon: 'fas fa-th',
      headerColor: '#50C8EF',
    },
  ];
  navLinks: any[];
  activeLinkIndex = 0;
  data: any[];
  displayedColumns: string[] = [
    'studentActions',
    'staffActions',
    'courseActions',
    'moduleActions',
  ];
  columns: string[] = [];
  dataSource = new MatTableDataSource<any>();

  constructor(
    private router: Router,
    private studentService: StudentsService,
    private courseService: CoursesService,
    private moduleService: ModuleService,
    private staffService: StaffService,
    private changeDetectorRefs: ChangeDetectorRef
  ) {
    this.navLinks = [
      {
        label: 'Students',
        icon: 'fas fa-user-graduate',
        index: 0,
      },
      {
        label: 'Staff',
        icon: 'fas fa-chalkboard-teacher',
        index: 1,
      },
      {
        label: 'Courses',
        icon: 'fas fa-scroll',
        index: 2,
      },
      {
        label: 'Course Modules',
        icon: 'fas fa-th',
        index: 3,
      },
    ];
  }

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.loadData();
  }
  getStudentColumns() {
    /*assume this is an api*/
    return new Promise((resolve, reject) => {
      resolve(['student_id', 'name', 'email', 'course']);
    });
  }
  getLecturerColumns() {
    /*assume this is an api*/
    return new Promise((resolve, reject) => {
      resolve(['staff_id', 'name', 'email']);
    });
  }
  getCourseColumns() {
    /*assume this is an api*/
    return new Promise((resolve, reject) => {
      resolve([
        'course_name',
        'course_level',
        'course_start_date',
        'certificate_issuedate',
      ]);
    });
  }
  getModuleColumns() {
    /*assume this is an api*/
    return new Promise((resolve, reject) => {
      resolve(['module_name', 'course_name', 'staff_name']);
    });
  }
  // ngOnInit() {
  //   // Get list of columns by gathering unique keys of objects found in DATA.
  //   const columns = DATA
  //     .reduce((columns, row) => {
  //       return [...columns, ...Object.keys(row)]
  //     }, [])
  //     .reduce((columns, column) => {
  //       return columns.includes(column)
  //         ? columns
  //         : [...columns, column]
  //     }, [])
  //   // Describe the columns for <mat-table>.
  //   this.columns = columns.map(column => {
  //     return {
  //       columnDef: column,
  //       header: column,
  //       cell: (element: any) => `${element[column] ? element[column] : ``}`
  //     }
  //   })
  //   this.displayedColumns = this.columns.map(c => c.columnDef);
  //   // Set the dataSource for <mat-table>.
  //   this.dataSource = DATA
  // }

  // }
  async loadData() {
    this.studentService.getAllStudent().subscribe((stdudents) => {
      this.data = stdudents;
      this.dataSource = new MatTableDataSource(this.data);
    });
    return this.getStudentColumns().then((cols: string[]) => {
      this.displayedColumns.splice(0, this.displayedColumns.length);
      this.displayedColumns.push(...cols, 'studentActions');
      this.columns = cols;
    });
  }

  async loadLecturers() {
    this.staffService.getAllStaffs().subscribe((staffs) => {
      this.data = staffs;
      this.dataSource = new MatTableDataSource(this.data);
    });
    return this.getLecturerColumns().then((cols: string[]) => {
      this.displayedColumns.splice(0, this.displayedColumns.length);
      this.displayedColumns.push(...cols, 'staffActions');
      this.columns = cols;
    });
  }

  async loadCourses() {
    this.courseService.getAllCourse().subscribe((courses) => {
      this.data = courses;
      this.dataSource = new MatTableDataSource(this.data);
    });
    return this.getCourseColumns().then((cols: string[]) => {
      this.displayedColumns.splice(0, this.displayedColumns.length);
      this.displayedColumns.push(...cols, 'courseActions');
      this.columns = cols;
    });
  }

  async loadModules() {
    this.moduleService.getAllModules().subscribe((modules) => {
      this.data = modules;
      this.dataSource = new MatTableDataSource(this.data);
    });
    return this.getModuleColumns().then((cols: string[]) => {
      this.displayedColumns.splice(0, this.displayedColumns.length);
      this.displayedColumns.push(...cols, 'moduleActions');
      this.columns = cols;
    });
  }

  cons(element) {
    console.log(element);
  }

  // split(string) {
  //   return string.split(' ').join('');
  // }
  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    setTimeout(() => (this.dataSource.paginator = this.paginator));
  }

  tabChanged = (tabChangeEvent: MatTabChangeEvent) => {
    switch (tabChangeEvent.index) {
      case 0:
        return this.loadData(), this.changeDetectorRefs.detectChanges();
      case 1:
        return this.loadLecturers(), this.changeDetectorRefs.detectChanges();

      case 2:
        return this.loadCourses(), this.changeDetectorRefs.detectChanges();
      case 3:
        return this.loadModules(), this.changeDetectorRefs.detectChanges();
      default:
        return this.loadData(), this.changeDetectorRefs.detectChanges();
    }
  };

  capitalizeFirstLetter(str) {
    return str[0].toUpperCase() + str.slice(1);
  }

  openGrade() {
    this.router.navigate(['/student-result']);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
