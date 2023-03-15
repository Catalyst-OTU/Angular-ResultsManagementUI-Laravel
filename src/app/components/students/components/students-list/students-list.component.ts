import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CardItem, Student } from '../../interfaces/models';
import { StudentsService } from '../../services/students.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { StudentsFormComponent } from '../students-form/students-form.component';
import { errorAlert, successAlert } from 'src/app/utils/constants';
import { AuthenticationService } from 'src/app/services/auth.service';
import { Role, User } from 'src/app/interfaces/all-models';
import { DialogService } from 'src/app/services/dialog.service';
import { CoursesService } from '../../../courses/services/course.service';

@Component({
  selector: 'app-students-list',
  templateUrl: './students-list.component.html',
  styleUrls: ['./students-list.component.css'],
})
export class StudentsListComponent implements OnInit, AfterViewInit {
  totalStudent: any;
  activeStudents: number;
  inactiveStudents: number;
  cardsData: CardItem[];
  id_number: any;

  data: any[];
  displayedColumns: string[] = [
    'student_id',
    'name',
    'email',
    'fees',
    'status',
    'actions',
  ];
  dataSource: MatTableDataSource<Student> = new MatTableDataSource([]);
  user: User;
  cred;
  constructor(
    private studentService: StudentsService,
    private router: Router,
    public dialog: MatDialog,
    public dialogService: DialogService,
    private authenticationService: AuthenticationService,
    private courseService: CoursesService
  ) {
    this.authenticationService.user.subscribe((x) => (this.user = x));
  }
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.loadData();
    this.loadStats();
  }

  loadData = () => {
    this.studentService.getAllStudent().subscribe((stdudents) => {
      this.data = stdudents.filter((stud) => stud.status === 'Active');
      this.dataSource = new MatTableDataSource(this.data);
    });
  };
  split(string) {
    return string.split(' ').join('');
  }
  
  loadStats = () => {
    this.studentService.getStudentStats().subscribe((totstudents) => {
      this.totalStudent = totstudents.total;
      this.activeStudents = totstudents.active;
      this.inactiveStudents = totstudents.inactive;


      this.cardsData = [
        {

          messages: [
            {
              headerMessage: 'Total Students',
              headerValue: this.totalStudent,
            },
          ],
          headerIcon: 'fas fa-user-graduate',
          headerColor: '#ef5350',
        },
        {
          messages: [
            {
              headerMessage: 'Active Students',
              headerValue: this.activeStudents || 0,
            },
          ],
          headerIcon: 'fas fa-eye',
          headerColor: '#68EF50',
        },
        {
          messages: [
            {
              headerMessage: 'Inactive Students',
              headerValue: this.inactiveStudents || 0,
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
    this.router.navigate(['/student-info']);
    localStorage.setItem('student_id', data.id);
  }

  openDialog(data: Student) {
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
    this.dialog.open(StudentsFormComponent, dialogConfig);
  }

  openAddDialog() {
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
    this.dialog.open(StudentsFormComponent, dialogConfig);
  }

  openCourseDialog(data) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.position = {
      top: '19vh',
      left: '35vw',
    };
    dialogConfig.width = '600px';
    dialogConfig.height = 'auto';

    dialogConfig.data = {
      type: 'course',
      ...data,
    };
    this.dialog.open(StudentsFormComponent, dialogConfig);
  }
  openConfirmDialog(data) {
    const upp = data.name.toUpperCase();
    this.dialogService
      .confirmDialog({
        title: 'Confirm Disable Action ?',
        message: `Are you sure you want to disable : ${upp}`,
        confirmCaption: 'Yes',
        cancelCaption: 'No',
      })
      .subscribe((yes) => {
        if (yes) {
          this.disableStudent(data);
        }
      });
  }

  disableStudent(data: Student) {
    const updateData = {
      name: data.name,
      contact: data.contact,
      student_id: data.student_id,
      date_of_birth: data.date_of_birth,
      gender: data.gender,
      //usertype: 'Student',
      email: data.email,
      // course_name: formValues.course,
      course_id: data.course_id,
      fees: data.fees,
      id: data.id,

      status: 'InActive',
    };
    if (data.id) {
      this.studentService
        .updateResource(updateData, 'updateStudent')
        .subscribe((d: any) => {
          successAlert('Student Updated Successfully');
        });
    }
  }
  deleteStudent = (data) => {
    this.studentService.deleteResource(`delete/${data}`).subscribe(
      (success) => {
        return successAlert('Student Deleted Successfully');
      },
      (error) => {
        return errorAlert('Error Occured');
      }
    );
  };
}
