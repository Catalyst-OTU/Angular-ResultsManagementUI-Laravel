import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CoursesService } from 'src/app/components/courses/services/course.service';
import { ResultsService } from 'src/app/components/upload-grade/services/results.service';
import { PastStudentsService } from '../../services/past-students.service';
import { CourseBatchesComponent } from '../../../courses/components/course-batches/course-batches.component';
import { CourseBatchesService } from 'src/app/components/courses/services/course-batches.service';

@Component({
  selector: 'app-students-past-result',
  templateUrl: './students-past-result.component.html',
  styleUrls: ['./students-past-result.component.scss'],
})
export class StudentsPastResultComponent implements OnInit, OnDestroy {
  @ViewChild('content') content: ElementRef;
  resultData;
  studentInfo;
  courseInfo;
  Data = [
    { module_code: 101, module_name: 'Nitin', score: 1234, grade: 'A' },
    { module_code: 102, module_name: 'Sonu', score: 1234, grade: 'A' },
    { module_code: 103, module_name: 'Mohit', score: 1234, grade: 'A' },
    { module_code: 104, module_name: 'Rahul', score: 1234, grade: 'A' },
    { module_code: 105, module_name: 'Kunal', score: 1234, grade: 'A' },
  ];

  totalMarks = 0;
  totalAttainableMarks: number;
  percentagePassed: number;

  constructor(
    private resultService: ResultsService,
    private pastService: PastStudentsService,
    private courseService: CoursesService,
    private batchService: CourseBatchesService
  ) {}
  ngOnDestroy(): void {
    localStorage.removeItem('past_stud');
    localStorage.removeItem('past_cors');
  }
  ngOnInit(): void {
    this.loadResult();
    this.loadInfo();
  }

  loadResult() {
    this.resultService
      .getPastResultByStudentIdAndCourse(
        localStorage['past_stud'],
        localStorage['past_cors']
      )
      .subscribe((data) => {
        let arrNums = [];
        data.forEach((element) => {
          var nut = parseInt(element.marks);
          arrNums.push(nut);
          if (nut >= 80) {
            return (element.grade = `A+`);
          } else if (nut >= 70 && nut <= 79) {
            return (element.grade = `A`);
          } else if (nut >= 60 && nut <= 69) {
            return (element.grade = 'B+');
          } else if (nut >= 50 && nut <= 59) {
            return (element.grade = 'B');
          } else if (nut >= 45 && nut <= 49) {
            return (element.grade = 'C+');
          } else if (nut >= 40 && nut <= 44) {
            return (element.grade = 'C');
          } else if (nut <= 39) {
            return (element.grade = 'F');
          } else {
            return (element.grade = 'N/A');
          }
        });

        this.resultData = data;
        // console.log(this.resultData);
        // for (let i = 0; i < arrNums.length; i++) {
        //   this.totalMarks += arrNums[i];
        // }
        var i = 0;
        while (i < arrNums.length) {
          this.totalMarks += arrNums[i];
          i++;
        }
        this.totalAttainableMarks = this.resultData.length * 100;
        this.percentagePassed =
          (this.totalMarks / this.totalAttainableMarks) * 100;
      });
  }
  async loadCourseInfo() {
    this.batchService
      .getResultCourseBatchByStudentIdAndCourse(
        // localStorage['past_stud'],
        localStorage['past_cors']
      )
      .subscribe((result) => {
        this.courseInfo = result[0];
        console.log(this.courseInfo);
      });
  }
  async loadInfo() {
    this.pastService
      .getPastStudentInfoIdAndCourse(
        localStorage['past_stud'],
        localStorage['past_cors']
      )
      .subscribe((result) => {
        this.studentInfo = result[0];
        // console.log(this.studentInfo);
        this.loadCourseInfo();
      });
  }

  get resultLength() {
    return this.resultData?.length || 0;
  }

  gradeTemplate() {
    this.resultData.map((element) => {
      var grade = element.marks;
      switch (grade) {
        case grade >= 80:
          return (element.grade = `A`);
          break;
        case grade >= 70 && grade < 79:
          return (element.grade = `B`);
          break;
        case grade >= 60 && grade < 69:
          return (element.grade = 'C');
          break;
        case grade >= 50 && grade < 59:
          return (element.grade = 'D');
          break;
        case grade >= 40 && grade < 49:
          return (element.grade = 'E');
          break;
        case grade <= 39:
          return (element.grade = 'F');
          break;
        default:
          return 'N/A';
          break;
      }
    });
    console.log(this.resultData);
  }
  printPag() {
    window.print();
  }

  get finalGrade() {
    let nut = this.percentagePassed;
    if (nut >= 80) {
      return `Passed with A+`;
    } else if (nut >= 70 && nut <= 79) {
      return `Passed with A`;
    } else if (nut >= 60 && nut <= 69) {
      return 'Passed with B+';
    } else if (nut >= 50 && nut <= 59) {
      return 'Passed with B';
    } else if (nut >= 45 && nut <= 49) {
      return 'Passed with C+';
    } else if (nut >= 40 && nut <= 44) {
      return 'Failed with C';
    } else if (nut <= 39) {
      return 'Failed with F';
    } else {
      return ' N/A';
    }
  }
}
