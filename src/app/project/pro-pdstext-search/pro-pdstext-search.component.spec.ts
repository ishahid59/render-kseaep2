import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProPdstextSearchComponent } from './pro-pdstext-search.component';

describe('ProPdstextSearchComponent', () => {
  let component: ProPdstextSearchComponent;
  let fixture: ComponentFixture<ProPdstextSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProPdstextSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProPdstextSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
