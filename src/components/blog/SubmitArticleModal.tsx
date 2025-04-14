
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useArticleSubmission } from '@/hooks/useArticleSubmission';
import ArticleSubmissionForm from './ArticleSubmissionForm';

interface SubmitArticleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SubmitArticleModal: React.FC<SubmitArticleModalProps> = ({ open, onOpenChange }) => {
  const {
    isSubmitting,
    title,
    setTitle,
    excerpt,
    setExcerpt,
    content,
    setContent,
    category,
    setCategory,
    tags,
    setTags,
    imagePreview,
    handleImageChange,
    handleRemoveImage,
    handleSubmit,
    resetForm
  } = useArticleSubmission(() => onOpenChange(false));
  
  const handleOpenChange = (newOpen: boolean) => {
    // If the modal is closing and we're not in the middle of submitting, reset the form
    if (!newOpen && !isSubmitting) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[700px] bg-black border-gray-700 rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">Proposer un article</DialogTitle>
          <DialogDescription className="text-white/70">
            Partagez votre expertise avec la communauté. Les articles sont soumis à modération avant publication.
          </DialogDescription>
        </DialogHeader>
        
        <ArticleSubmissionForm
          isSubmitting={isSubmitting}
          title={title}
          setTitle={setTitle}
          excerpt={excerpt}
          setExcerpt={setExcerpt}
          content={content}
          setContent={setContent}
          category={category}
          setCategory={setCategory}
          tags={tags}
          setTags={setTags}
          imagePreview={imagePreview}
          handleImageChange={handleImageChange}
          handleRemoveImage={handleRemoveImage}
          handleSubmit={handleSubmit}
          onCancel={() => handleOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default SubmitArticleModal;
