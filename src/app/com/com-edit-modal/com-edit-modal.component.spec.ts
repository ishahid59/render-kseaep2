import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComEditModalComponent } from './com-edit-modal.component';

describe('ComEditModalComponent', () => {
  let component: ComEditModalComponent;
  let fixture: ComponentFixture<ComEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComEditModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
