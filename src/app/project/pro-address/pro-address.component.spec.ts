import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProAddressComponent } from './pro-address.component';

describe('ProAddressComponent', () => {
  let component: ProAddressComponent;
  let fixture: ComponentFixture<ProAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProAddressComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
