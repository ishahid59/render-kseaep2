import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpPrevemploymentComponent } from './emp-prevemployment.component';

describe('EmpPrevemploymentComponent', () => {
  let component: EmpPrevemploymentComponent;
  let fixture: ComponentFixture<EmpPrevemploymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpPrevemploymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpPrevemploymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
