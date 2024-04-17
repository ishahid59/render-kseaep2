import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpDisciplinesf330Component } from './emp-disciplinesf330.component';

describe('EmpDisciplinesf330Component', () => {
  let component: EmpDisciplinesf330Component;
  let fixture: ComponentFixture<EmpDisciplinesf330Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpDisciplinesf330Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpDisciplinesf330Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
