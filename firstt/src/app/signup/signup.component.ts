import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private router: Router, private authService: AuthService) {
    this.router.events.subscribe(event => {
      console.log('Router event in SignupComponent:', event);
    });
  }

  onSignUp() {
    this.errorMessage = '';
    this.successMessage = '';

    // Validate fields
    if (!this.username || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'All fields are required';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    console.log('Sign up attempted with:', this.username, this.email, this.password);

    if (this.authService.signup(this.email, this.password, this.username)) {
      this.successMessage = 'Account created successfully! Redirecting to login...';
      setTimeout(() => {
        this.router.navigateByUrl('/login', { replaceUrl: true }).then(success => {
          console.log('Navigation to login', success ? 'succeeded' : 'failed');
        }).catch(err => {
          console.error('Navigation error:', err);
        });
      }, 2000);
    } else {
      this.errorMessage = 'Email already exists';
    }
  }

  onLogin(event: Event | undefined = undefined) {
    if (event) event.preventDefault();
    console.log('Login link clicked');
    this.router.navigateByUrl('/login', { replaceUrl: true }).then(success => {
      console.log('Navigation to login', success ? 'succeeded' : 'failed');
    }).catch(err => {
      console.error('Navigation error:', err);
    });
  }

  // Placeholder for social login (to be implemented with actual OAuth logic)
  onSocialLogin(provider: string) {
    console.log(`Social login attempted with ${provider}`);
    this.errorMessage = `Social login with ${provider} is not implemented yet.`;
  }
}