export type PostTag = "Tip" | "Question" | "Looking" | "Sublet" | "Heads-up" | "Classifieds" | "Review";

export const POST_TAGS: PostTag[] = [
  "Tip", "Question", "Looking", "Sublet", "Heads-up", "Classifieds", "Review",
];

export const TAG_TONE: Record<PostTag, "neutral" | "accent" | "success" | "warn" | "danger"> = {
  "Tip": "success",
  "Question": "accent",
  "Looking": "accent",
  "Sublet": "neutral",
  "Heads-up": "warn",
  "Classifieds": "neutral",
  "Review": "neutral",
};

export type UserRole = "tenant" | "landlord" | "agent" | "admin";

export interface FeedUser {
  id: string;
  name: string;
  initials: string;
  role: UserRole;
  area: string;
  verified?: boolean;
  bio?: string;
  followers: number;
  following: number;
}

export interface FeedPost {
  id: string;
  authorId: string;
  tag: PostTag;
  area: string;
  body: string;
  photoLabel?: string;
  time: string;
  likes: number;
  comments: number;
  reposts: number;
  /** Whether the current user is following the author. */
  authorFollowed?: boolean;
}

export const USERS: FeedUser[] = [];

export const POSTS: FeedPost[] = [];

export function userById(id: string): FeedUser | undefined {
  return USERS.find((u) => u.id === id);
}
