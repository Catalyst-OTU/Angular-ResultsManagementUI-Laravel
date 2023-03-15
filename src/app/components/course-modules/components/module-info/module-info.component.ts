import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { CourseModule } from '../../interfaces/models';
import { MatPaginator } from '@angular/material/paginator';
import { ModuleService } from '../../services/course-module.service';
import { StudentsService } from 'src/app/components/students/services/students.service';

@Component({
  selector: 'app-module-info',
  templateUrl: './module-info.component.html',
  styleUrls: ['./module-info.component.scss'],
})
export class ModuleInfoComponent implements OnInit {
  data: any[];
  tableData: any[];
  moduleInfo: CourseModule | undefined;

  displayedColumns: string[] = ['course_id', 'module_name'];
  dataSource: MatTableDataSource<CourseModule> = new MatTableDataSource([]);

  constructor(
    private moduleService: ModuleService,
    private studentService: StudentsService
  ) {}

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.loadStudents();
    this.loadInfo();
  }
  // loadData = () => {
  //   this.tableData = this.moduleService.getAllModuless();
  //   this.dataSource = new MatTableDataSource(this.tableData);
  // };
  loadStudents() {
    this.studentService
      .getStudentsModule(localStorage['module_id'])
      .subscribe((results) => {
        this.tableData = results.filter((stud) => stud.status === 'Active');
        this.dataSource = new MatTableDataSource(this.tableData);
      });
  }
  async loadInfo() {
    this.moduleService.getAllModules().subscribe((result:any) => {
      this.moduleInfo = result.data.find((a) => a.id == localStorage['module_id']);
      // console.log(this.moduleInfo);
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
