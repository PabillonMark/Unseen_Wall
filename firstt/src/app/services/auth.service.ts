import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isLoggedIn: boolean = false;
  private users: { username: string, email: string, password: string }[] = [];

  constructor() {
    const savedState = localStorage.getItem('isLoggedIn');
    if (savedState) {
      this._isLoggedIn = JSON.parse(savedState);
    }
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      this.users = JSON.parse(savedUsers);
    }
  }

  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  signup(email: string, password: string, username: string): boolean {
    if (this.users.some(user => user.email === email)) {
      return false;
    }
    this.users.push({ username, email, password });
    localStorage.setItem('users', JSON.stringify(this.users));
    return true;
  }

  login(email: string, password: string): boolean {
    const user = this.users.find(user => user.email === email && user.password === password);
    if (user) {
      this._isLoggedIn = true;
      localStorage.setItem('isLoggedIn', JSON.stringify(this._isLoggedIn));
      return true;
    }
    return false;
  }

  logout(): void {
    this._isLoggedIn = false;
    localStorage.setItem('isLoggedIn', JSON.stringify(this._isLoggedIn));
  }
}