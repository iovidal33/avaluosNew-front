import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcuseAvaluoComponent } from './acuse-avaluo.component';

describe('AcuseAvaluoComponent', () => {
  let component: AcuseAvaluoComponent;
  let fixture: ComponentFixture<AcuseAvaluoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcuseAvaluoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcuseAvaluoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
