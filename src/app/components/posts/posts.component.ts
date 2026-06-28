import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PostService } from '../../services/post.service';
import { Comment } from '../../models/comment.model';
import { CreatePost, Post } from '../../models/post.model';

type CommentSource = 'nested' | 'query' | null;

@Component({
  selector: 'app-posts',
  imports: [CommonModule, FormsModule],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css',
})
export class PostsComponent implements OnInit {
  private readonly postService = inject(PostService);

  posts: Post[] = [];
  selectedPost: Post | null = null;
  comments: Comment[] = [];
  commentSource: CommentSource = null;

  loading = false;
  error = '';
  successMessage = '';

  showCreateForm = false;
  showEditForm = false;
  showPatchForm = false;

  newPost: CreatePost = { title: '', body: '', userId: 1 };
  editPost: Post = { id: 0, userId: 1, title: '', body: '' };
  patchTitle = '';
  patchBody = '';

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.clearMessages();
    this.loading = true;
    this.postService.getPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
        this.loading = false;
      },
      error: () => this.handleError('Failed to load posts'),
    });
  }

  viewPost(id: number): void {
    this.clearMessages();
    this.loading = true;
    this.comments = [];
    this.commentSource = null;

    this.postService.getPost(id).subscribe({
      next: (post) => {
        this.selectedPost = post;
        this.loading = false;
      },
      error: () => this.handleError(`Failed to load post #${id}`),
    });
  }

  loadCommentsNested(postId: number): void {
    this.clearMessages();
    this.loading = true;

    this.postService.getPostComments(postId).subscribe({
      next: (comments) => {
        this.comments = comments;
        this.commentSource = 'nested';
        this.loading = false;
      },
      error: () => this.handleError(`Failed to load comments for post #${postId}`),
    });
  }

  loadCommentsQuery(postId: number): void {
    this.clearMessages();
    this.loading = true;

    this.postService.getCommentsByPostId(postId).subscribe({
      next: (comments) => {
        this.comments = comments;
        this.commentSource = 'query';
        this.loading = false;
      },
      error: () => this.handleError(`Failed to load comments (query) for post #${postId}`),
    });
  }

  openCreateForm(): void {
    this.showCreateForm = true;
    this.showEditForm = false;
    this.showPatchForm = false;
    this.newPost = { title: '', body: '', userId: 1 };
  }

  createPost(): void {
    this.clearMessages();
    this.loading = true;

    this.postService.createPost(this.newPost).subscribe({
      next: (post) => {
        this.posts = [post, ...this.posts];
        this.selectedPost = post;
        this.showCreateForm = false;
        this.successMessage = `Post created (id: ${post.id})`;
        this.loading = false;
      },
      error: () => this.handleError('Failed to create post'),
    });
  }

  openEditForm(post: Post): void {
    this.showEditForm = true;
    this.showCreateForm = false;
    this.showPatchForm = false;
    this.editPost = { ...post };
  }

  updatePost(): void {
    this.clearMessages();
    this.loading = true;

    this.postService.updatePost(this.editPost.id, this.editPost).subscribe({
      next: (post) => {
        this.posts = this.posts.map((p) => (p.id === post.id ? post : p));
        this.selectedPost = post;
        this.showEditForm = false;
        this.successMessage = `Post #${post.id} updated (PUT)`;
        this.loading = false;
      },
      error: () => this.handleError('Failed to update post'),
    });
  }

  openPatchForm(post: Post): void {
    this.showPatchForm = true;
    this.showCreateForm = false;
    this.showEditForm = false;
    this.patchTitle = post.title;
    this.patchBody = post.body;
    this.editPost = { ...post };
  }

  patchPost(): void {
    this.clearMessages();
    this.loading = true;

    this.postService.patchPost(this.editPost.id, {
      title: this.patchTitle,
      body: this.patchBody,
    }).subscribe({
      next: (post) => {
        this.posts = this.posts.map((p) => (p.id === post.id ? post : p));
        this.selectedPost = post;
        this.showPatchForm = false;
        this.successMessage = `Post #${post.id} patched (PATCH)`;
        this.loading = false;
      },
      error: () => this.handleError('Failed to patch post'),
    });
  }

  deletePost(id: number): void {
    if (!confirm(`Delete post #${id}?`)) return;

    this.clearMessages();
    this.loading = true;

    this.postService.deletePost(id).subscribe({
      next: () => {
        this.posts = this.posts.filter((p) => p.id !== id);
        if (this.selectedPost?.id === id) {
          this.selectedPost = null;
          this.comments = [];
          this.commentSource = null;
        }
        this.successMessage = `Post #${id} deleted`;
        this.loading = false;
      },
      error: () => this.handleError(`Failed to delete post #${id}`),
    });
  }

  clearSelection(): void {
    this.selectedPost = null;
    this.comments = [];
    this.commentSource = null;
    this.showCreateForm = false;
    this.showEditForm = false;
    this.showPatchForm = false;
  }

  private clearMessages(): void {
    this.error = '';
    this.successMessage = '';
  }

  private handleError(message: string): void {
    this.error = message;
    this.loading = false;
  }
}
