export interface Staff {
  id?: number;
  staff_id: string;
  users_id: number;
  name: string;
  contact: string;
  usertype: string;
  course_id: number;
  email: string;
  password: string;
  status: string;
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
