import { Injectable } from '@angular/core';
import { courseList } from '../utils/constants';
import { ResourceService } from '../../../services/resources';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Course } from '../interfaces/model';

const ENDPOINT = 'courses';

@Injectable({
  providedIn: 'root',
})
export class CoursesService extends ResourceService {
  constructor(http: HttpClient) {
    super(http, ENDPOINT);
  }

  getAllCourses() {
    let coursesArray = courseList;
    return coursesArray;
  }
  getAllCourse() {
    return super.getResources(null, 'api/courses/getAllCourses').pipe(
      map((response: any) => {
        let coursesArray: any[] = response.data;
        // studentsArray.map(value => {
        //   value.full_name = `${value.first_name} ${value.last_name}`;
        // });
        return coursesArray as Course[];
      })
    );
  }
  getTotalCourses() {
    return super.getResources(null, 'api/courses/countCourses');
  }

  getCourseStats() {
    return super.getResources(null, 'api/courses/getAllCourses').pipe(
      map((response: any) => {
        let responseArray: any[] = response.data;
        let activeArray = responseArray.filter((m) => m.status == 'Active');
        let inactiveArray = responseArray.filter((m) => m.status == 'InActive');

        return {
          total: responseArray.length,
          active: activeArray.length,
          inactive: inactiveArray.length,
        };
      })
    );
  }

  getStudentsCourses(studentId) {
    return super
      .getResources(null, 'api/courses/findStudentCourses', true, {
        student_id: studentId,
      })
      .pipe(
        map((response: any) => {
          let coursesArray: any[] = response.data;
          // studentsArray.map(value => {
          //   value.full_name = `${value.first_name} ${value.last_name}`;
          // });
          return coursesArray as Course[];
        })
      );
  }

  getStudentsPastCourses(studentId) {
    return super
      .getResources(null, `api/courses/findPastStudentCourses`, true, {
        student_id: studentId,
      })
      .pipe(
        map((response: any) => {
          let resultsArray: any = response.data;

          return resultsArray;
        })
      );
  }
  getStaffsCourses(staffId) {
    return super
      .getResources(null, 'api/courses/findStaffCourses', true, {
        staff_id: staffId,
      })
      .pipe(
        map((response: any) => {
          let coursesArray: any[] = response.data;
          // studentsArray.map(value => {
          //   value.full_name = `${value.first_name} ${value.last_name}`;
          // });
          return coursesArray as Course[];
        })
      );
  }

  getTotalModules(courseId) {
    return super
      .getResources(null, 'api/courses/totalNumberOfModulesUnderEachCourse', true, {
        id: courseId,
      })
      .pipe(
        map((response: any) => {
          let totalNum = response.data;
          return totalNum;
        })
      );
  }
  getTotalStudents(courseId) {
    return super
      .getResources(
        null,
        'api/courses/totalNumberOfStudentsUnderEachCourse',
        true,
        {
          id: courseId,
        }
      )
      .pipe(
        map((response: any) => {
          let totalNum = response.data;
          return totalNum;
        })
      );
  }

  getResultCourseByStudentIdAndCourse(studentId, courseId) {
    return super
      .getResources(null, `api/courses/selectingFromCourseForResults`, true, {
        student_id: studentId,
        course_id: courseId,
      })
      .pipe(
        map((response: any) => {
          let resultsArray: any = response.data;

          return resultsArray;
        })
      );
  }
}
