import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { ResourceService } from 'src/app/services/resources';
import { forkJoin } from 'rxjs';
const ENDPOINT = 'students';

@Injectable({
  providedIn: 'root',
})
export class DashboardService extends ResourceService {
  constructor(http: HttpClient) {
    super(http, ENDPOINT);
  }

  getTotalStudents() {
    let studentTotal = super.getResources(null, 'api/students/countStudent');
    let staffTotal = super.getResources(null, 'api/staffs/countStaff');
    let moduleTotal = super.getResources(null, 'api/modules/countModule');
    let courseTotal = super.getResources(null, 'api/courses/countCourses');
    forkJoin([studentTotal, staffTotal, moduleTotal, courseTotal]).subscribe(
      (results) => {
        var data = [];

        data.push({
          student: results[0],
          staff: results[1],
          module: results[2],
          course: results[3],
        });
        return console.log(data);
        // results[0] is our character
        // results[1] is our character homeworld
        // console.log(results);
      }
    );
  }

  getTotalStaff() {
    return super.getResources(null, 'api/staffs/countStaff').pipe(
      map((response: any) => {
        let studentInfo: any = response.data;
        return studentInfo;
      })
    );
  }

  getTotalModules() {
    return super.getResources(null, 'api/modules/countModule').pipe(
      map((response: any) => {
        let studentInfo: any = response.data;
        return studentInfo;
      })
    );
  }

  getTotalCourses() {
    return super.getResources(null, 'api/courses/countCourses').pipe(
      map((response: any) => {
        let studentInfo: any = response.data;
        return studentInfo;
      })
    );
  }
}
