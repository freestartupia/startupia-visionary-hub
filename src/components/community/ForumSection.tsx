
import React, { useState } from 'react';
import { mockForumPosts } from '@/data/mockCommunityData';
import { ForumPost } from '@/types/community';
import { Button } from '@/components/ui/button';
import { PlusCircle, MessageCircle, ThumbsUp, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import AuthRequired from '@/components/AuthRequired';

interface ForumSectionProps {
  requireAuth?: boolean;
}

const ForumSection: React.FC<ForumSectionProps> = ({ requireAuth = false }) => {
  const [posts] = useState<ForumPost[]>(mockForumPosts);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCreatePost = () => {
    if (requireAuth && !user) {
      toast.error("Vous devez être connecté pour créer un post");
      navigate('/auth');
      return;
    }
    
    // In a real app, this would open a form to create a new post
    toast.success("Fonctionnalité en développement");
  };

  const handleLikePost = (postId: string) => {
    if (requireAuth && !user) {
      toast.error("Vous devez être connecté pour liker un post");
      navigate('/auth');
      return;
    }
    
    // In a real app, this would like the post
    toast.success("Post liké !");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Forum IA</h2>
        <Button 
          onClick={handleCreatePost}
          className="bg-startupia-turquoise hover:bg-startupia-turquoise/90"
        >
          <PlusCircle size={18} className="mr-2" />
          Nouveau sujet
        </Button>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="glass-card p-4 hover:bg-white/5 transition-colors cursor-pointer">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white/10 text-xs font-medium py-1 px-2 rounded">
                {post.category}
              </span>
              {post.isPinned && (
                <span className="bg-startupia-gold/20 text-startupia-gold text-xs font-medium py-1 px-2 rounded">
                  Épinglé
                </span>
              )}
            </div>
            
            <h3 className="text-xl font-semibold mb-1">{post.title}</h3>
            
            <p className="text-white/70 mb-3 line-clamp-2">
              {post.content}
            </p>
            
            <div className="flex flex-wrap justify-between items-center">
              <div className="flex items-center text-sm text-white/60 mb-2 sm:mb-0">
                <img 
                  src={post.authorAvatar || '/placeholder.svg'} 
                  alt={post.authorName} 
                  className="w-6 h-6 rounded-full mr-2"
                />
                <span>{post.authorName}</span>
                <span className="mx-2">•</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              
              <div className="flex gap-4">
                <AuthRequired forActiveParticipation={requireAuth}>
                  <button 
                    onClick={() => handleLikePost(post.id)}
                    className="flex items-center gap-1 text-white/60 hover:text-white"
                  >
                    <ThumbsUp size={16} />
                    <span>{post.likes}</span>
                  </button>
                </AuthRequired>
                
                <div className="flex items-center gap-1 text-white/60">
                  <MessageCircle size={16} />
                  <span>{post.replies.length}</span>
                </div>
                
                <div className="flex items-center gap-1 text-white/60">
                  <Eye size={16} />
                  <span>{post.views}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForumSection;
