import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpTrainingComponent } from './emp-training.component';

describe('EmpTrainingComponent', () => {
  let component: EmpTrainingComponent;
  let fixture: ComponentFixture<EmpTrainingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpTrainingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
