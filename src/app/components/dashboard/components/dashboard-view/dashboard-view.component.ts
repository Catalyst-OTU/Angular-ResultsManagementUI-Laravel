import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/all-models';
import { CardItem } from '../../interfaces/models';
import { saleData, gridData } from '../../utils/constants';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.scss'],
})
export class DashboardViewComponent implements OnInit {
  saleData;
  user: User;
  single: any[];
  view: any = [700, 400];
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5'],
  };
  cardsData: CardItem[];
  totalStudents;
  totalStaff;
  totalModules;
  totalCourses;

  constructor(private http: HttpClient) {
    Object.assign(this, { gridData });
  }

  ngOnInit(): void {
    this.saleData = saleData;
    this.getDashStats();
  }

  getDashStats() {
    let studentTotal = this.http.get(
      environment.API_BASE + 'api/students/countStudent'
    );
    let staffTotal = this.http.get(environment.API_BASE + 'api/staffs/countStaff');
    let moduleTotal = this.http.get(
      environment.API_BASE + 'api/modules/countModule'
    );
    let courseTotal = this.http.get(
      environment.API_BASE + 'api/courses/countCourses'
    );
    forkJoin([studentTotal, staffTotal, moduleTotal, courseTotal]).subscribe(
      (results) => {
        this.totalStudents = results[0];
        this.totalModules = results[2];
        this.totalStaff = results[1];
        this.totalCourses = results[3];
        console.log(results);
        this.cardsData = [
          {
            messages: [
              {
                headerMessage: 'Total Students',
                headerValue: this.totalStudents || 0,
              },
            ],
            headerIcon: 'fas fa-user-graduate',
            headerColor: '#ef5350',
          },
          {
            messages: [
              {
                headerMessage: 'Total Courses',
                headerValue: this.totalCourses || 0,
              },
            ],
            headerIcon: 'fas fa-scroll',
            headerColor: '#68EF50',
          },
          {
            messages: [
              {
                headerMessage: 'Total Modules',
                headerValue: this.totalModules || 0,
              },
            ],
            headerIcon: 'fas fa-th',
            headerColor: '#50C8EF',
          },
          {
            messages: [
              {
                headerMessage: 'Total Staff',
                headerValue: this.totalStaff || 0,
              },
            ],
            headerIcon: 'fas fa-chalkboard-teacher',
            headerColor: '#EBB6FB',
          },
        ];
      }
    );
  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
}
