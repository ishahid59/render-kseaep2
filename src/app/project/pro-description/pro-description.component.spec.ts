import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProDescriptionComponent } from './pro-description.component';

describe('ProDescriptionComponent', () => {
  let component: ProDescriptionComponent;
  let fixture: ComponentFixture<ProDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProDescriptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
