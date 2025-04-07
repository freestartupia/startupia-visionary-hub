
import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { ForumPost } from '@/types/community';
import PostHeader from './PostHeader';
import PostFooter from './PostFooter';

interface PostContentProps {
  post: ForumPost;
  onLike: () => void;
}

const PostContent: React.FC<PostContentProps> = ({ post, onLike }) => {
  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader>
        <PostHeader post={post} />
        <h2 className="text-2xl font-bold mt-4">{post.title}</h2>
      </CardHeader>
      
      <CardContent>
        <div className="whitespace-pre-wrap">{post.content}</div>
      </CardContent>
      
      <CardFooter>
        <PostFooter post={post} onLike={onLike} />
      </CardFooter>
    </Card>
  );
};

export default PostContent;
