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

interface Author {
  username: string;
  avatar: string;
  role: string;
}
