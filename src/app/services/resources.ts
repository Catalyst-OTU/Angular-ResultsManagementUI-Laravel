import { HttpClient } from '@angular/common/http';
import { DEFAULT_PAGE_SIZE } from 'src/app/utils/constants';
import { environment } from 'src/environments/environment';

export class ResourceService {
  constructor(protected http: HttpClient, protected endpoint: string) {}

  getOneResource(overwriteUrl?: string) {
    return this.http.get(`${environment.API_BASE}/${overwriteUrl}`);
  }

  getResources(
    pagination?: { page: string | any; pageSize: string | any },
    overwriteUrl?: string,
    sendPage: boolean = true,
    requestParams?
  ) {
    pagination =
      sendPage === false
        ? null
        : pagination
        ? pagination
        : { page: 1, pageSize: DEFAULT_PAGE_SIZE };
    return this.http.get(
      `${environment.API_BASE}/${overwriteUrl || this.endpoint}`,
      { params: pagination && requestParams }
    );
  }

  storeResource(toStore: any, overwriteUrl?: string) {
    return this.http.post(
      `${environment.API_BASE}/${overwriteUrl || this.endpoint}`,
      toStore
    );
  }

  storeResourceWithParams(toStore: any, overwriteUrl?: string, requestParams?) {
    return this.http.post(
      `${environment.API_BASE}/${overwriteUrl || this.endpoint}`,
      toStore,
      { params: requestParams }
    );
  }

  updateResource(toStore: any, id: any, overwriteUrl?: string) {
    return this.http.patch(
      `${environment.API_BASE}/${overwriteUrl || this.endpoint + '/' + id}`,
      toStore
    );
  }

  deleteResource(id, overwriteUrl?: string) {
    return this.http.delete(
      `${environment.API_BASE}/${overwriteUrl || this.endpoint + '/' + id}`
    );
  }

  customUpdate() {}

  updatePut(toStore: any, overwriteUrl?: string) {
    return this.http.put(
      `${environment.API_BASE}/${overwriteUrl || this.endpoint + '/'}`,
      toStore
    );
  }
}
