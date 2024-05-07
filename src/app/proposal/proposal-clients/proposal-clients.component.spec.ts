import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalClientsComponent } from './proposal-clients.component';

describe('ProposalClientsComponent', () => {
  let component: ProposalClientsComponent;
  let fixture: ComponentFixture<ProposalClientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProposalClientsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProposalClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
