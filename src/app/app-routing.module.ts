import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModuleInfoComponent } from './components/course-modules/components/module-info/module-info.component';
import { ModuleListComponent } from './components/course-modules/components/module-list/module-list.component';
import { CourseInfoComponent } from './components/courses/components/course-info/course-info.component';
import { CourseListComponent } from './components/courses/components/course-list/course-list.component';
import { DashboardViewComponent } from './components/dashboard/components/dashboard-view/dashboard-view.component';
import { PublicViewComponent } from './components/layout/public-view/public-view.component';
import { SideBarComponent } from './components/layout/side-bar/side-bar.component';
import { LoginComponent } from './components/login/login.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ReportsListComponent } from './components/reports/components/reports-list/reports-list.component';
import { SearchGradeComponent } from './components/search/components/search-grade/search-grade.component';
import { StaffInfoComponent } from './components/staff/components/staff-info/staff-info.component';
import { StaffListComponent } from './components/staff/components/staff-list/staff-list.component';
import { StudentsInfoComponent } from './components/students/components/students-info/students-info.component';
import { StudentsListComponent } from './components/students/components/students-list/students-list.component';
import { StudentsResultComponent } from './components/students/components/students-result/students-result.component';
import { StudentGradeComponent } from './components/upload-grade/components/student-grade/student-grade.component';
import { UploadGradeComponent } from './components/upload-grade/components/upload-grade/upload-grade.component';
import { UsersInfoComponent } from './components/users/components/users-info/users-info.component';
import { UsersListComponent } from './components/users/components/users-list/users-list.component';
import { AuthGuard } from './guards/auth.guard';
import { Role } from './interfaces/all-models';
import { ResultsViewComponent } from './components/search/components/results-view/results-view.component';
import { StudentsPastResultComponent } from './components/students/components/students-past-result/students-past-result.component';
import { PasswordResetPageComponent } from './components/password-reset/password-reset-page.component';
import { CourseBatchesComponent } from './components/courses/components/course-batches/course-batches.component';
import { CourseBatchInfoComponent } from './components/courses/components/course-batch-info/course-batch-info.component';
import { ConfirmGradeComponent } from './components/upload-grade/components/confirm-grade/confirm-grade.component';

export const PUBLIC_ROUTES: Routes = [
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  {
    path: 'student-result',
    component: ResultsViewComponent,
    pathMatch: 'full',
  },
  {
    path: 'student-past-result',
    component: StudentsPastResultComponent,
    pathMatch: 'full',
  },
  { path: 'search-grade', component: SearchGradeComponent, pathMatch: 'full' },
  {
    path: 'reset-password',
    component: PasswordResetPageComponent,
    pathMatch: 'full',
  },
  { path: '**', component: PageNotFoundComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];

export const SECURE_ROUTES: Routes = [
  {
    path: 'students-list',
    component: StudentsListComponent,
    pathMatch: 'full',
    data: { roles: [Role.Instructor] },
  },
  {
    path: 'courses-list',
    component: CourseListComponent,
    pathMatch: 'full',
    data: { roles: [Role.Admin] },
  },
  {
    path: 'staff-list',
    component: StaffListComponent,
    pathMatch: 'full',
    data: { roles: [Role.Admin] },
  },
  {
    path: 'course-info',
    component: CourseInfoComponent,
    pathMatch: 'full',
    data: { roles: [Role.Admin] },
  },
  {
    path: 'staff-info',
    component: StaffInfoComponent,
    pathMatch: 'full',
    data: { roles: [Role.Admin] },
  },
  {
    path: 'student-info',
    component: StudentsInfoComponent,
    pathMatch: 'full',
    data: { roles: [Role.Admin] },
  },
  {
    path: 'module-info',
    component: ModuleInfoComponent,
    pathMatch: 'full',
    data: { roles: [Role.Admin] },
  },
  {
    path: 'module-list',
    component: ModuleListComponent,
    pathMatch: 'full',
    data: { roles: [Role.Admin] },
  },
  {
    path: 'upload-grade',
    component: StudentGradeComponent,
    pathMatch: 'full',
    data: { roles: [Role.Admin] },
  },
  {
    path: 'reports',
    component: ReportsListComponent,
    pathMatch: 'full',
    data: { roles: [Role.Admin] },
  },
  {
    path: 'dashboard',
    component: DashboardViewComponent,
    pathMatch: 'full',
    data: { roles: [Role.Admin] },
  },
  {
    path: 'users-list',
    component: UsersListComponent,
    pathMatch: 'full',
    data: { roles: [Role.Admin] },
  },
  {
    path: 'users-info',
    component: UsersInfoComponent,
    pathMatch: 'full',
    data: { roles: [Role.Admin] },
  },
  {
    path: 'course-batch',
    component: CourseBatchesComponent,
    pathMatch: 'full',
    data: { roles: [Role.Admin] },
  },
  {
    path: 'batch-info',
    component: CourseBatchInfoComponent,
    pathMatch: 'full',
    data: { roles: [Role.Admin] },
  },
  {
    path: 'confirm-grade',
    component: ConfirmGradeComponent,
    pathMatch: 'full',
    data: { roles: [Role.Admin] },
  },
];

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: '',
    component: SideBarComponent,
    canActivate: [AuthGuard],
    children: SECURE_ROUTES,
  },
  {
    path: '',
    component: PublicViewComponent,
    data: { title: 'Public Views' },
    children: PUBLIC_ROUTES,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
