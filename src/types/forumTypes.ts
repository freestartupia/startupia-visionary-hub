
export interface ForumPostDB {
  id: string;
  title: string;
  content: string;
  category: string;
  author_id: string;
  author_name: string;
  author_avatar?: string | null;
  tags?: string[] | null;
  created_at: string;
  updated_at?: string | null;
  likes?: number;
  views?: number;
  is_pinned?: boolean;
}

export interface ForumReplyDB {
  id: string;
  content: string;
  author_id: string;
  author_name: string;
  author_avatar?: string | null;
  created_at: string;
  updated_at?: string | null;
  likes?: number;
  parent_id?: string | null;
  reply_parent_id?: string | null;
  post_id?: string;
}

export interface ForumPostLikeDB {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
}

export interface ForumReplyLikeDB {
  id: string;
  reply_id: string;
  user_id: string;
  created_at: string;
}
