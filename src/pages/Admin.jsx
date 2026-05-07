import React, { useState } from "react";
import { mockAPI } from "@/data/mockData";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Settings, Plus, Pencil, Trash2, Film, Star, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";
import MovieFormDialog from "@/components/admin/MovieFormDialog";
import { motion } from "framer-motion";

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState("");

  const { data: movies = [], isLoading } = useQuery({
    queryKey: ["admin-movies"],
    queryFn: () => mockAPI.Movie.list("-created_date"),
  });

  const createMutation = useMutation({
    mutationFn: (data) => mockAPI.Movie.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-movies"] });
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      setFormOpen(false);
      toast({ title: "电影添加成功" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => mockAPI.Movie.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-movies"] });
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      setFormOpen(false);
      setEditingMovie(null);
      toast({ title: "电影更新成功" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => mockAPI.Movie.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-movies"] });
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      setDeleteId(null);
      toast({ title: "电影已删除" });
    },
  });

  const handleSubmit = (data) => {
    if (editingMovie) {
      updateMutation.mutate({ id: editingMovie.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const filtered = movies.filter((m) =>
    !search || m.title?.toLowerCase().includes(search.toLowerCase()) || m.director?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Settings className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">后台管理</h1>
            <p className="text-sm text-muted-foreground">{movies.length} 部电影</p>
          </div>
        </div>
        <Button className="gap-2" onClick={() => { setEditingMovie(null); setFormOpen(true); }}>
          <Plus className="w-4 h-4" />
          添加电影
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="搜索电影..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-secondary/50"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">
          {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)}
        </div>
      ) : (
        <div className="rounded-xl border border-border/50 overflow-hidden">
          {/* Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 p-3 bg-secondary/30 text-xs font-mono text-muted-foreground uppercase tracking-wider">
            <div className="col-span-4">电影</div>
            <div className="col-span-2">类型</div>
            <div className="col-span-2">导演</div>
            <div className="col-span-1">评分</div>
            <div className="col-span-1">状态</div>
            <div className="col-span-2 text-right">操作</div>
          </div>
          {/* Rows */}
          {filtered.map((movie, i) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 p-3 border-t border-border/30 hover:bg-secondary/20 transition-colors items-center"
            >
              <div className="col-span-4 flex items-center gap-3">
                <div className="w-10 h-14 rounded-md overflow-hidden bg-secondary shrink-0">
                  {movie.poster_url ? (
                    <img src={movie.poster_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Film className="w-4 h-4 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-medium truncate">{movie.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{movie.release_date}</p>
                </div>
              </div>
              <div className="col-span-2">
                <Badge variant="outline" className="text-xs">{movie.genre}</Badge>
              </div>
              <div className="col-span-2 text-sm text-muted-foreground truncate">{movie.director || "-"}</div>
              <div className="col-span-1">
                {movie.rating > 0 ? (
                  <span className="flex items-center gap-1 text-sm">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    {movie.rating?.toFixed(1)}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">-</span>
                )}
              </div>
              <div className="col-span-1">
                <Badge variant={movie.status === "published" ? "default" : "secondary"} className="text-xs">
                  {movie.status === "published" ? "已发布" : "草稿"}
                </Badge>
              </div>
              <div className="col-span-2 flex items-center justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => { setEditingMovie(movie); setFormOpen(true); }}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => setDeleteId(movie.id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">暂无数据</div>
          )}
        </div>
      )}

      {/* Form Dialog */}
      <MovieFormDialog
        open={formOpen}
        onOpenChange={(open) => { setFormOpen(open); if (!open) setEditingMovie(null); }}
        movie={editingMovie}
        onSubmit={handleSubmit}
        isPending={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>此操作无法撤销，确定要删除这部电影吗？</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => deleteMutation.mutate(deleteId)}
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}