import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaoContactComponent } from './cao-contact.component';

describe('CaoContactComponent', () => {
  let component: CaoContactComponent;
  let fixture: ComponentFixture<CaoContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaoContactComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaoContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
