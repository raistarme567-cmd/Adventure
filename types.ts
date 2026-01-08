
export interface User {
  id: string;
  username: string;
  profilePic: string;
  isVerified?: boolean;
}

export interface Post {
  id: string;
  user: User;
  imageUrl: string; // Used as video poster or primary image
  videoUrl?: string;
  mediaType: 'image' | 'video';
  title?: string;
  caption: string;
  externalLink?: string;
  likes: number;
  comments: number;
  timestamp: string;
  isLiked?: boolean;
}

export interface Story {
  id: string;
  user: User;
  hasUnseen?: boolean;
}
