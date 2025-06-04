import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditsDetailsComponent } from './credits-details.component';

describe('CreditsDetailsComponent', () => {
  let component: CreditsDetailsComponent;
  let fixture: ComponentFixture<CreditsDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreditsDetailsComponent]
    });
    fixture = TestBed.createComponent(CreditsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
