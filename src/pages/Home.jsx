import React, { useState, useMemo, useEffect } from "react";
import { getMovies } from "@/api/movieApi";
import { useQuery } from "@tanstack/react-query";
import { Film, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import MovieCard from "@/components/movies/MovieCard";
import SearchBar from "@/components/movies/SearchBar";
import { motion } from "framer-motion";

export default function Home() {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("全部");
  const [sortBy, setSortBy] = useState("newest");
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getMovies();
        console.log(data);
        setMovies(data);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const filtered = useMemo(() => {
    let result = [...movies];

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (m) =>
          m.title?.toLowerCase().includes(s) ||
          m.director?.toLowerCase().includes(s) ||
          m.actors?.toLowerCase().includes(s)
      );
    }

    if (genre !== "全部") {
      result = result.filter((m) => m.genre === genre);
    }

    if (sortBy === "rating") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "name") {
      result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    } else {
      result.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    }

    return result;
  }, [movies, search, genre, sortBy]);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-card to-accent/5 border border-border/50 p-6 sm:p-10"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Film className="w-5 h-5 text-primary" />
            <span className="text-xs font-mono text-primary tracking-widest uppercase">Movie Database</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            电影信息管理系统
          </h1>
          <p className="text-muted-foreground max-w-lg">
            基于 JavaScript + Python + MySQL 的全栈电影数据库，支持搜索、评分、收藏与可视化分析
          </p>
          <div className="flex items-center gap-4 mt-4 text-xs font-mono text-muted-foreground">
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
              共 {movies.length} 部电影
            </span>
          </div>
        </div>
      </motion.div>

      {/* Search */}
      <SearchBar
        search={search}
        setSearch={setSearch}
        genre={genre}
        setGenre={setGenre}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* Movie Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array(10).fill(0).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[2/3] rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Film className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">暂无匹配的电影</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((movie, i) => (
            <MovieCard key={movie.id} movie={movie} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}