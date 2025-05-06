import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { SignupComponent } from './signup.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let router: jasmine.SpyObj<Router>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['signup']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule,
        CommonModule,
        SignupComponent
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error message if any field is empty', () => {
    component.username = '';
    component.email = '';
    component.password = '';
    component.confirmPassword = '';
    component.onSignUp();
    expect(component.errorMessage).toBe('All fields are required');
    expect(component.successMessage).toBe('');
  });

  it('should show error message if passwords do not match', () => {
    component.username = 'testuser';
    component.email = 'test@example.com';
    component.password = 'password123';
    component.confirmPassword = 'password456';
    component.onSignUp();
    expect(component.errorMessage).toBe('Passwords do not match');
    expect(component.successMessage).toBe('');
  });

  it('should redirect to login on successful signup', () => {
    authService.signup.and.returnValue(true);
    component.username = 'testuser';
    component.email = 'new@example.com';
    component.password = 'password123';
    component.confirmPassword = 'password123';
    component.onSignUp();
    expect(authService.signup).toHaveBeenCalledWith('new@example.com', 'password123', 'testuser');
    expect(component.successMessage).toBe('Account created successfully! Redirecting to login...');
    expect(component.errorMessage).toBe('');
    setTimeout(() => {
      expect(router.navigateByUrl).toHaveBeenCalledWith('/login', { replaceUrl: true });
    }, 2000);
  });

  it('should show error message if email already exists', () => {
    authService.signup.and.returnValue(false);
    component.username = 'testuser';
    component.email = 'existing@example.com';
    component.password = 'password123';
    component.confirmPassword = 'password123';
    component.onSignUp();
    expect(authService.signup).toHaveBeenCalledWith('existing@example.com', 'password123', 'testuser');
    expect(component.errorMessage).toBe('Email already exists');
    expect(component.successMessage).toBe('');
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

  it('should navigate to login when login link is clicked', () => {
    const event = new Event('click');
    component.onLogin(event);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/login', { replaceUrl: true });
  });

  it('should log social login attempt', () => {
    spyOn(console, 'log');
    component.onSocialLogin('Instagram');
    expect(console.log).toHaveBeenCalledWith('Social login attempted with Instagram');
    expect(component.errorMessage).toBe('Social login with Instagram is not implemented yet.');
  });
});