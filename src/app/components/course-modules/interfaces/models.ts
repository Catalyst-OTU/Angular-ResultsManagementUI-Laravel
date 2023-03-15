import { saleData } from '../../dashboard/utils/constants';
export interface CourseModule {
  id: number | string;
  module_name: string;
  course_name: string;
  course_id: number;
  staff_name: string;
  status: string;
  module_start_date: string;
  module_end_date: string;
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
