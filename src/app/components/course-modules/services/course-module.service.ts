import { Injectable } from '@angular/core';
import { moduleList } from '../utils/constants';
import { ResourceService } from '../../../services/resources';
import { HttpClient } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';
import { CourseModule } from '../interfaces/models';

const ENDPOINT = 'modules';

@Injectable({
  providedIn: 'root',
})
export class ModuleService extends ResourceService {
  constructor(http: HttpClient) {
    super(http, ENDPOINT);
  }

  getAllModuless() {
    let modulesArray = moduleList;
    return modulesArray;
  }

  getAllModules() {
    return super.getResources(null, 'api/modules/getAllModules').pipe(
      map((response: any) => {
        let modulesArray: any[] = response;
        // studentsArray.map(value => {
        //   value.full_name = `${value.first_name} ${value.last_name}`;
        // });
        return modulesArray as CourseModule[];
      })
    );
  }

  getModuleStats() {
    return super.getResources(null, 'api/modules/getAllModules').pipe(
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

  getInactiveModules() {
    return super.getResources(null, 'api/modules/getAllModules').pipe(
      map((response: any) => {
        let activeArray: any[] = response.data;

        return activeArray.filter(
          (m) => m.status == 'InActive'
        ) as CourseModule[];
      })
    );
  }

  getCourseModules(courseId) {
    return super
      .getResources(null, `api/modules/findModulesUnderEachCourse`, true, {
        id: courseId,
      })
      .pipe(
        map((response: any) => {
          let modulesArray: any[] = response.data;
          return modulesArray;
        })
      );
  }
}
