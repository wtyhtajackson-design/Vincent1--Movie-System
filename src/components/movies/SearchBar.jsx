import React from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const genres = ["全部", "动作", "喜剧", "剧情", "科幻", "恐怖", "爱情", "动画", "悬疑", "纪录片", "战争", "历史", "奇幻"];

export default function SearchBar({ search, setSearch, genre, setGenre, sortBy, setSortBy }) {
  const hasFilters = search || genre !== "全部" || sortBy !== "newest";

  return (
    <div className="space-y-3">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="搜索电影名称、导演..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-11 bg-secondary/50 border-border/50 focus:border-primary/50 font-mono text-sm"
        />
        {search && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={() => setSearch("")}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="font-mono">FILTER</span>
        </div>

        <Select value={genre} onValueChange={setGenre}>
          <SelectTrigger className="w-28 h-8 text-xs bg-secondary/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {genres.map((g) => (
              <SelectItem key={g} value={g}>{g}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-28 h-8 text-xs bg-secondary/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">最新</SelectItem>
            <SelectItem value="rating">评分最高</SelectItem>
            <SelectItem value="name">按名称</SelectItem>
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => { setSearch(""); setGenre("全部"); setSortBy("newest"); }}
          >
            <X className="w-3 h-3 mr-1" />
            清除
          </Button>
        )}
      </div>
    </div>
  );
}