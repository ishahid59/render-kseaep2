import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpProjectsComponent } from './emp-projects.component';

describe('EmpProjectsComponent', () => {
  let component: EmpProjectsComponent;
  let fixture: ComponentFixture<EmpProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpProjectsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
