import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

interface Post {
  content: string;
  timestamp: string;
  reactions: { type: string; count: number }[];
  comments: { text: string; timestamp: string }[];
  commentCount: number;
  photo: string | null;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser = {
    username: 'Jane Rhyne Pabillon',
    profileImage: '/assets/profile-placeholder.jpg',
    email: 'jane@example.com',
    bio: 'Loving life and sharing moments!'
  };

  activeTab: string = 'posts'; // Default tab

  posts: Post[] = [
    {
      content: "My Education is going to finish me before I finish it.",
      timestamp: "1h ago",
      reactions: [{ type: 'Like', count: 10 }],
      comments: [],
      commentCount: 0,
      photo: null
    },
    {
      content: "Enjoying a sunny day at the park!",
      timestamp: "2d ago",
      reactions: [{ type: 'Love', count: 5 }],
      comments: [],
      commentCount: 0,
      photo: null
    }
  ];

  newBio: string = this.currentUser.bio;
  newUsername: string = this.currentUser.username;
  newEmail: string = this.currentUser.email;

  constructor(private router: Router, private authService: AuthService) {
    this.router.events.subscribe(event => {
      console.log('Router event in ProfileComponent:', event);
    });
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn) {
      this.router.navigateByUrl('/login');
    }
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  updateProfile(): void {
    this.currentUser.bio = this.newBio;
    this.currentUser.username = this.newUsername;
    this.currentUser.email = this.newEmail;
    console.log('Profile updated:', this.currentUser);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}