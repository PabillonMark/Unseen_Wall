import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { HomeComponent, Reaction } from './home.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { By } from '@angular/platform-browser';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let router: jasmine.SpyObj<Router>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'logout'], { isLoggedIn: true });
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule,
        CommonModule,
        HomeComponent
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with posts', () => {
    expect(component.posts.length).toBe(5);
  });

  it('should open post reaction bar and close all others', () => {
    component.openReactionBar(0, true);
    expect(component.showReactionBar[0]).toBeTrue();
    expect(component.showReactionBar[1]).toBeFalse();
    expect(component.showCommentReactionBar[0]?.[0]).toBeFalsy();
  });

  it('should open comment reaction bar and close all others', () => {
    component.openReactionBar(0, false, 0);
    expect(component.showCommentReactionBar[0][0]).toBeTrue();
    expect(component.showCommentReactionBar[0][1]).toBeFalsy();
    expect(component.showReactionBar[0]).toBeFalse();
  });

  it('should close post reaction bar', () => {
    component.openReactionBar(0, true);
    expect(component.showReactionBar[0]).toBeTrue();
    component.closeReactionBar(0, true);
    expect(component.showReactionBar[0]).toBeFalse();
  });

  it('should close comment reaction bar', () => {
    component.openReactionBar(0, false, 0);
    expect(component.showCommentReactionBar[0][0]).toBeTrue();
    component.closeReactionBar(0, false, 0);
    expect(component.showCommentReactionBar[0][0]).toBeFalse();
  });

  it('should select post reaction and close bar', () => {
    const post = component.posts[0];
    component.openReactionBar(0, true);
    expect(component.showReactionBar[0]).toBeTrue();
    component.selectReaction(post, 'Haha', 0, true);
    expect(post.userReaction).toBe('Haha');
    expect(component.showReactionBar[0]).toBeFalse();
    expect(component.getTotalReactions(post)).toBe(13); // 10 Likes + 2 Loves + 1 Haha
  });

  it('should select comment reaction and close bar', () => {
    const comment = component.posts[0].comments[0];
    component.openReactionBar(0, false, 0);
    expect(component.showCommentReactionBar[0][0]).toBeTrue();
    component.selectReaction(comment, 'Love', 0, false, 0);
    expect(comment.userReaction).toBe('Love');
    expect(component.showCommentReactionBar[0][0]).toBeFalse();
    expect(component.getTotalReactions(comment)).toBe(3); // 2 Likes + 1 Love
  });

  it('should toggle reaction on post and update counts', () => {
    const post = component.posts[0];
    component.toggleReaction(post, 'Like', true);
    expect(post.userReaction).toBe('Like');
    expect(component.getTotalReactions(post)).toBe(11); // Initial 10 Likes + 1
    expect(post.reactions.find(r => r.type === 'Like')?.count).toBe(11);

    component.toggleReaction(post, 'Like', true);
    expect(post.userReaction).toBeNull();
    expect(component.getTotalReactions(post)).toBe(10); // Back to 10 Likes
    expect(post.reactions.find(r => r.type === 'Like')?.count).toBe(10);
  });

  it('should toggle reaction on comment and update counts', () => {
    const comment = component.posts[0].comments[0];
    component.toggleReaction(comment, 'Like', false, 0, 0);
    expect(comment.userReaction).toBe('Like');
    expect(component.getTotalReactions(comment)).toBe(3); // Initial 2 Likes + 1
    expect(comment.reactions.find((r: Reaction) => r.type === 'Like')?.count).toBe(3);

    component.toggleReaction(comment, 'Love', false, 0, 0);
    expect(comment.userReaction).toBe('Love');
    expect(component.getTotalReactions(comment)).toBe(3); // 1 Like (2-1) + 1 Love
    expect(comment.reactions.find((r: Reaction) => r.type === 'Like')?.count).toBe(1);
    expect(comment.reactions.find((r: Reaction) => r.type === 'Love')?.count).toBe(1);
  });

  it('should apply comment reaction and verify reaction type', () => {
    const comment = component.posts[0].comments[0];
    component.selectReaction(comment, 'Love', 0, false, 0);
    expect(comment.userReaction).toBe('Love');
    expect(comment.reactions.find((r: Reaction) => r.type === 'Love')?.count).toBe(1);
    expect(component.getReactionIcon('Love')).toBe('❤️');
  });

  it('should share a post and create a new shared post', () => {
    spyOn(navigator.clipboard, 'writeText').and.returnValue(Promise.resolve());
    const post = component.posts[0];
    const initialLength = component.posts.length;
    component.sharePost(post);
    expect(component.posts.length).toBe(initialLength + 1);
    expect(component.posts[0].isShared).toBeTrue();
    expect(component.posts[0].sharedBy).toBe(component.currentUser.username);
    expect(component.posts[0].content).toBe(post.content);
    expect(component.posts[0].photo).toBe(post.photo);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(post.content);
    expect(component.shareMessage).toBe('Post shared and copied to clipboard!');
  });

  it('should add a comment to a post', () => {
    const post = component.posts[0];
    component.newComment[0] = 'Test comment';
    component.addComment(post, 0);
    expect(post.comments.length).toBe(2);
    expect(post.comments[1].text).toBe('Test comment');
    expect(post.comments[1].reactions).toEqual([]);
    expect(post.comments[1].userReaction).toBeNull();
    expect(post.comments[1].replies).toEqual([]);
    expect(post.comments[1].showReplyInput).toBeFalse();
    expect(component.newComment[0]).toBe('');
  });

  it('should create a new post', () => {
    component.newPostContent = 'New post content';
    component.createPost();
    expect(component.posts.length).toBe(6);
    expect(component.posts[0].content).toBe('New post content');
    expect(component.newPostContent).toBe('');
  });

  it('should redirect to login if not logged in when interacting', () => {
    Object.defineProperty(authService, 'isLoggedIn', { value: false }); // Mock getter
    const post = component.posts[0];
    const comment = post.comments[0];
    component.toggleReaction(post, 'Like', true);
    component.toggleReaction(comment, 'Like', false, 0, 0);
    component.toggleReplyInput(comment, 0, 0);
    component.addReply(post, comment, 0, 0);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  });

  it('should render comment reaction button under comment text', () => {
    component.posts[0].showComments = true;
    fixture.detectChanges();
    const commentElement = fixture.nativeElement.querySelector('.comment .comment-content');
    const commentText = commentElement.querySelector('.comment-text');
    const reactionButton = commentElement.querySelector('.action-icon.reaction-wrapper');
    expect(reactionButton).toBeTruthy();
    expect(commentText.nextElementSibling).not.toBe(reactionButton); // Reaction button is after summary
    expect(commentElement.contains(reactionButton)).toBeTrue();
  });

  it('should render reply button beside reaction button', () => {
    component.posts[0].showComments = true;
    fixture.detectChanges();
    const commentElement = fixture.nativeElement.querySelector('.comment .comment-content');
    const commentActions = commentElement.querySelector('.comment-actions');
    const reactionButton = commentActions.querySelector('.action-icon.reaction-wrapper');
    const replyButton = commentActions.querySelector('.action-icon:not(.reaction-wrapper)');
    expect(commentActions).toBeTruthy();
    expect(reactionButton).toBeTruthy();
    expect(replyButton).toBeTruthy();
    expect(replyButton.textContent).toContain('Reply');
    expect(commentActions.contains(reactionButton)).toBeTrue();
    expect(commentActions.contains(replyButton)).toBeTrue();
  });

  it('should toggle reply input visibility', () => {
    const comment = component.posts[0].comments[0];
    expect(comment.showReplyInput).toBeFalse();
    component.toggleReplyInput(comment, 0, 0);
    expect(comment.showReplyInput).toBeTrue();
    component.toggleReplyInput(comment, 0, 0);
    expect(comment.showReplyInput).toBeFalse();
    expect(component.newReply[0]?.[0]).toBe('');
  });

  it('should add a reply to a comment', () => {
    const post = component.posts[0];
    const comment = post.comments[0];
    component.newReply[0] = { 0: 'Test reply' };
    component.addReply(post, comment, 0, 0);
    expect(comment.replies.length).toBe(2);
    expect(comment.replies[1].text).toBe('Test reply');
    expect(comment.replies[1].user).toBe(component.currentUser.username);
    expect(comment.replies[1].timestamp).toBe('Just now');
    expect(component.newReply[0][0]).toBe('');
    expect(comment.showReplyInput).toBeFalse();
  });

  it('should render replies under comment', () => {
    component.posts[0].showComments = true;
    fixture.detectChanges();
    const commentElement = fixture.nativeElement.querySelector('.comment .comment-content');
    const repliesElement = commentElement.querySelector('.replies');
    const replyElement = repliesElement.querySelector('.reply');
    expect(repliesElement).toBeTruthy();
    expect(replyElement).toBeTruthy();
    expect(replyElement.querySelector('.reply-text').textContent).toBe('Thanks!');
    expect(replyElement.querySelector('.reply-author').textContent).toBe('Anonymous');
  });
});