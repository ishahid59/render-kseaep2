import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportResumeComponent } from './report-resume.component';

describe('ReportResumeComponent', () => {
  let component: ReportResumeComponent;
  let fixture: ComponentFixture<ReportResumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportResumeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
