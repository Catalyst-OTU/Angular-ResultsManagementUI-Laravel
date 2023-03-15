import { AfterViewInit, Component, Input, OnInit,Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogConfig,MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { SideBarComponent } from 'src/app/components/layout/side-bar/side-bar.component';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {

  resetForm : FormGroup;

  constructor( private fb: FormBuilder,
    private dialogRef: MatDialogRef<SideBarComponent>,) { }

  ngOnInit(): void {
    this.resetForm = this.fb.group({
      current_pass:['', [Validators.required]],
      new_pass:['', [Validators.required]],
      confirm_password:['', [Validators.required]],
    })
  }
  close() {  
    this.dialogRef.close();  
}  
}
