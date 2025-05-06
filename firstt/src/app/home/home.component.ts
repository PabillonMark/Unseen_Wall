import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

export interface Reaction {
  type: string;
  count: number;
}

interface Reply {
  text: string;
  timestamp: string;
  user: string;
}

interface Comment {
  text: string;
  timestamp: string;
  reactions: Reaction[];
  userReaction: string | null;
  replies: Reply[];
  showReplyInput: boolean;
}

interface Post {
  content: string;
  timestamp: string;
  reactions: Reaction[];
  userReaction: string | null;
  comments: Comment[];
  commentCount: number;
  showComments: boolean;
  photo: string | null;
  isShared?: boolean;
  sharedBy?: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  reactionTypes: string[] = ['Like', 'Love', 'Haha', 'Wow', 'Sad', 'Angry'];
  posts: Post[] = [
    { 
      content: "I hope next year I’ll see the happiest version of me. Wherein I am appreciated, loved, and taken care of. Wherein I am surrounded by people with good intentions, wherein I get to give the purest and most genuine love to people who can reciprocate it.", 
      timestamp: "1h ago", 
      reactions: [{ type: 'Like', count: 10 }, { type: 'Love', count: 2 }], 
      userReaction: null, 
      comments: [
        { 
          text: "Wishing you the best!", 
          timestamp: "30m ago",
          reactions: [{ type: 'Like', count: 2 }],
          userReaction: null,
          replies: [{ text: "Thanks!", timestamp: "20m ago", user: "Anonymous" }],
          showReplyInput: false
        }
      ], 
      commentCount: 1, 
      showComments: false, 
      photo: null 
    },
    { 
      content: "I have no energy to argue. I’m okay with being misunderstood.", 
      timestamp: "1h ago", 
      reactions: [{ type: 'Sad', count: 5 }, { type: 'Haha', count: 3 }], 
      userReaction: null, 
      comments: [], 
      commentCount: 0, 
      showComments: false, 
      photo: null 
    },
    { 
      content: "Day by day life is getting unhappier.", 
      timestamp: "2d ago", 
      reactions: [{ type: 'Sad', count: 12 }, { type: 'Angry', count: 3 }], 
      userReaction: null, 
      comments: [
        { 
          text: "I feel you!", 
          timestamp: "1d ago",
          reactions: [],
          userReaction: null,
          replies: [],
          showReplyInput: false
        }
      ], 
      commentCount: 1, 
      showComments: false, 
      photo: null 
    },
    { 
      content: "Sleep can’t fix this type of tired anymore.", 
      timestamp: "3d ago", 
      reactions: [{ type: 'Sad', count: 15 }, { type: 'Wow', count: 5 }], 
      userReaction: null, 
      comments: [], 
      commentCount: 0, 
      showComments: false, 
      photo: null 
    },
    { 
      content: "My life is a mess, but I’m still grateful for the little things.", 
      timestamp: "4h ago", 
      reactions: [{ type: 'Sad', count: 5 }, { type: 'Haha', count: 3 }], 
      userReaction: null, 
      comments: [], 
      commentCount: 0, 
      showComments: false, 
      photo: null 
    },
  ];

  newPostContent: string = '';
  newPostPhoto: string | null = null;
  newComment: { [key: number]: string } = {};
  newReply: { [key: number]: { [key: number]: string } } = {};
  shareMessage: string | null = null;
  showReactionBar: { [key: number]: boolean } = {};
  showCommentReactionBar: { [key: number]: { [key: number]: boolean } } = {};

  currentUser = {
    username: 'Emnoraaj',
    profileImage: '/assets/profile-placeholder.jpg'
  };

  constructor(private router: Router, private authService: AuthService) {
    this.router.events.subscribe(event => {
      console.log('Router event in HomeComponent:', event);
    });
  }

  ngOnInit(): void {
    console.log('HomeComponent loaded');
  }

  redirectIfNotLoggedIn(): boolean {
    if (!this.authService.isLoggedIn) {
      this.router.navigateByUrl('/login');
      return true;
    }
    return false;
  }

  onLogin(): void {
    this.router.navigateByUrl('/login');
  }

  onSignUp(): void {
    this.router.navigateByUrl('/signup');
  }

  toggleReaction(item: Post | Comment, reactionType: string, isPost: boolean, postIndex?: number, commentIndex?: number): void {
    if (this.redirectIfNotLoggedIn()) return;

    const existingReaction = item.reactions.find(r => r.type === reactionType);
    if (item.userReaction === reactionType) {
      if (existingReaction) {
        existingReaction.count--;
        if (existingReaction.count === 0) {
          item.reactions = item.reactions.filter(r => r.type !== reactionType);
        }
      }
      item.userReaction = null;
    } else {
      if (item.userReaction) {
        const prevReaction = item.reactions.find(r => r.type === item.userReaction);
        if (prevReaction) {
          prevReaction.count--;
          if (prevReaction.count === 0) {
            item.reactions = item.reactions.filter(r => r.type !== item.userReaction);
          }
        }
      }
      if (existingReaction) {
        existingReaction.count++;
      } else {
        item.reactions.push({ type: reactionType, count: 1 });
      }
      item.userReaction = reactionType;
    }
  }

