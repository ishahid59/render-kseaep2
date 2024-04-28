import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaoEditModalComponent } from './cao-edit-modal.component';

describe('CaoEditModalComponent', () => {
  let component: CaoEditModalComponent;
  let fixture: ComponentFixture<CaoEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaoEditModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaoEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
