import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvaluosProximosComponent } from './avaluos-proximos.component';

describe('AvaluosProximosComponent', () => {
  let component: AvaluosProximosComponent;
  let fixture: ComponentFixture<AvaluosProximosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvaluosProximosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvaluosProximosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
