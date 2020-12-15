import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandejaEntradaPeritoComponent } from './bandeja-entrada-perito.component';

describe('BandejaEntradaPeritoComponent', () => {
  let component: BandejaEntradaPeritoComponent;
  let fixture: ComponentFixture<BandejaEntradaPeritoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BandejaEntradaPeritoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BandejaEntradaPeritoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
