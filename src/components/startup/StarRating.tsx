
import React from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  score: number;
  size?: number;
}

const StarRating = ({ score, size = 16 }: StarRatingProps) => {
  return (
    <>
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <Star
            key={i}
            size={size}
            className={`${
              i < score ? "text-startupia-turquoise fill-startupia-turquoise" : "text-gray-600"
            }`}
          />
        ))}
    </>
  );
};

export default StarRating;
