import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigacionMercadoComponent } from './investigacion-mercado.component';

describe('InvestigacionMercadoComponent', () => {
  let component: InvestigacionMercadoComponent;
  let fixture: ComponentFixture<InvestigacionMercadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestigacionMercadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestigacionMercadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
