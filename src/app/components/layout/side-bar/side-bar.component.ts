import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { delay } from 'rxjs/operators';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PasswordResetComponent } from '../../user-profile/components/password-reset/password-reset.component';
import { AuthenticationService } from '../../../services/auth.service';
import { Role, User } from 'src/app/interfaces/all-models';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent implements OnInit {
  user: User;
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  constructor(
    private observer: BreakpointObserver,
    public dialog: MatDialog,
    public dialogService: DialogService,
    private authenticationService: AuthenticationService
  ) {
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit(): void {
    // console.log(this.user);
  }

  logout() {
    this.authenticationService.logout();
  }
  ngAfterViewInit() {
    this.observer
      .observe(['(max-width: 800px)'])
      .pipe(delay(1))
      .subscribe((res) => {
        if (res.matches) {
          this.sidenav.mode = 'over';
          this.sidenav.close();
        } else {
          this.sidenav.mode = 'side';
          this.sidenav.open();
        }
      });
  }
  beforePrinting() {
    console.log('Preparing printing');

    const elements = document.getElementsByClassName('tool');
    const elements1 = document.getElementsByClassName('side');
    const cont = document.getElementsByClassName('content');

    for (let i = 0; i < (elements && elements1.length); i++) {
      const element = elements.item(i);
      const elemento = elements1.item(i);
      const conte = cont.item(i);

      if (element) {
        const anyElement = element as any;
        const sideElement = elemento as any;
        const contentElement = conte as any;

        const relation = anyElement.clientWidth / window.innerWidth;
        const newWidth = Math.round(800 * relation);
        console.log('New Width: ' + newWidth);
        // anyElement.style.width = newWidth + "px";
        anyElement.style.display = 'none';
        sideElement.style.display = 'none';
        contentElement.style.width = '100vw';
        contentElement.style.height = '100vh';
        // contentElement.style.position = "absolute";
        // contentElement.style.right = "0px";
      }
    }
    console.log('Waiting for changes to be displayed');
    // const promise = new Promise((resolve) => {
    //     setTimeout(() => resolve(), 1000);
    // });
    // await promise;
    // console.log("Ready to print");
  }
  afterPrinting() {}
  openReset() {
    // debugger;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.position = {
      top: '10vh',
      left: '38vw',
    };
    dialogConfig.width = '400px';
    dialogConfig.height = '430px';

    // dialogConfig.data = {
    //     rowData: data,
    //     type:'update'
    // };
    this.dialog.open(PasswordResetComponent, dialogConfig);
  }
  openConfirmDialog() {
    this.dialogService
      .confirmDialog({
        title: 'Confirm Logout ?',
        message: 'Are you sure you want to Logout ?',
        confirmCaption: 'Yes',
        cancelCaption: 'No',
      })
      .subscribe((yes) => {
        if (yes) {
          this.logout();
        }
      });
  }
}