  getTotalReactions(item: Post | Comment): number {
    return item.reactions.reduce((total, reaction) => total + reaction.count, 0);
  }

  getReactionIcon(reactionType: string): string {
    switch (reactionType) {
      case 'Like': return '👍';
      case 'Love': return '❤️';
      case 'Haha': return '😂';
      case 'Wow': return '😮';
      case 'Sad': return '😢';
      case 'Angry': return '😡';
      default: return '';
    }
  }

  toggleComments(post: Post): void {
    if (this.redirectIfNotLoggedIn()) return;
    post.showComments = !post.showComments;
  }

  openReactionBar(index: number, isPost: boolean, postIndex?: number): void {
    if (this.redirectIfNotLoggedIn()) return;

    // Close all reaction bars
    Object.keys(this.showReactionBar).forEach(key => {
      this.showReactionBar[+key] = false;
    });
    Object.keys(this.showCommentReactionBar).forEach(pKey => {
      Object.keys(this.showCommentReactionBar[+pKey] || {}).forEach(cKey => {
        this.showCommentReactionBar[+pKey][+cKey] = false;
      });
    });

    // Open the requested bar
    if (isPost) {
      this.showReactionBar[index] = true;
    } else if (postIndex !== undefined) {
      if (!this.showCommentReactionBar[postIndex]) {
        this.showCommentReactionBar[postIndex] = {};
      }
      this.showCommentReactionBar[postIndex][index] = true;
    }
  }

  closeReactionBar(index: number, isPost: boolean, postIndex?: number): void {
    if (this.redirectIfNotLoggedIn()) return;

    if (isPost) {
      this.showReactionBar[index] = false;
    } else if (postIndex !== undefined) {
      if (this.showCommentReactionBar[postIndex]) {
        this.showCommentReactionBar[postIndex][index] = false;
      }
    }
  }

  selectReaction(item: Post | Comment, reaction: string, index: number, isPost: boolean, postIndex?: number): void {
    if (this.redirectIfNotLoggedIn()) return;
    this.toggleReaction(item, reaction, isPost, postIndex, index);
    this.closeReactionBar(index, isPost, postIndex);
  }

  addComment(post: Post, index: number): void {
    if (this.redirectIfNotLoggedIn()) return;
    if (this.newComment[index]) {
      const comment: Comment = {
        text: this.newComment[index],
        timestamp: "Just now",
        reactions: [],
        userReaction: null,
        replies: [],
        showReplyInput: false
      };
      post.comments.push(comment);
      post.commentCount = post.comments.length;
      this.newComment[index] = '';
    }
  }

  toggleReplyInput(comment: Comment, postIndex: number, commentIndex: number): void {
    if (this.redirectIfNotLoggedIn()) return;
    comment.showReplyInput = !comment.showReplyInput;
    if (!comment.showReplyInput) {
      this.newReply[postIndex] = this.newReply[postIndex] || {};
      this.newReply[postIndex][commentIndex] = '';
    }
  }

  addReply(post: Post, comment: Comment, postIndex: number, commentIndex: number): void {
    if (this.redirectIfNotLoggedIn()) return;
    if (this.newReply[postIndex]?.[commentIndex]) {
      const reply: Reply = {
        text: this.newReply[postIndex][commentIndex],
        timestamp: "Just now",
        user: this.currentUser.username
      };
      comment.replies.push(reply);
      this.newReply[postIndex][commentIndex] = '';
      comment.showReplyInput = false;
    }
  }

  sharePost(post: Post): void {
    if (this.redirectIfNotLoggedIn()) return;
    
    // Create a new shared post
    const sharedPost: Post = {
      content: post.content,
      timestamp: "Just now",
      reactions: [],
      userReaction: null,
      comments: [],
      commentCount: 0,
      showComments: false,
      photo: post.photo,
      isShared: true,
      sharedBy: this.currentUser.username
    };
    this.posts.unshift(sharedPost);

    // Copy to clipboard
    const shareText = `${post.content}${post.photo ? '\n[Image attached]' : ''}`;
    navigator.clipboard.writeText(shareText).then(() => {
      this.shareMessage = 'Post shared and copied to clipboard!';
      setTimeout(() => {
        this.shareMessage = null;
      }, 2000);
    }).catch(err => {
      this.shareMessage = 'Post shared but failed to copy.';
      console.error('Copy failed:', err);
      setTimeout(() => {
        this.shareMessage = null;
      }, 2000);
    });
  }

  onPhotoUpload(event: Event): void {
    if (this.redirectIfNotLoggedIn()) return;
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.newPostPhoto = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removePhoto(): void {
    if (this.redirectIfNotLoggedIn()) return;
    this.newPostPhoto = null;
  }

  createPost(): void {
    if (this.redirectIfNotLoggedIn()) return;
    if (this.newPostContent.trim() || this.newPostPhoto) {
      const newPost: Post = {
        content: this.newPostContent.trim(),
        timestamp: "Just now",
        reactions: [],
        userReaction: null,
        comments: [],
        commentCount: 0,
        showComments: false,
        photo: this.newPostPhoto
      };
      this.posts.unshift(newPost);
      this.newPostContent = '';
      this.newPostPhoto = null;
    }
  }

  manageProfile(): void {
    if (this.redirectIfNotLoggedIn()) return;
    this.router.navigateByUrl('/profile');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}