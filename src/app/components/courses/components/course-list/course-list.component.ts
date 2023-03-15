import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CardItem, Course } from '../../interfaces/model';
import { CoursesService } from '../../services/course.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CourseFormComponent } from '../course-form/course-form.component';
// import { ConfirmDialogModel, ConfirmationComponentComponent } from 'src/app/components/confirmation-component/confirmation-component.component';
import { AddModuleComponent } from '../add-module/add-module.component';
import { errorAlert, successAlert } from 'src/app/utils/constants';
import { DialogService } from 'src/app/services/dialog.service';
import { DatePipe } from '@angular/common';
import { User } from 'src/app/interfaces/all-models';
import { AddCourseBatchComponent } from '../add-course-batch/add-course-batch.component';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css'],
})
export class CourseListComponent implements OnInit {
  totalCourses: any;
  activeCourses: number;
  inactiveCourses: number;
  cardsData: CardItem[];

  id_number: any;
  data: any[];
  displayedColumns: string[] = ['course_name', 'actions'];
  dataSource: MatTableDataSource<Course> = new MatTableDataSource([]);
  user: User;

  constructor(
    private courseService: CoursesService,
    private router: Router,
    public dialog: MatDialog,
    public datepipe: DatePipe,
    public dialogService: DialogService
  ) {
    this.user = JSON.parse(localStorage.getItem('user'));
  }
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.loadData();
    Promise.resolve().then(() => this.loadStats());
  }
  loadData = () => {
    this.courseService.getAllCourse().subscribe((courses) => {
      this.data = courses;
      // this.dataSource = new MatTableDataSource(this.data);
      if (this.user.usertype === 'Course Cordinator') {
        this.data = courses.filter(
          (stud) =>
            stud.status === 'Active' && stud.coordinator === this.user.name
        );

        this.dataSource = new MatTableDataSource(this.data);
      } else {
        this.data = courses.filter((stud) => stud.status === 'Active');
        this.dataSource = new MatTableDataSource(this.data);
      }
    });
  };

  loadStats = () => {
    this.courseService.getCourseStats().subscribe((totcourses) => {
      this.totalCourses = totcourses.total;
      this.activeCourses = totcourses.active;
      this.inactiveCourses = totcourses.inactive;
      this.cardsData = [
        {
          messages: [
            { headerMessage: 'Total Courses', headerValue: this.totalCourses },
          ],
          headerIcon: 'fas fa-scroll',
          headerColor: '#ef5350',
        },
        {
          messages: [
            {
              headerMessage: 'Active Courses',
              headerValue: this.activeCourses || '3',
            },
          ],
          headerIcon: 'fas fa-eye',
          headerColor: '#68EF50',
        },
        {
          messages: [
            {
              headerMessage: 'Inactive Courses',
              headerValue: this.inactiveCourses,
            },
          ],
          headerIcon: 'fas fa-eye-slash',
          headerColor: '#50C8EF',
        },
      ];
    });
  };
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
  openInfoDialog(data) {
    this.router.navigate(['/course-info']);
    localStorage.setItem('course_id', data.id);
  }
  openDialog(data) {
    // debugger;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.position = {
      top: '10vh',
      left: '30vw',
    };
    dialogConfig.width = '600px';
    dialogConfig.height = 'auto';

    dialogConfig.data = {
      ...data,
      type: 'update',
    };
    this.dialog.open(CourseFormComponent, dialogConfig);
  }

  openAddDialog() {
    // debugger;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.position = {
      top: '10vh',
      left: '30vw',
    };
    dialogConfig.width = '600px';
    dialogConfig.height = 'auto';

    dialogConfig.data = {
      type: 'add',
    };
    this.dialog.open(CourseFormComponent, dialogConfig);
  }

  openModuleDialog(data) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.position = {
      top: '10vh',
      left: '30vw',
    };
    dialogConfig.width = '600px';
    dialogConfig.height = 'auto';

    dialogConfig.data = {
      ...data,
    };
    this.dialog.open(AddModuleComponent, dialogConfig);
  }

  openBatchDialog(data) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.position = {
      top: '10vh',
      left: '30vw',
    };
    dialogConfig.width = '600px';
    dialogConfig.height = 'auto';

    dialogConfig.data = {
      ...data,
      type: 'add',
      origin: 'list',
    };
    this.dialog.open(AddCourseBatchComponent, dialogConfig);
  }

  openConfirmDialog(data) {
    const upp = data.course_name.toUpperCase();
    this.dialogService
      .confirmDialog({
        title: 'Confirm Disable Action ?',
        message: `Are you sure you want to disable : ${upp}`,
        confirmCaption: 'Yes',
        cancelCaption: 'No',
      })
      .subscribe((yes) => {
        if (yes) {
          this.disableCourse(data);
        }
      });
  }

  disableCourse(data: Course) {
    const updateData = {
      course_name: data.course_name,
      course_level: data.course_level,
      course_start_date: this.datepipe.transform(
        data.course_start_date,
        'yyyy/MM/dd'
      ),
      course_end_date: this.datepipe.transform(
        data.course_end_date,
        'yyyy/MM/dd'
      ),
      certificate_issuedate: this.datepipe.transform(
        data.certificate_issuedate,
        'yyyy/MM/dd'
      ),
      id: data.id,
      status: 'InActive',
    };
    if (data.id) {
      this.courseService
        .updateResource(updateData, 'updateCourses')
        .subscribe((d: any) => {
          successAlert('Course Disabled Successfully');
        });
    }
  }
  deleteCourse = (data) => {
    this.courseService.deleteResource(`deleteCourseById/${data}`).subscribe(
      (success) => {
        return successAlert('Course Deleted Successfully');
      },
      (error) => {
        if (error.status == 500) {
          return errorAlert(`Error Occured Course has dependent modules`);
        }
      }
    );
  };
}
