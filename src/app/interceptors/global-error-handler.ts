import { ErrorHandler, Inject, Injectable, NgZone } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ErrorDialogService } from "../services/error-dialog.service";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private errorDialogService: ErrorDialogService, private zone: NgZone,
  

    ) {}

  handleError(error: any) {

    this.zone.run(() =>
      this.errorDialogService.openDialog(
        error.statusText || "Undefined client error",
    ));

    console.error("Error from global error handler", error);
  }
}
