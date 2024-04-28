import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProOwnercontactComponent } from './pro-ownercontact.component';

describe('ProOwnercontactComponent', () => {
  let component: ProOwnercontactComponent;
  let fixture: ComponentFixture<ProOwnercontactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProOwnercontactComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProOwnercontactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
