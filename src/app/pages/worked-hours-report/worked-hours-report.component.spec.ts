import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkedHoursReportComponent } from './worked-hours-report.component';

describe('WorkedHoursReportComponent', () => {
  let component: WorkedHoursReportComponent;
  let fixture: ComponentFixture<WorkedHoursReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkedHoursReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkedHoursReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
