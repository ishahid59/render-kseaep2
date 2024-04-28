import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpMembershipComponent } from './emp-membership.component';

describe('EmpMembershipComponent', () => {
  let component: EmpMembershipComponent;
  let fixture: ComponentFixture<EmpMembershipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpMembershipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpMembershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
