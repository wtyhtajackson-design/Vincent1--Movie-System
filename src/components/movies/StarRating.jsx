import React from "react";
import { Star } from "lucide-react";

export default function StarRating({ rating, onRate, size = "md", readonly = false }) {
  const [hover, setHover] = React.useState(0);
  const sizes = { sm: "w-4 h-4", md: "w-5 h-5", lg: "w-7 h-7" };

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onRate?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          className={`${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"} transition-transform`}
        >
          <Star
            className={`${sizes[size]} ${
              star <= (hover || rating)
                ? "text-yellow-400 fill-yellow-400"
                : "text-muted-foreground/30"
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  );
}