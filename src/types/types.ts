export interface PostInterface {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  author: Author;
  likeCount: number;
  userLikedPost: boolean;
  commentCount: number;
}

export interface CommentInterface {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  PostId: number;
  author: author;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
}

export interface UserInterface {
  username: string;
  avatar: string;
  banner: string;
  role: string;
  bio: string;
  discordUsername: string;
  isVerified: boolean;
}

interface Author {
  username: string;
  avatar: string;
  role: string;
}
