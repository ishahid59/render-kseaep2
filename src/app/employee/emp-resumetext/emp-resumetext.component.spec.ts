import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpResumetextComponent } from './emp-resumetext.component';

describe('EmpResumetextComponent', () => {
  let component: EmpResumetextComponent;
  let fixture: ComponentFixture<EmpResumetextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpResumetextComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpResumetextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
