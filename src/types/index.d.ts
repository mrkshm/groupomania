import { string } from "prop-types";

export interface UserType {
  id: string;
  name: string;
  email: string;
  body?: string;
  image?: string;
  isActive: boolean;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  postCount?: number;
  commentCount?: number;
}

export interface SessionUserObjectType {
  sessionUser: {
    name: string;
    email: string;
    id: string;
    image: string;
    isAdmin?: boolean;
  };
}

export interface PostType {
  id: number;
  identifier: string;
  slug: string;
  title: string;
  body?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  userName?: string;
  tagId: number;
  tagName?: string;
  voteScore: number;
  commentCount: number;
  userVote?: number;
  userSlug?: string;
}

export interface CommentType {
  body: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  id: number;
  postId: number;
  username?: string;
  voteScore: number;
  userVote?: number;
}

export interface TagType {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  _count: { posts: string; value: number };
}

export interface UserObjectType {
  user: {
    id: string;
    name: string;
    email: string;
    body?: string;
    image?: string;
    isActive?: boolean;
    isAdmin?: boolean;
    createdAt: string;
    updatedAt: string;
    postCount?: number;
    commentCount?: number;
  };
}

export interface ProfileModProps {
  onClose: Function;
  userId: string;
  mutateUser: Function;
  populator?: string;
  initialRef: RefObject;
}

export interface SessionUserType {
  name: string;
  id: string;
  image: string;
  isAdmin?: boolean;
}
