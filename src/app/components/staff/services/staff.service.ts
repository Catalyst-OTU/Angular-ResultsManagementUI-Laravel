import { Injectable } from '@angular/core';
import { staffList } from '../utils/constants';
import { ResourceService } from '../../../services/resources';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Staff } from '../interfaces/models';
import { Ability, AbilityBuilder } from '@casl/ability';

const ENDPOINT = 'staffs';

@Injectable({
  providedIn: 'root',
})
export class StaffService extends ResourceService {
  constructor(http: HttpClient, private ability: Ability) {
    super(http, ENDPOINT);
  }

  getAllStaff() {
    let staffArray = staffList;
    return staffArray;
  }

  getAllStaffs() {
    return super.getResources(null, 'api/staffs/getAllStaffs').pipe(
      map((response: any) => {
        let staffArray: any[] = response.data;
        // studentsArray.map(value => {
        //   value.full_name = `${value.first_name} ${value.last_name}`;
        // });
        return staffArray as Staff[];
      })
    );
  }
  getTotalStaff() {
    return super.getResources(null, 'api/staffs/countStaff');
  }

  getInstructors() {
    return super.getResources(null, 'api/staffs/getAllStaffs').pipe(
      map((response: any) => {
        let staffArray: any[] = response.data;
        return staffArray.filter((m) => m.usertype == 'Instructor' && m.usertype == 'Faculty' && m.usertype == 'Course Cordinator') as Staff[];
      })
    );
  }
  getCordinators() {
    return super.getResources(null, 'api/staffs/getInstructors').pipe(
      map((response: any) => {
        let staffArray: any[] = response.data;
        //return staffArray.filter(
        // (m) => m.department == 'Faculty'
        // ) as Staff[];
        return staffArray as Staff[];
      })
    );
  }

  getStaffStats() {
    return super.getResources(null, 'api/staffs/getAllStaffs').pipe(
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

  // sendEmail() {
  //   return super.getResources(null, 'staffs/sendEmail').pipe(
  //     map((response: any) => {
  //       return response;
  //     })
  //   );
  // }

  private updateAbility(user: any) {
    const { can, rules } = new AbilityBuilder(Ability);

    const userRole = user.department;
    switch (userRole) {
      case 'Director':
        can('view', 'Results');
        can('edit', 'Results');
        can('view', 'Students');
        can('edit', 'Students');
        can('view', 'Instructors');
        can('add', 'Staff');
        can('edit', 'Instructors');
        can('view', 'Courses');
        can('edit', 'Courses');
        can('view', 'Modules');
        can('edit', 'Modules');
        can('view', 'Reports');
        can('edit', 'Reports');
        can('disable', 'all');

        break;

      case 'Course Cordinator':
        can('view', 'Courses');
        can('edit', 'Courses');
        can('view', 'Modules');
        can('edit', 'Modules');
        can('view', 'Instructors');
        can('edit', 'Instructors');
        can('view', 'Reports');
        can('edit', 'Reports');
        can('add', 'Module');
        can('add', 'Course Batch');
        can('delete', 'Course Batch');
        can('edit', 'Course Batch');
        can('view', 'Course Batch');
        break;

      case 'Academic Secretary':
        can('view', 'Students');
        can('edit', 'Students');
        can('add', 'Student');
        can('delete', 'Student');
        can('add', 'Student Course');
        can('delete', 'Student Course');
        can('view', 'Instructors');
        can('edit', 'Instructors');
        can('disable', 'Instrcutors');
        can('view', 'Courses');
        can('edit', 'Courses');
        can('delete', 'Courses');
        can('view', 'Reports');
        can('edit', 'Reports');
        can('view', 'Results');
        can('edit', 'Results');
        can('upload', 'Grade');
        can('add', 'Module');
        can('add', 'Course');
        can('view', 'Courses');
        can('add', 'Course Batch');
        can('delete', 'Course Batch');
        can('edit', 'Course Batch');
        can('view', 'Course Batch');

        break;
      case 'Center Manager':
        can('view', 'Courses');
        can('edit', 'Courses');
        can('view', 'Modules');
        can('edit', 'Modules');
        can('view', 'Instructors');
        can('edit', 'Instructors');
        can('view', 'Reports');
        can('edit', 'Reports');
        can('add', 'Module');
        can('add', 'Course Batch');
        can('edit', 'Course Batch');
        can('view', 'Course Batch');

        break;

      case 'Faculty':
        can('view', 'Modules');
        can('view', 'Reports');
        can('generate', 'Reports');
        can('add', 'Results');
        can('view', 'Results');
        can('upload', 'Grade');
        break;

      case 'Research and Innovation':
        can('view', 'Modules');
        can('view', 'Reports');
        can('generate', 'Reports');
        can('add', 'Results');
        can('view', 'Results');
        can('upload', 'Grade');
        break;
      case 'Instructor':
        can('view', 'Modules');
        can('view', 'Students');
        break;
      case 'Admin':
        can('manage', 'all');
        console.log('super');
        break;

      default:
        can('read', 'all');
        break;
    }
    // if (userRole === 'Admin') {
    //   can('manage', 'all');
    //   console.log('super');
    // } else {
    //   can('read', 'all');
    // }

    this.ability.update(rules);
  }
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }
  login(email, password) {
    return super
      .getResources(null, 'api/staffs/userLogin', true, {
        email: email,
        password: password,
      })
      .pipe(
        map((response: any) => {
          let userArray: any = response.data;
          // userArray.usertype = this.capitalizeFirstLetter(userArray.usertype);
          if (Object.keys(userArray).length > 0) {
            localStorage.setItem('user', JSON.stringify(userArray));
            this.updateAbility(userArray);
          }

          return userArray;
        })
      );
  }

  sendEmailVerification(email) {
    return super
      .storeResourceWithParams(
        null,
        'api/staffs/sendResetPasswordLinkToStaffEmail',
        {
          email: email,
        }
      )
      .pipe(
        map((response: any) => {
          // let userArray: any = response[0];
          // // userArray.usertype = this.capitalizeFirstLetter(userArray.usertype);
          // if (Object.keys(userArray).length > 0) {
          //   localStorage.setItem('user', JSON.stringify(userArray));
          //   this.updateAbility(userArray);
          // }

          return response;
        })
      );
  }

  getStaffDetailsWithToken(token) {
    return super
      .getResources(null, 'api/staffs/getStaffDetails', true, {
        token: token,
      })
      .pipe(
        map((response: any) => {
          // let userArray: any = response[0];
          // // userArray.usertype = this.capitalizeFirstLetter(userArray.usertype);
          // if (Object.keys(userArray).length > 0) {
          //   localStorage.setItem('user', JSON.stringify(userArray));
          //   this.updateAbility(userArray);
          // }

          return response;
        })
      );
  }
}
