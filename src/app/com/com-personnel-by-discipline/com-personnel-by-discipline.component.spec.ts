import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComPersonnelByDisciplineComponent } from './com-personnel-by-discipline.component';

describe('ComPersonnelByDisciplineComponent', () => {
  let component: ComPersonnelByDisciplineComponent;
  let fixture: ComponentFixture<ComPersonnelByDisciplineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComPersonnelByDisciplineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComPersonnelByDisciplineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
