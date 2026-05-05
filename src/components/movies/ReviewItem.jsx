import React from "react";
import { Star, User } from "lucide-react";
import { format } from "date-fns";

export default function ReviewItem({ review }) {
  return (
    <div className="p-4 rounded-lg bg-secondary/30 border border-border/30">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="text-sm font-medium">{review.user_name || review.created_by || "匿名用户"}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-mono font-semibold">{review.rating}</span>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            {review.created_date ? format(new Date(review.created_date), "yyyy-MM-dd") : ""}
          </span>
        </div>
      </div>
      {review.content && (
        <p className="text-sm text-muted-foreground leading-relaxed">{review.content}</p>
      )}
    </div>
  );
}