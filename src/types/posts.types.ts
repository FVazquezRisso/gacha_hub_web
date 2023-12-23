export interface PostInterface {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  author: Author;
}

interface Author {
  username: string;
  avatar: string;
  role: string;
}
