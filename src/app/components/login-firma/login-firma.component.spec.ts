import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginFirmaComponent } from './login-firma.component';

describe('LoginFirmaComponent', () => {
  let component: LoginFirmaComponent;
  let fixture: ComponentFixture<LoginFirmaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginFirmaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginFirmaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
