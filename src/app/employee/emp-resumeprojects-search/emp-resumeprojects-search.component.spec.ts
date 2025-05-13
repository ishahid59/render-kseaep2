import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpResumeprojectsSearchComponent } from './emp-resumeprojects-search.component';

describe('EmpResumeprojectsSearchComponent', () => {
  let component: EmpResumeprojectsSearchComponent;
  let fixture: ComponentFixture<EmpResumeprojectsSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpResumeprojectsSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpResumeprojectsSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
