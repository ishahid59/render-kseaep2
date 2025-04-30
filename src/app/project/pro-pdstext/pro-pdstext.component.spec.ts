import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProPdstextComponent } from './pro-pdstext.component';

describe('ProPdstextComponent', () => {
  let component: ProPdstextComponent;
  let fixture: ComponentFixture<ProPdstextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProPdstextComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProPdstextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
