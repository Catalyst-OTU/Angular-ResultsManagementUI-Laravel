import { NgModule, CUSTOM_ELEMENTS_SCHEMA, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { StudentsListComponent } from './components/students/components/students-list/students-list.component';

import { FlexLayoutModule } from '@angular/flex-layout';

import { NgxSpinnerModule } from 'ngx-spinner';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { NgxChartsModule } from '@swimlane/ngx-charts';

import { DatePipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import {
  MatFormFieldModule,
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
} from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import {
  MatDialogConfig,
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
  MatRadioModule,
  MAT_RADIO_DEFAULT_OPTIONS,
} from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatTabsModule } from '@angular/material/tabs';

import { NetworkInterceptorInterceptor } from '../app/interceptors/network-interceptor.interceptor';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ErrorDialogService } from './services/error-dialog.service';
import { LoadingService } from './services/loading.service';
import { GlobalErrorHandler } from './interceptors/global-error-handler';
import { StudentsFormComponent } from './components/students/components/students-form/students-form.component';
import { StudentsInfoComponent } from './components/students/components/students-info/students-info.component';
import { StudentsResultComponent } from './components/students/components/students-result/students-result.component';
import { StaffListComponent } from './components/staff/components/staff-list/staff-list.component';
import { StaffFormComponent } from './components/staff/components/staff-form/staff-form.component';
import { StaffInfoComponent } from './components/staff/components/staff-info/staff-info.component';
import { CourseInfoComponent } from './components/courses/components/course-info/course-info.component';
import { CourseListComponent } from './components/courses/components/course-list/course-list.component';
import { CourseFormComponent } from './components/courses/components/course-form/course-form.component';
import { ModuleFormComponent } from './components/course-modules/components/module-form/module-form.component';
import { ModuleListComponent } from './components/course-modules/components/module-list/module-list.component';
import { ModuleInfoComponent } from './components/course-modules/components/module-info/module-info.component';
import { ReportsListComponent } from './components/reports/components/reports-list/reports-list.component';
import { DashboardViewComponent } from './components/dashboard/components/dashboard-view/dashboard-view.component';
import { DashboardCardsComponent } from './components/dashboard/components/dashboard-cards/dashboard-cards.component';
import { SearchGradeComponent } from './components/search/components/search-grade/search-grade.component';
import { UploadGradeComponent } from './components/upload-grade/components/upload-grade/upload-grade.component';
import { PasswordResetComponent } from './components/user-profile/components/password-reset/password-reset.component';
import { SideBarComponent } from './components/layout/side-bar/side-bar.component';
import { AddModuleComponent } from './components/courses/components/add-module/add-module.component';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { fakeBackendProvider } from './services/fake-backend';
import { UsersListComponent } from './components/users/components/users-list/users-list.component';
import { UsersFormComponent } from './components/users/components/users-form/users-form.component';
import { UsersInfoComponent } from './components/users/components/users-info/users-info.component';
import { PublicViewComponent } from './components/layout/public-view/public-view.component';
import { AbilityModule } from '@casl/angular';
import { Ability, PureAbility } from '@casl/ability';
import { StudentGradeComponent } from './components/upload-grade/components/student-grade/student-grade.component';
import { ConfirmComponent } from './components/dialogs/confirm/confirm.component';
import { ErrorDialogComponent } from './components/error-dialog/error-dialog.component';
import { ResultsViewComponent } from './components/search/components/results-view/results-view.component';
import { NgxPrintModule } from 'ngx-print';
import { StudentPastCoursesComponent } from './components/students/components/student-past-courses/student-past-courses.component';
import { StudentPresentCoursesComponent } from './components/students/components/student-present-courses/student-present-courses.component';
import { StudentsPastResultComponent } from './components/students/components/students-past-result/students-past-result.component';
import { PasswordResetPageComponent } from './components/password-reset/password-reset-page.component';
import { EmailVerificationFormComponent } from './components/email-verification-form/email-verification-form.component';
import { CourseBatchesComponent } from './components/courses/components/course-batches/course-batches.component';
import { AddCourseBatchComponent } from './components/courses/components/add-course-batch/add-course-batch.component';
import { CourseBatchInfoComponent } from './components/courses/components/course-batch-info/course-batch-info.component';
import { CourseBatchModulesComponent } from './components/courses/components/course-batch-modules/course-batch-modules.component';
import { ConfirmGradeComponent } from './components/upload-grade/components/confirm-grade/confirm-grade.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    StudentsListComponent,
    PageNotFoundComponent,
    ErrorDialogComponent,
    StudentsFormComponent,
    StudentsInfoComponent,
    StudentsResultComponent,
    StaffListComponent,
    StaffFormComponent,
    StaffInfoComponent,
    CourseInfoComponent,
    CourseListComponent,
    CourseFormComponent,
    ModuleFormComponent,
    ModuleListComponent,
    ModuleInfoComponent,
    ReportsListComponent,
    DashboardViewComponent,
    DashboardCardsComponent,
    SearchGradeComponent,
    UploadGradeComponent,
    PasswordResetComponent,
    SideBarComponent,
    AddModuleComponent,
    UsersListComponent,
    UsersFormComponent,
    UsersInfoComponent,
    PublicViewComponent,
    StudentGradeComponent,
    ConfirmComponent,
    StudentGradeComponent,
    ResultsViewComponent,
    StudentPastCoursesComponent,
    StudentPresentCoursesComponent,
    StudentsPastResultComponent,
    PasswordResetPageComponent,
    EmailVerificationFormComponent,
    CourseBatchesComponent,
    AddCourseBatchComponent,
    CourseBatchInfoComponent,
    CourseBatchModulesComponent,
    ConfirmGradeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    MatStepperModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatListModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    MatToolbarModule,
    MatTableModule,
    MatPaginatorModule,
    HttpClientModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDividerModule,
    MatSidenavModule,
    MatDialogModule,
    MatRadioModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    FontAwesomeModule,
    MatTabsModule,
    NgxChartsModule,
    AbilityModule,
    NgxPrintModule,
  ],
  providers: [
    ErrorDialogService,
    LoadingService,
    DatePipe,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline', floatLabel: 'auto' },
    },
    {
      provide: MAT_RADIO_DEFAULT_OPTIONS,
      useValue: { color: 'accent' },
    },
    {
      provide: MatDialogRef,
      useValue: {},
    },
    {
      provide: MatDialogConfig,
      useValue: {},
    },
    {
      provide: MAT_DIALOG_DATA,
      useValue: {},
    },

    {
      provide: HTTP_INTERCEPTORS,
      useClass: NetworkInterceptorInterceptor,
      multi: true,
    },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },

    // provider used to create fake backend
    fakeBackendProvider,
    { provide: Ability, useValue: new Ability() },
    { provide: PureAbility, useExisting: Ability },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
