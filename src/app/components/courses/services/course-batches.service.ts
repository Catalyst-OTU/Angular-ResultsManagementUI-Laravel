import { Injectable, ElementRef } from '@angular/core';
import { courseList } from '../utils/constants';
import { ResourceService } from '../../../services/resources';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Course } from '../interfaces/model';

const ENDPOINT = 'courseBatch';

@Injectable({
  providedIn: 'root',
})
export class CourseBatchesService extends ResourceService {
  constructor(http: HttpClient) {
    super(http, ENDPOINT);
  }

  getAllCourseBatches() {
    return super.getResources(null, 'api/courseBatch/getAllCourseBatches').pipe(
      map((response: any) => {
        let coursesArray: any[] = response.data;
        // studentsArray.map(value => {
        //   value.full_name = `${value.first_name} ${value.last_name}`;
        // });
        return coursesArray as any[];
      })
    );
  }



  getCourseBatchStats() {
    return super.getResources(null, 'api/courseBatch/getAllCourseBatches').pipe(
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



  getInstructorBatches(staffName) {
    return super
      .getResources(
        null,
        'api/courseBatch/findInstructorCourseBatchByStaffName',
        true,
        {
          staff_name: staffName,
        }
      )
      .pipe(
        map((response: any) => {
          let staffArray: any[] = response.data;
          return staffArray;
        })
      );
  }
  createCourseBatch(courseBatch) {
    return super
      .storeResource(courseBatch, 'api/courseBatch/saveCourseBatch')
      .pipe(map((data) => data as any));
  }

  editCourseBatch(courseBatch) {
    return super
      .updateResource(courseBatch, 'api/updateCourseBatch')
      .pipe(map((data) => data as any));
  }

  getBatchesUnderCourse(courseId) {
    return super
      .getResources(
        null,
        'api/courseBatch/findAllCourseBatchesUnderEachCourse',
        true,
        {
          course_id: courseId,
        }
      )
      .pipe(
        map((response: any) => {
          let coursesArray: any[] = response.data;
          return coursesArray as any[];
        })
      );
  }

  getCourseBatchById(courseBatchId) {
    return super
      .getResources(null, 'api/courseBatch/findCourseBatchById', true, {
        id: courseBatchId,
      })
      .pipe(
        map((response: any) => {
          return response.data;
        })
      );
  }

  getModulesUnderCourseBatch(courseBatchId) {
    return super
      .getResources(null, 'api/courseBatch/findModulesUnderEachCourseBatch', true, {
        id: courseBatchId,
      })
      .pipe(
        map((response: any) => {
          let coursesArray: any[] = response.data;
          return coursesArray as any[];
        })
      );
  }

  getStudentsUnderBatch(batchId) {
    return super
      .getResources(null, `api/students/findStudentsUnderCourseBatch`, true, {
        id: batchId,
      })
      .pipe(
        map((response: any) => {
          let studentsArray: any[] = response.data;
          return studentsArray;
        })
      );
  }



  getPastStudentsUnderBatch(batchId) {
    return super
      .getResources(null, `api/pastStudents/findPastStudentsUnderCourseBatch`, true, {
        id: batchId,
      })
      .pipe(
        map((response: any) => {
          let studentsArray: any[] = response.data;
          return studentsArray;
        })
      );
  }


  getStudentsCoursesUnderBatch(studentId) {
    return super
      .getResources(null, 'api/courseBatch/findStudentCourseBatch', true, {
        id: studentId,
      })
      .pipe(
        map((response: any) => {
          let studentsArray: any[] = response.data;
          return studentsArray;
        })
      );
  }

  getStudentsPastCoursesUnderBatch(studentId) {
    return super
      .getResources(null, 'api/courseBatch/findPastStudentCourseBatch', true, {
        student_id: studentId,
      })
      .pipe(
        map((response: any) => {
          let studentsArray: any[] = response.data;
          return studentsArray;
        })
      );
  }

  getStaffCoursesUnderBatch(staffId) {
    return super
      .getResources(null, 'api/courseBatch/findStaffCourseBatch', true, {
        staff_id: staffId,
      })
      .pipe(
        map((response: any) => {
          let studentsArray: any[] = response.data;
          return studentsArray;
        })
      );
  }

  getResultCourseBatchByStudentIdAndCourse(studentId, batchId) {
    return super
      .getResources(
        null,
        `api/courseBatch/selectingFromCourseBatchForResults`,
        true,
        {
          student_id: studentId,
          batch_id: batchId,
        }
      )
      .pipe(
        map((response: any) => {
          let resultsArray: any = response.data;

          return resultsArray;
        })
      );
  }

  getResultInfoForurrentourse(courseId) {
    return super
      .getResources(
        null,
        `api/courseBatch/selectingFromCourseBatchForStudentResults`,
        true,
        {
          // student_id: studentId,
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
}
