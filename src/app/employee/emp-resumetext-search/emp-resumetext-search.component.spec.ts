import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpResumetextSearchComponent } from './emp-resumetext-search.component';

describe('EmpResumetextSearchComponent', () => {
  let component: EmpResumetextSearchComponent;
  let fixture: ComponentFixture<EmpResumetextSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpResumetextSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpResumetextSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
