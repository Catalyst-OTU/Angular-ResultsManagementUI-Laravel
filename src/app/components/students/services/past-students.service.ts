import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResourceService } from 'src/app/services/resources';
import { map } from 'rxjs/operators';

const ENDPOINT = 'pastStudents';

@Injectable({
  providedIn: 'root',
})
export class PastStudentsService extends ResourceService {
  constructor(http: HttpClient) {
    super(http, ENDPOINT);
  }

  getPastStudentInfoIdAndCourse(studentId, courseId) {
    return super
      .getResources(
        null,
        `api/pastStudents/selectingFromPastStudentForResults`,
        true,
        {
          student_id: studentId,
          batch_id: courseId,
        }
      )
      .pipe(
        map((response: any) => {
          let resultsArray: any = response;

          return resultsArray;
        })
      );
  }

  findPastStudentByStudentId(studentId) {
    return super
      .getResources(null, `api/pastStudents/findPastStudentById/`, true, {
        id: studentId,
      })
      .pipe(
        map((response: any) => {
          let resultsArray: any = response;

          return resultsArray;
        })
      );
  }

  getPastStudentCoursBatches(studentId) {
    return super
      .getResources(
        null,
        `api/pastStudents/retrievingOnlyPastStudentStudentID/`,
        true,
        {
          id: studentId,
        }
      )
      .pipe(
        map((response: any) => {
          let resultsArray: any = response;

          return resultsArray;
        })
      );
  }
}
