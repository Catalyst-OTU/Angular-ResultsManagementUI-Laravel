import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/interfaces/all-models';
import { DialogService } from 'src/app/services/dialog.service';
import { errorAlert, successAlert } from 'src/app/utils/constants';
// import { ConfirmDialogModel, ConfirmationComponentComponent } from 'src/app/components/confirmation-component/confirmation-component.component';
import { CardItem, CourseModule } from '../../interfaces/models';
import { ModuleService } from '../../services/course-module.service';
import { ModuleFormComponent } from '../module-form/module-form.component';

@Component({
  selector: 'app-module-list',
  templateUrl: './module-list.component.html',
  styleUrls: ['./module-list.component.css'],
})
export class ModuleListComponent implements OnInit {
  totalModules: any;
  activeModules: any;
  inactiveModules: any;
  cardsData: CardItem[];

  data: any[];
  displayedColumns: string[] = ['module_name', 'status', 'actions'];
  dataSource: MatTableDataSource<CourseModule> = new MatTableDataSource([]);
  user: User;

  constructor(
    private moduleService: ModuleService,
    private router: Router,
    public dialog: MatDialog,
    public dialogService: DialogService,
    private route: ActivatedRoute,
    public datepipe: DatePipe
  ) {
    this.user = JSON.parse(localStorage.getItem('user'));
  }
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.loadData();
    this.loadStats();
  }
  loadData = () => {
    this.moduleService.getAllModules().subscribe((modules:any) => {
      if (this.user.department === 'Instructor') {
        this.data = modules.filter(
          (stud) =>
            stud.status === 'Active' && stud.staff_name === this.user.name
        );
      } else {
        this.data = modules.data.filter((stud) => stud.status === 'Active');
      }
      this.dataSource = new MatTableDataSource(this.data);
      // this.activeModules=this.data.filter(m=>m.status=="Active").length
      // this.inactiveModules = this.data.length - this.activeModules
    });
  };
  loadStats = () => {
    this.moduleService.getModuleStats().subscribe((mod) => {
      this.activeModules = mod.active;
      this.inactiveModules = mod.inactive;
      this.totalModules = mod.total;

      Promise.resolve().then(
        () =>
          (this.cardsData = [
            {
              messages: [
                {
                  headerMessage: 'Total Modules',
                  headerValue: this.totalModules || 0,
                },
              ],
              headerIcon: 'fas fa-th',
              headerColor: '#ef5350',
            },
            {
              messages: [
                {
                  headerMessage: 'Active Modules',
                  headerValue: this.activeModules || 0,
                },
              ],
              headerIcon: 'fas fa-eye',
              headerColor: '#68EF50',
            },
            {
              messages: [
                {
                  headerMessage: 'Inactive Modules',
                  headerValue: this.inactiveModules || 0,
                },
              ],
              headerIcon: 'fas fa-eye-slash',
              headerColor: '#50C8EF',
            },
          ])
      );
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
  async openInfoDialog(data) {
    await localStorage.setItem('module_id', data.id);
    return this.router.navigate(['/module-info']);
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
    this.dialog.open(ModuleFormComponent, dialogConfig);
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
    this.dialog.open(ModuleFormComponent, dialogConfig);
  }

  openConfirmDialog(data) {
    const upp = data.module_name.toUpperCase();
    this.dialogService
      .confirmDialog({
        title: 'Confirm Disable Action ?',
        message: `Are you sure you want to disable : ${upp}`,
        confirmCaption: 'Yes',
        cancelCaption: 'No',
      })
      .subscribe((yes) => {
        if (yes) {
          this.deleteModule(data);
        }
      });
  }

  async openUpload(data) {
    await localStorage.setItem('module_id', data.id);
    return this.router.navigate(['/upload-grade']);
  }

  disableModule(data: CourseModule) {
    const updateData = {
      id: data.id,
      module_name: data.module_name,
      //course_name: data.course_name,
      //staff_name: data.staff_name,
      course_id: data.course_id,
      status: 'InActive',
      // module_end_date: this.datepipe.transform(
      //   data.module_end_date,
      //   'yyyy/MM/dd'
      // ),
      // module_start_date: this.datepipe.transform(
      //   data.module_start_date,
      //   'yyyy/MM/dd'
      // ),
    };
    if (data.id) {
      this.moduleService
        .updateResource(updateData, 'updateModules')
        .subscribe((d: any) => {
          successAlert('Module Disabled Successfully');
        });
    }
  }
  deleteModule = (data) => {
    this.moduleService.deleteResource(`deleteModulesById/${data}`).subscribe(
      (success) => {
        return successAlert('Module Deleted Successfully');
      },
      (error) => {
        return errorAlert('Error Occured');
      }
    );
  };
}
