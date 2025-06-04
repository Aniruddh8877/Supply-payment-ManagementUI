import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyDetailComponent } from './party-detail.component';

describe('PartyDetailComponent', () => {
  let component: PartyDetailComponent;
  let fixture: ComponentFixture<PartyDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PartyDetailComponent]
    });
    fixture = TestBed.createComponent(PartyDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
