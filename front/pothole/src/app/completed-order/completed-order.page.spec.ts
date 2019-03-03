import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedOrderPage } from './completed-order.page';

describe('CompletedOrderPage', () => {
  let component: CompletedOrderPage;
  let fixture: ComponentFixture<CompletedOrderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompletedOrderPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletedOrderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
