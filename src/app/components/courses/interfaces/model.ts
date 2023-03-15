export interface Course {
  id: number | string;
  course_name: string;
  code: string;
  course_level: string;
  staff_name: string;
  users_id: number;
  course_start_date: string;
  course_end_date: string;
  certificate_issuedate: string;
  status: string;
  coordinator?: string;
}

export interface CardItem {
  messages: [
    {
      headerMessage: string;
      headerValue: string;
    }
  ];
  headerIcon: string;
  headerColor: string;
}

export interface ICourseBatch {
  id: number | string;
  course_id: number | string;
  course_name: string;
  course_level: string;
  coordinator: string;
  course_start_date: string;
  course_end_date: string;
  certificate_issuedate: string;
  status: string;
}
