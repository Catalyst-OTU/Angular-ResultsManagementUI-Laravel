/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AddCourseBatchComponent } from './add-course-batch.component';

describe('AddCourseBatchComponent', () => {
  let component: AddCourseBatchComponent;
  let fixture: ComponentFixture<AddCourseBatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCourseBatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCourseBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
