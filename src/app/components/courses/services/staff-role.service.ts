import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ResourceService } from 'src/app/services/resources';

const ENDPOINT = 'staffRole';

@Injectable({
  providedIn: 'root',
})
export class StaffRoleService extends ResourceService {
  constructor(http: HttpClient) {
    super(http, ENDPOINT);
  }

  getAllBatchStaffRole(batchId) {
    return super
      .getResources(null, `api/staffRole/getAllBatchStaffRole`, true, {
        batch_id: batchId,
      })
      .pipe(
        map((response: any) => {
          let staffRoleArray: any = response;
          return staffRoleArray;
        })
      );
  }
}
