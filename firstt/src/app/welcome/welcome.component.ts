import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      console.log('Router event in WelcomeComponent:', event);
    });
  }

  ngOnInit() {
    console.log('WelcomeComponent loaded');
  }

  onGetStarted() {
    console.log('Navigating to home page');
    this.router.navigate(['/home']);
  }
}