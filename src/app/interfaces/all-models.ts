export enum Role {
  User = 'User',
  Admin = 'Admin',
  Instructor = 'Instructor',
  AcademicSecretary = 'Academic Secretary',
  Director = 'Director',
  CourseCordinator = 'Course Cordinator',
}

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmCaption: string;
  cancelCaption: string;
}

// export interface User{
//     id?:number;
//      password: string;
//      email:string;
//      usertype:Role;
//      username:string;
//      fname:string;
//      token?:string;

//  }
export class User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: Role;
  token?: string;
  name?: string;
  usertype?: Role;
}
export interface LoginIn {
  email: string;
  password: string;
  token?: string;
}

export const showButton = true;
