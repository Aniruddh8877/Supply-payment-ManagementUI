import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyLadgerHistoryComponent } from './party-ladger-history.component';

describe('PartyLadgerHistoryComponent', () => {
  let component: PartyLadgerHistoryComponent;
  let fixture: ComponentFixture<PartyLadgerHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PartyLadgerHistoryComponent]
    });
    fixture = TestBed.createComponent(PartyLadgerHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
