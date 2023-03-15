import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { User } from '../interfaces/all-models';
import { Ability, AbilityBuilder } from '@casl/ability';
import { logoutAlert } from '../utils/constants';
import { ResourceService } from './resources';
const ENDPOINT = 'users';
@Injectable({ providedIn: 'root' })
export class AuthenticationService extends ResourceService {
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  public loggedInUser;

  constructor(
    private router: Router,
    http: HttpClient,
    private ability: Ability
  ) {
    super(http, ENDPOINT);
    this.userSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('user'))
    );
    this.user = this.userSubject;
    this.loggedInUser = this.user['_value'];
    this.updateAbility(this.loggedInUser || []);

    // console.log(this.loggedInUser);
  }

  public get userValue(): User {
    return this.userSubject.value;
  }
  private updateAbility(user: any) {
    const { can, rules } = new AbilityBuilder(Ability);

    const userRole = user.usertype;
    switch (userRole) {
      
      case 'Director of Studies':
        can('view', 'Results');
        can('edit', 'Results');
        can('view', 'Students');
        can('edit', 'Students');
        can('view', 'Instructors');
        can('add', 'Staff');
        can('edit', 'Instructors');
        can('view', 'Courses');
        can('edit', 'Courses');
        can('add', 'Course');
        // can('view', 'Modules');
        can('edit', 'Modules');
        can('view', 'Reports');
        can('edit', 'Reports');
        //can('disable', 'all');
        //can('add', 'Course Batch');
        //can('delete', 'Course Batch');
        //can('edit', 'Course Batch');
        can('assign', 'Instructor');
        can('view', 'Course Batch');
        //can('confirm', 'Grade');
        

        break;


        case 'Academic Secretary':
          can('view', 'Students');
          can('edit', 'Students');
          can('add', 'Student');
          can('delete', 'Student');
          can('add', 'Student Course');
          can('delete', 'Student Course');
          // can('view', 'Instructors');
          can('edit', 'Instructors');
          can('disable', 'Instrcutors');
          can('view', 'Courses');
          can('edit', 'Courses');
          can('delete', 'Courses');
          can('add', 'Course');
          can('view', 'Reports');
          can('edit', 'Reports');
          can('view', 'Results');
          can('edit', 'Results');
          //can('upload', 'Grade');
          can('add', 'Module');
          can('view', 'Modules');
          can('add', 'Course Batch');
          can('delete', 'Course Batch');
          can('edit', 'Course Batch');
          can('assign', 'Instructor');
          can('view', 'Course Batch');
          can('disable', 'all');
          can('confirm', 'Grade');
  
          break;


      case 'Course Cordinator':
        can('delete', 'Course Batch');
        can('edit', 'Course Batch');
       can('view', 'Course Batch');
       can('assign', 'Instructor');
        // can('view', 'Courses');
        // can('edit', 'Courses');
        can('view', 'Modules');
        can('edit', 'Modules');
        // can('view', 'Instructors');
        // can('edit', 'Instructors');
        can('view', 'Reports');
        can('edit', 'Reports');
        can('add', 'Module');
        // can('add', 'Course Batch');

        break;


      case 'Center Manager':
        can('view', 'Students');
        can('edit', 'Students');
        can('add', 'Student');
        can('delete', 'Student');
        can('add', 'Student Course');
        can('delete', 'Student Course');
        can('view', 'Courses');
        can('edit', 'Courses');
        can('view', 'Modules');
        can('edit', 'Modules');
        //can('view', 'Instructors');
        can('edit', 'Instructors');
        can('view', 'Reports');
        can('edit', 'Reports');
        can('add', 'Module');
        can('add', 'Course Batch');
        can('edit', 'Course Batch');
        can('view', 'Course Batch');

        break;

      case 'Faculty':
        // can('view', 'Modules');
        // can('view', 'Reports');
        // can('generate', 'Reports');
        // can('add', 'Results');
        // can('view', 'Results');
        // can('upload', 'Grade');
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
        // can('view', 'Modules');
        // can('view', 'Students');
        can('upload', 'Grade');
        can('view', 'Course Batch');
        break;

        case 'System Admin':
          can('view', 'Results');
          can('edit', 'Results');
          can('view', 'Students');
          can('edit', 'Students');
          can('add', 'Student');
          can('delete', 'Student');
          can('add', 'Student Course');
          can('delete', 'Student Course');
          can('view', 'Instructors');
          can('add', 'Staff');
          can('edit', 'Instructors');
          can('view', 'Courses');
          can('edit', 'Courses');
          can('delete', 'Courses');
          can('add', 'Course');
          can('view', 'Modules');
          can('edit', 'Modules');
          can('add', 'Module');
          can('view', 'Reports');
          can('edit', 'Reports');
          can('disable', 'all');
          can('add', 'Course Batch');
          can('delete', 'Course Batch');
          can('edit', 'Course Batch');
          can('assign', 'Instructor');
          can('view', 'Course Batch');
          can('disable', 'all');
          can('confirm', 'Grade');
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
    // console.log(this.ability.rules);
  }
  capitalizeFirstLetter(string) {
    if (string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    // return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }
  login(email, password) {
    return super
      .getResources(null, 'api/staffs/userLogin', true, {
        email: email,
        password: password,
      })
      .pipe(
        map((response: any) => {
          response.data.department = this.capitalizeFirstLetter(response.data.department);
          localStorage.setItem('user', JSON.stringify(response.data));
          this.userSubject.next(response.data);
          this.updateAbility(response.data);
          return console.log(response.data);
        })
      );
  }
  // login(userdata) {
  //   return this.http
  //     .post<any>(`${environment.API_BASE}/users/authenticate`, userdata)
  //     .pipe(
  //       map((user) => {
  //         // store user details and jwt token in local storage to keep user logged in between page refreshes
  //         localStorage.setItem('user', JSON.stringify(user));
  //         this.userSubject.next(user);
  //         this.updateAbility(user);

  //         return user;
  //       })
  //     );
  // }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.ability.update([]);
    window.location.assign('/login');
    // this.router.navigate(['/login']);
    logoutAlert();
  }

  getAll() {
    return this.http.get<User[]>(`${environment.API_BASE}/users`);
  }

  getById(id: number) {
    return this.http.get<User>(`${environment.API_BASE}/users/${id}`);
  }
}
