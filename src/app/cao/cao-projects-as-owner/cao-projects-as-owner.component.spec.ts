import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaoProjectsAsOwnerComponent } from './cao-projects-as-owner.component';

describe('CaoProjectsAsOwnerComponent', () => {
  let component: CaoProjectsAsOwnerComponent;
  let fixture: ComponentFixture<CaoProjectsAsOwnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaoProjectsAsOwnerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaoProjectsAsOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
