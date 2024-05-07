import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComServicefeeComponent } from './com-servicefee.component';

describe('ComServicefeeComponent', () => {
  let component: ComServicefeeComponent;
  let fixture: ComponentFixture<ComServicefeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComServicefeeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComServicefeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
