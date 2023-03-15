import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { first, forkJoin } from 'rxjs';
import { CoursesService } from 'src/app/components/courses/services/course.service';
import { ResultsService } from 'src/app/components/upload-grade/services/results.service';
import { errorAlert } from '../../../../utils/constants';
import { CourseBatchesService } from 'src/app/components/courses/services/course-batches.service';

@Component({
  selector: 'app-search-grade',
  templateUrl: './search-grade.component.html',
  styleUrls: ['./search-grade.component.css'],
})
export class SearchGradeComponent implements OnInit {
  searchForm: FormGroup;
  courseList: any[];

  constructor(
    private fb: FormBuilder,
    private courseService: CoursesService,
    private resultService: ResultsService,
    private batchService: CourseBatchesService,

    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      student_id: ['', [Validators.required]],
      course_id: ['', [Validators.required]],
    });
    this.loadCourseBatches();
  }
  loadData = () => {
    this.courseService.getAllCourse().subscribe((courses) => {
      this.courseList = courses
        .filter((stud) => stud.status === 'Active')
        .map(({ id, course_name, course_level }) => ({
          id,
          course_name,
          course_level,
        }));
    });
  };

  loadCourseBatches() {
    this.batchService.getAllCourseBatches().subscribe((batches) => {
      this.courseList = batches
        .filter((stud) => stud.status === 'Active')
        .map(({ id, course_name, course_level }) => ({
          id,
          course_name,
          course_level,
        }));
    });
  }

  // searchGrade() {
  //   var formValues = this.searchForm.getRawValue();
  //   var studentId = formValues.student_id;
  //   var courseId = formValues.course_id;
  //   localStorage.setItem('fetch_stud', studentId);
  //   localStorage.setItem('fetch_cors', courseId);

  //   this.resultService
  //     .getResultByStudentIdAndCourse(studentId, courseId)
  //     .pipe(first())
  //     .subscribe({
  //       next: (ad) => {
  //         if (Object.keys(ad).length === 0) {
  //           errorAlert('Student Result not found');
  //         } else {
  //           this.router.navigate(['/student-result']);
  //         }
  //         // console.log(typeof ad);
  //         // this.router.navigate(['/student-result']);
  //       },
  //       error: (error) => {
  //         console.log(error);
  //       },
  //     });
  // }
  searchGrade() {
    var formValues = this.searchForm.getRawValue();
    var studentId = formValues.student_id;
    var courseId = formValues.course_id;
    localStorage.setItem('fetch_stud', studentId);
    localStorage.setItem('fetch_cors', courseId);
    localStorage.setItem('past_stud', studentId);
    localStorage.setItem('past_cors', courseId);
    let currentResult = this.resultService.getResultByStudentIdAndCourse(
      studentId,
      courseId
    );
    let pastResult = this.resultService.getPastResultByStudentIdAndCourse(
      studentId,
      courseId
    );
    forkJoin([currentResult, pastResult]).subscribe((results) => {
      if (Object.keys(results[0]).length !== 0) {
        this.router.navigate(['/student-result']);
      } else if (Object.keys(results[1]).length !== 0) {
        this.router.navigate(['/student-past-result']);
      } else {
        errorAlert('Student Result not found');
      }
    });

    // this.resultService
    //   .getResultByStudentIdAndCourse(studentId, courseId)
    //   .pipe(first())
    //   .subscribe({
    //     next: (ad) => {
    //       if (Object.keys(ad).length === 0) {
    //         errorAlert('Student Result not found');
    //       } else {
    //         this.router.navigate(['/student-result']);
    //       }
    //       // console.log(typeof ad);
    //       // this.router.navigate(['/student-result']);
    //     },
    //     error: (error) => {
    //       console.log(error);
    //     },
    //   });
  }
  openInfoDialog() {
    this.router.navigate(['/student-result']);
  }
}
