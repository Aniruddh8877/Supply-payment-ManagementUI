import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyDueHistoryComponent } from './party-due-history.component';

describe('PartyDueHistoryComponent', () => {
  let component: PartyDueHistoryComponent;
  let fixture: ComponentFixture<PartyDueHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PartyDueHistoryComponent]
    });
    fixture = TestBed.createComponent(PartyDueHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
