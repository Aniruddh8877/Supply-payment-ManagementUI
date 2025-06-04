import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartySupplyItemComponent } from './party-supply-item.component';

describe('PartySupplyItemComponent', () => {
  let component: PartySupplyItemComponent;
  let fixture: ComponentFixture<PartySupplyItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PartySupplyItemComponent]
    });
    fixture = TestBed.createComponent(PartySupplyItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
