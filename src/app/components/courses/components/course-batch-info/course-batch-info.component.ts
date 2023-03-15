import { Component, OnInit, ViewChild,OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CourseBatchesService } from '../../services/course-batches.service';

@Component({
  selector: 'app-course-batch-info',
  templateUrl: './course-batch-info.component.html',
  styleUrls: ['./course-batch-info.component.scss'],
})
export class CourseBatchInfoComponent implements OnInit,OnDestroy {
  courseBatchInfo: any;
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  displayedColumns: string[] = [
    'student_id',
    'name',
    'email',
    'fees',
    'status',
  ];

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private courseBatchService: CourseBatchesService) {}
ngOnDestroy(): void {
    localStorage.removeItem('batch_id')
}
  ngOnInit() {
    this.fetchBatchInfo();
    this.fetchBatchStudents();
    //this.fetchBatchPastStudents();
  }
  split(string) {
    return string.split(' ').join('');
  }
  fetchBatchInfo() {
    this.courseBatchService
      .getCourseBatchById(localStorage['batch_id'])
      .subscribe((data: any) => {
        this.courseBatchInfo = data;
      });
  }

  fetchBatchStudents() {
    this.courseBatchService
      .getStudentsUnderBatch(localStorage['batch_id'])
      .subscribe((data: any) => {
        this.dataSource = new MatTableDataSource(data);
      });
  }


  fetchBatchPastStudents() {
    this.courseBatchService
      .getPastStudentsUnderBatch(localStorage['batch_id'])
      .subscribe((data: any) => {
        this.dataSource = new MatTableDataSource(data);
      });
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
