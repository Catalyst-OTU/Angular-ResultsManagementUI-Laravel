export interface Student {
  id: number | string;
  name: string;
  student_id: string;
  date_of_birth: string;
  contact: string;
  email: string;
  gender: string;
  course_id: string;
  usertype: string;
  status: string;
  fees: string;
  batch_id: string;
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
