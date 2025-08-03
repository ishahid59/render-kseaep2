import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpResumeprojectsSearchSelectComponent } from './emp-resumeprojects-search-select.component';

describe('EmpResumeprojectsSearchSelectComponent', () => {
  let component: EmpResumeprojectsSearchSelectComponent;
  let fixture: ComponentFixture<EmpResumeprojectsSearchSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpResumeprojectsSearchSelectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpResumeprojectsSearchSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
