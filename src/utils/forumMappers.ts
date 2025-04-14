
import { ForumPost, ForumReply } from "@/types/community";

// Helper function to map database data to our TypeScript types
export const mapPostFromDB = (post: any): ForumPost => {
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    category: post.category,
    authorId: post.author_id || "",
    authorName: post.author_name,
    authorAvatar: post.author_avatar,
    tags: post.tags || [],
    createdAt: post.created_at,
    updatedAt: post.updated_at,
    likes: post.likes || 0,
    views: post.views || 0,
    isPinned: post.is_pinned || false,
    upvotesCount: post.upvotes_count || 0,
    replies: [],
    isLiked: false,
    isUpvoted: false
  };
};

export const mapReplyFromDB = (reply: any): ForumReply => {
  return {
    id: reply.id,
    content: reply.content,
    authorId: reply.author_id || "",
    authorName: reply.author_name,
    authorAvatar: reply.author_avatar,
    createdAt: reply.created_at,
    updatedAt: reply.updated_at,
    likes: reply.likes || 0,
    parentId: reply.parent_id,
    replyParentId: reply.reply_parent_id,
    isLiked: false,
    nestedReplies: []
  };
};
