/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CourseBatchesComponent } from './course-batches.component';

describe('CourseBatchesComponent', () => {
  let component: CourseBatchesComponent;
  let fixture: ComponentFixture<CourseBatchesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseBatchesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseBatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
