import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment.model';
import { CreatePost, PatchPost, Post, UpdatePost } from '../models/post.model';

@Injectable({ providedIn: 'root' })
export class PostService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://jsonplaceholder.typicode.com';

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/posts`);
  }

  getPost(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.baseUrl}/posts/${id}`);
  }

  getPostComments(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.baseUrl}/posts/${postId}/comments`);
  }

  getCommentsByPostId(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.baseUrl}/comments`, {
      params: { postId: postId.toString() },
    });
  }

  createPost(post: CreatePost): Observable<Post> {
    return this.http.post<Post>(`${this.baseUrl}/posts`, post);
  }

  updatePost(id: number, post: UpdatePost): Observable<Post> {
    return this.http.put<Post>(`${this.baseUrl}/posts/${id}`, post);
  }

  patchPost(id: number, post: PatchPost): Observable<Post> {
    return this.http.patch<Post>(`${this.baseUrl}/posts/${id}`, post);
  }

  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/posts/${id}`);
  }
}
