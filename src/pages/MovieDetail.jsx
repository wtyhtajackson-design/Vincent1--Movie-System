import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Star, Clock, Globe, Calendar, Users, Heart, HeartOff,
  ArrowLeft, Film, MessageSquare, Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import StarRating from "@/components/movies/StarRating";
import ReviewItem from "@/components/movies/ReviewItem";
import { motion } from "framer-motion";

export default function MovieDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const movieId = window.location.pathname.split("/movie/")[1];
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");

  const { data: movie, isLoading: movieLoading } = useQuery({
    queryKey: ["movie", movieId],
    queryFn: async () => {
      const movies = await base44.entities.Movie.filter({ id: movieId });
      return movies[0];
    },
    enabled: !!movieId,
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews", movieId],
    queryFn: () => base44.entities.Review.filter({ movie_id: movieId }, "-created_date"),
    enabled: !!movieId,
  });

  const { data: favorites = [] } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => base44.entities.Favorite.list(),
  });

  const isFavorited = favorites.some((f) => f.movie_id === movieId);

  const toggleFavMutation = useMutation({
    mutationFn: async () => {
      if (isFavorited) {
        const fav = favorites.find((f) => f.movie_id === movieId);
        await base44.entities.Favorite.delete(fav.id);
      } else {
        await base44.entities.Favorite.create({
          movie_id: movieId,
          movie_title: movie.title,
          movie_poster: movie.poster_url,
          movie_genre: movie.genre,
          movie_rating: movie.rating,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      toast({ title: isFavorited ? "已取消收藏" : "已收藏" });
    },
  });

  const reviewMutation = useMutation({
    mutationFn: async () => {
      const user = await base44.auth.me();
      await base44.entities.Review.create({
        movie_id: movieId,
        movie_title: movie.title,
        rating: newRating,
        content: newComment,
        user_name: user.full_name || user.email,
      });
      // Update movie average rating
      const allReviews = [...reviews, { rating: newRating }];
      const avgRating = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
      await base44.entities.Movie.update(movieId, {
        rating: Math.round(avgRating * 10) / 10,
        rating_count: allReviews.length,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", movieId] });
      queryClient.invalidateQueries({ queryKey: ["movie", movieId] });
      setNewRating(0);
      setNewComment("");
      toast({ title: "评论提交成功" });
    },
  });

  if (movieLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid md:grid-cols-3 gap-6">
          <Skeleton className="aspect-[2/3] rounded-xl" />
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="text-center py-20">
        <Film className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-muted-foreground">电影不存在</p>
        <Link to="/">
          <Button variant="outline" className="mt-4">返回首页</Button>
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Back button */}
      <Link to="/">
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-2">
          <ArrowLeft className="w-4 h-4" />
          返回列表
        </Button>
      </Link>

      {/* Movie Info */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Poster */}
        <div className="relative">
          <div className="aspect-[2/3] rounded-xl overflow-hidden bg-secondary border border-border/50">
            {movie.poster_url ? (
              <img src={movie.poster_url} alt={movie.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Film className="w-16 h-16 text-muted-foreground/20" />
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="md:col-span-2 space-y-5">
          <div>
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl font-bold tracking-tight">{movie.title}</h1>
              <Button
                variant={isFavorited ? "default" : "outline"}
                size="icon"
                onClick={() => toggleFavMutation.mutate()}
                className={isFavorited ? "bg-red-500 hover:bg-red-600 border-red-500" : ""}
              >
                {isFavorited ? <Heart className="w-4 h-4 fill-white" /> : <Heart className="w-4 h-4" />}
              </Button>
            </div>
            {movie.original_title && (
              <p className="text-muted-foreground mt-1">{movie.original_title}</p>
            )}
          </div>

          {/* Rating display */}
          {movie.rating > 0 && (
            <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 border border-border/30">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">{movie.rating?.toFixed(1)}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{movie.rating_count || 0} 人评分</div>
              </div>
              <StarRating rating={Math.round(movie.rating)} readonly size="md" />
            </div>
          )}

          {/* Meta info */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {movie.genre && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary">{movie.genre}</Badge>
              </div>
            )}
            {movie.director && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="w-4 h-4 shrink-0" />
                <span>导演: {movie.director}</span>
              </div>
            )}
            {movie.release_date && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4 shrink-0" />
                <span>{movie.release_date}</span>
              </div>
            )}
            {movie.duration > 0 && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4 shrink-0" />
                <span>{movie.duration} 分钟</span>
              </div>
            )}
            {movie.country && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Globe className="w-4 h-4 shrink-0" />
                <span>{movie.country}</span>
              </div>
            )}
          </div>

          {/* Actors */}
          {movie.actors && (
            <div>
              <h3 className="text-sm font-semibold mb-1">主演</h3>
              <p className="text-sm text-muted-foreground">{movie.actors}</p>
            </div>
          )}

          {/* Synopsis */}
          {movie.synopsis && (
            <div>
              <h3 className="text-sm font-semibold mb-1">剧情简介</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{movie.synopsis}</p>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold">评论 ({reviews.length})</h2>
        </div>

        {/* Submit review */}
        <div className="p-5 rounded-xl bg-card border border-border/50 space-y-4">
          <h3 className="text-sm font-semibold">写评论</h3>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">评分:</span>
            <StarRating rating={newRating} onRate={setNewRating} size="md" />
            {newRating > 0 && <span className="text-sm font-mono font-semibold text-yellow-400">{newRating}/10</span>}
          </div>
          <Textarea
            placeholder="写下你的评论..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="bg-secondary/50 border-border/50 min-h-[80px]"
          />
          <Button
            onClick={() => reviewMutation.mutate()}
            disabled={newRating === 0 || reviewMutation.isPending}
            className="gap-2"
          >
            <Send className="w-4 h-4" />
            提交评论
          </Button>
        </div>

        {/* Reviews list */}
        <div className="space-y-3">
          {reviews.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">暂无评论，来做第一个评论的人吧</p>
          ) : (
            reviews.map((r) => <ReviewItem key={r.id} review={r} />)
          )}
        </div>
      </div>
    </motion.div>
  );
}