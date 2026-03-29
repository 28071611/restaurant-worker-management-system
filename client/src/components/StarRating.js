import React, { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating, onRatingChange, readonly = false, size = 'md' }) => {
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedRating, setSelectedRating] = useState(rating || 0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const handleStarClick = (starValue) => {
    if (readonly) return;
    
    setSelectedRating(starValue);
    if (onRatingChange) {
      onRatingChange(starValue);
    }
  };

  const handleMouseEnter = (starValue) => {
    if (readonly) return;
    setHoveredStar(starValue);
  };

  const handleMouseLeave = () => {
    if (readonly) return;
    setHoveredStar(0);
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= (hoveredStar || selectedRating);
        const starColor = isFilled ? 'text-yellow-400 fill-current' : 'text-gray-300';
        
        return (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${starColor} ${
              readonly ? '' : 'cursor-pointer transition-colors duration-200 hover:scale-110'
            }`}
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
          />
        );
      })}
      
      {!readonly && (
        <span className="ml-2 text-sm text-gray-600">
          {selectedRating > 0 && `${selectedRating} / 5`}
        </span>
      )}
      
      {readonly && (
        <span className="ml-2 text-sm font-medium text-gray-700">
          {rating.toFixed(1)} / 5
        </span>
      )}
    </div>
  );
};

export default StarRating;
