import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';
import { ErrorDialogService } from '../services/error-dialog.service';
import { AuthenticationService } from '../services/auth.service';

@Injectable()
export class NetworkInterceptorInterceptor implements HttpInterceptor {
  constructor(
    private spinnerService: LoadingService,
    private errorDialogService: ErrorDialogService,
    private authenticationService: AuthenticationService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.spinnerService.show();
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if(error.status === 401 && error.url.includes('login')){
          this.errorDialogService.openDialog(
            error?.message ?? JSON.stringify(error),
            error.status
          );
        }
        // if ([401, 403].indexOf(error.status) !== -1) {
        //   // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        //   this.authenticationService.logout();
          
        // }
      
        if (error.status === 500) {
          this.errorDialogService.openDialog(
            'Internal Server Error!! Check Data For Duplicates'
          );
        }
        if (
          error.url.includes(
            'http://localhost:8000/api/staffs/sendResetPasswordLinkToStaffEmail/email'
          )
        ) {
          this.errorDialogService.openDialog(
            error?.error.text ?? JSON.stringify(error),
            error.status
          );
        }
        console.error('Error from error interceptor', error);
        this.errorDialogService.openDialog(
          error?.statusText ?? JSON.stringify(error),
          error.status
        );
        return throwError(error);
      }),
      finalize(() => {
        this.spinnerService.hide();
      })
    ) as Observable<HttpEvent<any>>;
  }
}
