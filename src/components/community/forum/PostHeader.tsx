
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from 'lucide-react';
import { ForumPost } from '@/types/community';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PostHeaderProps {
  post: ForumPost;
}

const PostHeader: React.FC<PostHeaderProps> = ({ post }) => {
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: fr
      });
    } catch (error) {
      return 'date inconnue';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={post.authorAvatar} alt={post.authorName} />
          <AvatarFallback>{getInitials(post.authorName)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{post.authorName}</h3>
          <div className="text-sm text-white/60 flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDate(post.createdAt)}
          </div>
        </div>
      </div>
      <div>
        <span className="bg-white/10 text-xs font-medium py-1 px-2 rounded">
          {post.category}
        </span>
        {post.isPinned && (
          <span className="bg-startupia-gold/20 text-startupia-gold text-xs font-medium py-1 px-2 rounded ml-2">
            Épinglé
          </span>
        )}
      </div>
    </div>
  );
};

export default PostHeader;
