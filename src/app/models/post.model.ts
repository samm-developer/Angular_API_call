export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface CreatePost {
  title: string;
  body: string;
  userId: number;
}

export interface UpdatePost {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface PatchPost {
  title?: string;
  body?: string;
}
