import { Injectable } from '@angular/core';
import { ResourceService } from '../../../services/resources';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { User } from '../interfaces/model';

const ENDPOINT = "users"

@Injectable({
  providedIn: 'root'
})
export class UserService extends ResourceService {

  constructor(http: HttpClient) { 
    super(http, ENDPOINT);
  }


  getAllUsers(){
    return super.getResources(null,'api/users/getAllUsers').pipe(
      map((response:any) => {
        let usersArray: any[] = response;
        // studentsArray.map(value => {
        //   value.full_name = `${value.first_name} ${value.last_name}`;
        // });
        return usersArray as User[];
      })
    )
  }


getTotalUsers(){
return super.getResources(null,'api/users/countUsers')  
}

getUsersStats(){
  return super.getResources(null,'api/users/getAllUsers').pipe(
    map((response:any) => {
      let responseArray: any[] = response;
      let activeArray = responseArray.filter(m=>m.status=="Active")
      let inactiveArray =responseArray.filter(m=>m.status=="InActive")
   
      return ({total:responseArray.length,active:activeArray.length,inactive:inactiveArray.length});
    })  )
}

}
