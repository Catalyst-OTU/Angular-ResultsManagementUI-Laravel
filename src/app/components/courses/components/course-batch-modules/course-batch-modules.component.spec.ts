/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CourseBatchModulesComponent } from './course-batch-modules.component';

describe('CourseBatchModulesComponent', () => {
  let component: CourseBatchModulesComponent;
  let fixture: ComponentFixture<CourseBatchModulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseBatchModulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseBatchModulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
