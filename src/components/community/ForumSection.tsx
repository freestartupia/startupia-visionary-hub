
import React, { useState } from 'react';
import { Search, Filter, MessageSquare, Eye, ThumbsUp, Clock, PlusCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ForumPost, ForumCategory } from '@/types/community';
import { mockForumPosts } from '@/data/mockCommunityData';

const ForumSection = () => {
  const [posts, setPosts] = useState<ForumPost[]>(mockForumPosts);
  const [selectedCategory, setSelectedCategory] = useState<ForumCategory | 'all'>('all');
  
  const categories: (ForumCategory | 'all')[] = [
    'all', 'Général', 'Tech & Dev IA', 'Prompt Engineering', 
    'No-code & IA', 'Startups IA', 'Trouver un projet / recruter', 
    'Formations & conseils'
  ];
  
  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);
    
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher dans le forum..."
            className="pl-10"
          />
        </div>
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Nouveau sujet
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <Badge 
            key={category} 
            variant={selectedCategory === category ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedCategory(category)}
          >
            {category === 'all' ? 'Tous' : category}
          </Badge>
        ))}
      </div>
      
      <div className="space-y-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <Card key={post.id} className="glass-card hover-scale transition-transform duration-300 overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <h3 className="text-xl font-semibold flex gap-2 items-center">
                      {post.title}
                      {post.isPinned && (
                        <Badge variant="secondary" className="text-xs">Épinglé</Badge>
                      )}
                    </h3>
                    <Badge className="mt-1 w-fit">{post.category}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-white/80 line-clamp-2">{post.content}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-2 flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={post.authorAvatar} alt={post.authorName} />
                    <AvatarFallback>{getInitials(post.authorName)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{post.authorName}</span>
                  <span className="text-xs text-white/60 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDate(post.createdAt)}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-xs text-white/60 flex items-center">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    {post.replies.length}
                  </span>
                  <span className="text-xs text-white/60 flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    {post.views}
                  </span>
                  <span className="text-xs text-white/60 flex items-center">
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    {post.likes}
                  </span>
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-white/60">Aucun sujet trouvé pour cette catégorie.</p>
            <Button variant="outline" className="mt-4">
              Créer un nouveau sujet
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForumSection;
