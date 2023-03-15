/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AggregationFormComponent } from './aggregation-form.component';

describe('AggregationFormComponent', () => {
  let component: AggregationFormComponent;
  let fixture: ComponentFixture<AggregationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AggregationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AggregationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
