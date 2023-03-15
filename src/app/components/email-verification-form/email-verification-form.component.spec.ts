/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EmailVerificationFormComponent } from './email-verification-form.component';

describe('EmailVerificationFormComponent', () => {
  let component: EmailVerificationFormComponent;
  let fixture: ComponentFixture<EmailVerificationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailVerificationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailVerificationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
