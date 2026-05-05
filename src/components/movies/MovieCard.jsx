import React from "react";
import { Link } from "react-router-dom";
import { Star, Clock, User, Film } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const genreColors = {
  "动作": "bg-red-500/10 text-red-400 border-red-500/20",
  "喜剧": "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  "剧情": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "科幻": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  "恐怖": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "爱情": "bg-pink-500/10 text-pink-400 border-pink-500/20",
  "动画": "bg-green-500/10 text-green-400 border-green-500/20",
  "悬疑": "bg-orange-500/10 text-orange-400 border-orange-500/20",
  "纪录片": "bg-teal-500/10 text-teal-400 border-teal-500/20",
  "战争": "bg-gray-500/10 text-gray-400 border-gray-500/20",
  "历史": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "奇幻": "bg-violet-500/10 text-violet-400 border-violet-500/20",
};

export default function MovieCard({ movie, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link to={`/movie/${movie.id}`}>
        <div className="group relative bg-card rounded-xl border border-border/50 overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
          {/* Poster */}
          <div className="aspect-[2/3] relative overflow-hidden bg-secondary">
            {movie.poster_url ? (
              <img
                src={movie.poster_url}
                alt={movie.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Film className="w-12 h-12 text-muted-foreground/30" />
              </div>
            )}
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Rating badge */}
            {movie.rating > 0 && (
              <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-semibold text-white">{movie.rating?.toFixed(1)}</span>
              </div>
            )}

            {/* Genre badge */}
            <div className="absolute top-2 left-2">
              <Badge variant="outline" className={`text-xs ${genreColors[movie.genre] || "bg-secondary text-muted-foreground"}`}>
                {movie.genre}
              </Badge>
            </div>
          </div>

          {/* Info */}
          <div className="p-3.5">
            <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {movie.title}
            </h3>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
              {movie.director && (
                <span className="flex items-center gap-1 truncate">
                  <User className="w-3 h-3 shrink-0" />
                  {movie.director}
                </span>
              )}
              {movie.duration > 0 && (
                <span className="flex items-center gap-1 shrink-0">
                  <Clock className="w-3 h-3" />
                  {movie.duration}分钟
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}