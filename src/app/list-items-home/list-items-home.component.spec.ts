import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListItemsHomeComponent } from './list-items-home.component';

describe('ListItemsHomeComponent', () => {
  let component: ListItemsHomeComponent;
  let fixture: ComponentFixture<ListItemsHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListItemsHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListItemsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
