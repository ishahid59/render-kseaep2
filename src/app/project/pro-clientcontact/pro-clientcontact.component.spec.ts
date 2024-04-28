import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProClientcontactComponent } from './pro-clientcontact.component';

describe('ProClientcontactComponent', () => {
  let component: ProClientcontactComponent;
  let fixture: ComponentFixture<ProClientcontactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProClientcontactComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProClientcontactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
