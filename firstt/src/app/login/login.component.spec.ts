import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule],
      declarations: [LoginComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open forgot password modal', () => {
    component.openForgotPasswordModal();
    expect(component.showForgotPasswordModal).toBeTrue();
  });

  it('should close forgot password modal and reset email', () => {
    component.resetEmail = 'test@example.com';
    component.showForgotPasswordModal = true;
    component.closeForgotPasswordModal();
    expect(component.showForgotPasswordModal).toBeFalse();
    expect(component.resetEmail).toBe('');
  });

  it('should send reset link and close modal', () => {
    component.resetEmail = 'test@example.com';
    component.showForgotPasswordModal = true;
    component.onSendResetLink();
    expect(component.showForgotPasswordModal).toBeFalse();
    expect(component.resetEmail).toBe('');
  });
});