import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpExpsummaryComponent } from './emp-expsummary.component';

describe('EmpExpsummaryComponent', () => {
  let component: EmpExpsummaryComponent;
  let fixture: ComponentFixture<EmpExpsummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpExpsummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpExpsummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
