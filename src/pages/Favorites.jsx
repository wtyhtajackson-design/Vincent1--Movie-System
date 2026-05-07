import React from "react";
import { mockAPI } from "@/data/mockData";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Heart, Trash2, Star, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

export default function Favorites() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => mockAPI.Favorite.list("-created_date"),
  });

  const removeMutation = useMutation({
    mutationFn: (id) => mockAPI.Favorite.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      toast({ title: "已取消收藏" });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <Heart className="w-5 h-5 text-red-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">我的收藏</h1>
          <p className="text-sm text-muted-foreground">{favorites.length} 部电影</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-3">
          {Array(3).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-muted-foreground">还没有收藏的电影</p>
          <Link to="/">
            <Button variant="outline" className="mt-4">去浏览电影</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-3">
          <AnimatePresence>
            {favorites.map((fav, i) => (
              <motion.div
                key={fav.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 hover:border-primary/20 transition-colors group">
                  <Link to={`/movie/${fav.movie_id}`} className="shrink-0">
                    <div className="w-16 h-24 rounded-lg overflow-hidden bg-secondary">
                      {fav.movie_poster ? (
                        <img src={fav.movie_poster} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Film className="w-6 h-6 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/movie/${fav.movie_id}`}>
                      <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                        {fav.movie_title}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      {fav.movie_genre && (
                        <Badge variant="outline" className="text-xs">{fav.movie_genre}</Badge>
                      )}
                      {fav.movie_rating > 0 && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          {fav.movie_rating?.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-red-400"
                    onClick={() => removeMutation.mutate(fav.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}