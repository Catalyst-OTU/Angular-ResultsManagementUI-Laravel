export interface User{
    id:number | string;
    status:string;
    usertype:string;
    staff_id:string;
    email:string;
    password:string

}

export interface CardItem {
    messages: [{
      headerMessage:string,
      headerValue:string
    }];
    headerIcon: string;
    headerColor:string;
  }