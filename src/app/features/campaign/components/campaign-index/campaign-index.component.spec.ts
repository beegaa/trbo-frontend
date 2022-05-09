import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignIndexComponent } from './campaign-index.component';

describe('CampaignIndexComponent', () => {
  let component: CampaignIndexComponent;
  let fixture: ComponentFixture<CampaignIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampaignIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
