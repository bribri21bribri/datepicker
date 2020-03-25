import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatepickerSelectNavComponent } from './datepicker-select-nav.component';

describe('DatepickerSelectNavComponent', () => {
  let component: DatepickerSelectNavComponent;
  let fixture: ComponentFixture<DatepickerSelectNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatepickerSelectNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatepickerSelectNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
