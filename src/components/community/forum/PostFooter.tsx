
import React from 'react';
import { ThumbsUp, MessageCircle, Eye } from 'lucide-react';
import { ForumPost } from '@/types/community';

interface PostFooterProps {
  post: ForumPost;
  onLike: () => void;
}

const PostFooter: React.FC<PostFooterProps> = ({ post, onLike }) => {
  return (
    <div className="flex justify-between border-t border-white/10 pt-4">
      <div className="flex gap-4">
        <button 
          onClick={onLike}
          className={`flex items-center gap-1 ${post.isLiked ? "text-startupia-turquoise" : "text-white/60 hover:text-white"}`}
        >
          <ThumbsUp size={18} />
          <span>{post.likes}</span>
        </button>
        
        <div className="flex items-center gap-1 text-white/60">
          <MessageCircle size={18} />
          <span>{post.replies?.length || 0}</span>
        </div>
        
        <div className="flex items-center gap-1 text-white/60">
          <Eye size={18} />
          <span>{post.views}</span>
        </div>
      </div>
    </div>
  );
};

export default PostFooter;
