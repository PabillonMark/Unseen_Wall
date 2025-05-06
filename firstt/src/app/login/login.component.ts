import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  resetEmail: string = '';
  showForgotPasswordModal: boolean = false;
  errorMessage: string = '';

  constructor(private router: Router, private authService: AuthService) {
    this.router.events.subscribe(event => {
      console.log('Router event in LoginComponent:', event);
    });
  }

  onSignIn() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Email and password are required';
      return;
    }

    console.log('Sign in attempted with:', this.email, this.password);
    this.errorMessage = '';

    if (this.authService.login(this.email, this.password)) {
      this.router.navigateByUrl('/home', { replaceUrl: true }).then(success => {
        console.log('Navigation to home', success ? 'succeeded' : 'failed');
        if (!success) {
          console.error('Navigation to home failed');
        }
      }).catch(err => {
        console.error('Navigation error:', err);
      });
    } else {
      this.errorMessage = 'Invalid email or password';
    }
  }

  onSignUp(event: Event) {
    event.preventDefault();
    console.log('Sign up link clicked');
    this.router.navigateByUrl('/signup', { replaceUrl: true }).then(success => {
      console.log('Navigation to signup', success ? 'succeeded' : 'failed');
    }).catch(err => {
      console.error('Navigation error:', err);
    });
  }

  openForgotPasswordModal() {
    this.showForgotPasswordModal = true;
    this.resetEmail = '';
  }

  closeForgotPasswordModal() {
    this.showForgotPasswordModal = false;
    this.resetEmail = '';
  }

  onSendResetLink() {
    if (this.resetEmail) {
      console.log('Sending password reset link to:', this.resetEmail);
      this.closeForgotPasswordModal();
    }
  }
}