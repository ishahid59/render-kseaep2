import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProProfilecodeComponent } from './pro-profilecode.component';

describe('ProProfilecodeComponent', () => {
  let component: ProProfilecodeComponent;
  let fixture: ComponentFixture<ProProfilecodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProProfilecodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProProfilecodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
