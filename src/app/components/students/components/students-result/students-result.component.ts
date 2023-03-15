import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ResultsService } from '../../../upload-grade/services/results.service';
import { StudentsService } from '../../services/students.service';
import { Student } from '../../interfaces/models';
import { CoursesService } from 'src/app/components/courses/services/course.service';
import { CourseBatchesService } from 'src/app/components/courses/services/course-batches.service';

@Component({
  selector: 'app-students-result',
  templateUrl: './students-result.component.html',
  styleUrls: ['./students-result.component.scss'],
})
export class StudentsResultComponent implements OnInit {
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
    private studentService: StudentsService,
    private courseService: CoursesService,
    private batchService: CourseBatchesService
  ) {}

  ngOnInit(): void {
    this.loadResult();
    this.loadInfo();
    this.loadCourseInfo();
  }

  get resultLength() {
    return this.resultData?.length || 0;
  }

  loadResult() {
    this.resultService
      .getResultByStudentIdAndCourse(
        localStorage['fetch_stud'],
        localStorage['fetch_cors']
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

  // loadResult() {
  //   this.resultService
  //     .getResultByStudentId(localStorage['fetch_stud'])
  //     .subscribe((data) => {
  //       data.forEach((element) => {
  //         var nut = parseInt(element.marks);
  //         if (nut >= 80) {
  //           return (element.grade = `A`);
  //         } else if (nut >= 70 && nut < 79) {
  //           return (element.grade = `B`);
  //         } else if (nut >= 60 && nut < 69) {
  //           return (element.grade = 'C');
  //         } else if (nut >= 50 && nut < 59) {
  //           return (element.grade = 'D');
  //         } else if (nut >= 40 && nut < 49) {
  //           return (element.grade = 'E');
  //         } else if (nut <= 39) {
  //           return (element.grade = 'F');
  //         } else {
  //           return (element.grade = 'N/A');
  //         }
  //       });
  //       this.resultData = data;
  //       console.log(this.resultData);
  //     });
  // }
  // async loadInfo() {
  //   this.studentService.getAllStudent().subscribe((result) => {
  //     this.studentInfo = result.find((a) => a.id == localStorage['student_id']);
  //     // console.log(this.studentInfo);
  //     this.loadCourseInfo();
  //   });
  // }
  async loadInfo() {
    this.studentService
      .getStudentInfoIdAndCourse(
        localStorage['fetch_stud'],
        localStorage['fetch_cors']
      )
      .subscribe((result: any) => {
        this.studentInfo = result[0];
         console.log(this.studentInfo);
        this.loadCourseInfo();
      });
  }
  async loadCourseInfo() {
    this.batchService
      .getResultInfoForurrentourse(
        //localStorage['fetch_stud'],
        localStorage['fetch_cors']
      )
      .subscribe((result: any) => {
        this.courseInfo = result[0];
        console.log(this.courseInfo);
      });
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
  printPage() {
    var contentToPrint = document.getElementById('content').innerHTML;
    var windowPopup = window.open('', '_blank', 'width=100%,height=100%');
    windowPopup.document.open();
    windowPopup.document.write(
      '<html><head><link rel="stylesheet" type="text/css" href="" /></head><body onload="window.print()">' +
        contentToPrint +
        '</body></html>'
    );
    windowPopup.document.close();
  }
  public openPDF(): void {
    let DATA = document.getElementById('content');

    html2canvas(DATA, { scale: 2 }).then((canvas) => {
      let fileWidth = 210;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;

      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);

      PDF.save('my-result.pdf');
    });
  }

  public downloadAsPDF() {
    const doc = new jsPDF();

    const specialElementHandlers = {
      '#editor': function (element, renderer) {
        return true;
      },
    };

    const pdfTable = this.content.nativeElement;

    //   doc.html(pdfTable.innerHTML, 15, 15, {
    //     width: 190,
    //     'elementHandlers': specialElementHandlers
    //   });

    //   doc.save('tableToPdf.pdf');
    // }

    doc.html(pdfTable.innerHTML, {
      callback: function (doc) {
        doc.save('tableToPdf.pdf');
      },
    });
  }

  opPrint() {
    window.print();
    //   const printContent = document.getElementById("content");
    // const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    // WindowPrt.document.write(printContent.innerHTML);
    // WindowPrt.document.close();
    // WindowPrt.focus();
    // WindowPrt.print();
    // WindowPrt.close();
  }

  // <script>
  // $(function($) {

  // });

  // function CallPrint(strid) {
  // var prtContent = document.getElementById("exampl");
  // var WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
  // WinPrint.document.write(prtContent.innerHTML);
  // WinPrint.document.close();
  // WinPrint.focus();
  // WinPrint.print();
  // WinPrint.close();
  // }
  // </script>

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
      return 'N/A';
    }
  }
}
