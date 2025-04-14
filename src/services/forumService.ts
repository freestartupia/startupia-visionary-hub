
// This file re-exports all forum-related services for backward compatibility
export { 
  getForumPosts, 
  getForumPost, 
  incrementPostViews 
} from './forum/postFetchService';

export { 
  createForumPost 
} from './forum/postCreateService';

export { 
  getRepliesForPost, 
  addReplyToPost 
} from './forum/replyService';

export * from './forumLikeService';
