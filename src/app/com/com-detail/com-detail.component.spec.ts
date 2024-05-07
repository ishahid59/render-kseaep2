import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComDetailComponent } from './com-detail.component';

describe('ComDetailComponent', () => {
  let component: ComDetailComponent;
  let fixture: ComponentFixture<ComDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
