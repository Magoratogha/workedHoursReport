import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkedHoursConsultComponent } from './worked-hours-consult.component';

describe('WorkedHoursConsultComponent', () => {
  let component: WorkedHoursConsultComponent;
  let fixture: ComponentFixture<WorkedHoursConsultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkedHoursConsultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkedHoursConsultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
