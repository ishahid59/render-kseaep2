import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaoDetailComponent } from './cao-detail.component';

describe('CaoDetailComponent', () => {
  let component: CaoDetailComponent;
  let fixture: ComponentFixture<CaoDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaoDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
