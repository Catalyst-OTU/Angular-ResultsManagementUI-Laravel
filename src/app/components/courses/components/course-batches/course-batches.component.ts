import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/all-models';
import { DialogService } from 'src/app/services/dialog.service';
import { CardItem, Course } from '../../interfaces/model';
import { CourseBatchesService } from '../../services/course-batches.service';
import { AddCourseBatchComponent } from '../add-course-batch/add-course-batch.component';
import { CourseFormComponent } from '../course-form/course-form.component';

@Component({
  selector: 'app-course-batches',
  templateUrl: './course-batches.component.html',
  styleUrls: ['./course-batches.component.scss'],
})
export class CourseBatchesComponent implements OnInit {
  totalCourseBatches: any;
  activeCourseBatches: number;
  inactiveCourseBatches: number;

  id_number: any;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  cardsData: CardItem[];
  displayedBatchColumns: string[] = [
    'course_name',
    'course_level',
    'coordinator',
    'course_start_date',
    'course_end_date',
    'actions',
  ];
  batchDataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  user: User;
  data: any[];

  constructor(
    private batchService: CourseBatchesService,
    public dialogService: DialogService,
    public dialog: MatDialog,
    private router: Router
  ) {
    this.user = JSON.parse(localStorage.getItem('user'));
  }


  ngOnInit() {

    this.batchService.getCourseBatchStats().subscribe((totcoursebatches) => {
      this.totalCourseBatches = totcoursebatches.total;
      this.activeCourseBatches = totcoursebatches.active;
      this.inactiveCourseBatches = totcoursebatches.inactive;


    this.cardsData = [
      {
        messages: [{ headerMessage: 'Total Batches',
         headerValue: this.totalCourseBatches }],
        headerIcon: 'fas fa-scroll',
        headerColor: '#ef5350',
      },
      {
        messages: [
          {
            headerMessage: 'Active Batches',
            headerValue: this.activeCourseBatches,
          },
        ],
        headerIcon: 'fas fa-eye',
        headerColor: '#68EF50',
      },
      {
        messages: [
          {
            headerMessage: 'Inactive Batches',
            headerValue: this.inactiveCourseBatches,
          },
        ],
        headerIcon: 'fas fa-eye-slash',
        headerColor: '#50C8EF',
      },
    ];
    this.fetchBatches();

  });
  }

  fetchBatches() {
    if (this.user.usertype === 'Instructor') {
      this.getInstructorBatches();
    } else if (this.user.usertype === 'Course Cordinator') {
      this.getCoordinatorBatches();
    } else {
      this.getBatches();
    }
  }

  getBatches() {
    this.batchService.getAllCourseBatches().subscribe((result) => {
      this.data = result;

      this.batchDataSource = new MatTableDataSource(this.data);
    });
  }

  getCoordinatorBatches() {
    this.batchService.getAllCourseBatches().subscribe((result) => {
      this.data = result;

      this.data = result.filter((stud) => stud.coordinator === this.user.name);

      this.batchDataSource = new MatTableDataSource(this.data);
    });
  }
  getInstructorBatches() {
    this.batchService
      .getInstructorBatches(this.user?.name)
      .subscribe((result) => {
        this.data = result;
        this.batchDataSource = new MatTableDataSource(this.data);
      });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.batchDataSource.filter = filterValue.trim().toLowerCase();

    if (this.batchDataSource.paginator) {
      this.batchDataSource.paginator.firstPage();
    }
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
    this.dialog.open(AddCourseBatchComponent, dialogConfig);
  }
  openUpdateDialog(data) {
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
          this.disableCourseBatch(data);
        }
      });
  }

  openInfoDialog(data) {
    this.router.navigate(['/batch-info']);
    localStorage.setItem('batch_id', data.id);
  }

  disableCourseBatch(data) {}
}
