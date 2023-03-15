import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DialogService } from 'src/app/services/dialog.service';
import { errorAlert, successAlert } from 'src/app/utils/constants';
import { CardItem, User } from '../../interfaces/model';
import { UserService } from '../../services/users.service';
import { UsersFormComponent } from '../users-form/users-form.component';
import { UsersInfoComponent } from '../users-info/users-info.component';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
})
export class UsersListComponent implements OnInit {
  totalUsers: any;
  activeUsers: number;
  inactiveUsers: number;
  cardsData: CardItem[];

  data: any[];
  displayedColumns: string[] = [
    'staff_id',
    'email',
    'usertype',
    'status',
    'actions',
  ];
  dataSource: MatTableDataSource<User> = new MatTableDataSource([]);

  constructor(
    private userService: UserService,
    private router: Router,
    public dialog: MatDialog,
    public dialogService: DialogService
  ) {}
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  ngOnInit(): void {
    this.loadData();
    Promise.resolve().then(() => this.loadStats());
  }
  loadData = () => {
    this.userService.getAllUsers().subscribe((users) => {
      this.data = users.filter((stud) => stud.status === 'Active');
      this.dataSource = new MatTableDataSource(this.data);
    });
  };
  loadStats = () => {
    this.userService.getUsersStats().subscribe((totusers) => {
      this.totalUsers = totusers.total;
      this.activeUsers = totusers.active;
      this.inactiveUsers = totusers.inactive;
      this.cardsData = [
        {
          messages: [
            { headerMessage: 'Total Users', headerValue: this.totalUsers },
          ],
          headerIcon: 'fas fa-th',
          headerColor: '#ef5350',
        },
        {
          messages: [
            { headerMessage: 'Active Users', headerValue: this.activeUsers },
          ],
          headerIcon: 'fas fa-eye',
          headerColor: '#68EF50',
        },
        {
          messages: [
            {
              headerMessage: 'Inactive Users',
              headerValue: this.inactiveUsers,
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

  split(string) {
    return string.split(' ').join('');
  }

  // openInfoDialog(data) {
  //   this.router.navigate(['/users-info']);
  //   localStorage.setItem('users_id', data.id);
  // }

  openInfoDialog(data) {
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
    };
    this.dialog.open(UsersInfoComponent, dialogConfig);
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
    this.dialog.open(UsersFormComponent, dialogConfig);
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
    this.dialog.open(UsersFormComponent, dialogConfig);
  }

  openConfirmDialog(data) {
    const upp = data.email.toUpperCase();
    this.dialogService
      .confirmDialog({
        title: 'Confirm Disable Action ?',
        message: `Are you sure you want to disable : ${upp}`,
        confirmCaption: 'Yes',
        cancelCaption: 'No',
      })
      .subscribe((yes) => {
        if (yes) {
          this.disableUser(data);
        }
      });
  }

  openUpload(data) {
    this.router.navigate(['/upload-grade']);
  }

  disableUser(data: User) {
    const updateData = {
      password: data.password,
      usertype: data.usertype,
      staff_id: data.staff_id,
      email: data.email,
      id: data.id,
      status: 'InActive',
    };
    if (data.id) {
      this.userService
        .updateResource(updateData, 'updateUsers')
        .subscribe((d: any) => {
          successAlert('User Disabled Successfully');
        });
    }
  }
  // disableUser = (data) => {
  //   this.userService.deleteResource(`delete/${data}`).subscribe(
  //     (success) => {
  //       return successAlert('User Deleted Successfully');
  //     },
  //     (error) => {
  //       return errorAlert('Error Occured');
  //     }
  //   );
  // };
}
