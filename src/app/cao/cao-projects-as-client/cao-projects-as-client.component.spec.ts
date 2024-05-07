import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaoProjectsAsClientComponent } from './cao-projects-as-client.component';

describe('CaoProjectsAsClientComponent', () => {
  let component: CaoProjectsAsClientComponent;
  let fixture: ComponentFixture<CaoProjectsAsClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaoProjectsAsClientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaoProjectsAsClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
