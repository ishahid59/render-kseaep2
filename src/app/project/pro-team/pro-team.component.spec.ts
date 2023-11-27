import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProTeamComponent } from './pro-team.component';

describe('ProTeamComponent', () => {
  let component: ProTeamComponent;
  let fixture: ComponentFixture<ProTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProTeamComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
