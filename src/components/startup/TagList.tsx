
import React from "react";

interface TagListProps {
  tags: string[];
  limit?: number;
}

const TagList = ({ tags, limit = 3 }: TagListProps) => {
  if (!tags || tags.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-1">
      {tags.slice(0, limit).map((tag, index) => (
        <span
          key={index}
          className="text-xs px-2 py-1 rounded-full bg-startupia-turquoise/10 text-startupia-turquoise"
        >
          {tag}
        </span>
      ))}
      {tags.length > limit && (
        <span className="text-xs px-2 py-1 rounded-full bg-startupia-turquoise/10 text-white/60">
          +{tags.length - limit}
        </span>
      )}
    </div>
  );
};

export default TagList;
