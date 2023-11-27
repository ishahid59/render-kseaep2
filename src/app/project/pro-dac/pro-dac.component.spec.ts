import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProDacComponent } from './pro-dac.component';

describe('ProDacComponent', () => {
  let component: ProDacComponent;
  let fixture: ComponentFixture<ProDacComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProDacComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProDacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
