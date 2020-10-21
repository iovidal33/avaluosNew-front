import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubirAvaluoComponent } from './subir-avaluo.component';

describe('SubirAvaluoComponent', () => {
  let component: SubirAvaluoComponent;
  let fixture: ComponentFixture<SubirAvaluoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubirAvaluoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubirAvaluoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
