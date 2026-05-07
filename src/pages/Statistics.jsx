import React, { useMemo } from "react";
import { mockAPI } from "@/data/mockData";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, Film, Star, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, AreaChart, Area
} from "recharts";
import { motion } from "framer-motion";

const COLORS = ["#0ea5e9", "#8b5cf6", "#22c55e", "#f59e0b", "#ef4444", "#ec4899", "#14b8a6", "#f97316", "#6366f1", "#84cc16", "#a855f7", "#06b6d4"];

export default function Statistics() {
  const { data: movies = [], isLoading } = useQuery({
    queryKey: ["movies"],
    queryFn: () => mockAPI.Movie.list(),
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ["all-reviews"],
    queryFn: () => mockAPI.Review.list(),
  });

  const stats = useMemo(() => {
    if (!movies.length) return null;

    // Genre distribution
    const genreCounts = {};
    movies.forEach((m) => {
      genreCounts[m.genre] = (genreCounts[m.genre] || 0) + 1;
    });
    const genreData = Object.entries(genreCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Rating distribution
    const ratingBuckets = { "0-2": 0, "2-4": 0, "4-6": 0, "6-8": 0, "8-10": 0 };
    movies.forEach((m) => {
      const r = m.rating || 0;
      if (r <= 2) ratingBuckets["0-2"]++;
      else if (r <= 4) ratingBuckets["2-4"]++;
      else if (r <= 6) ratingBuckets["4-6"]++;
      else if (r <= 8) ratingBuckets["6-8"]++;
      else ratingBuckets["8-10"]++;
    });
    const ratingData = Object.entries(ratingBuckets).map(([range, count]) => ({
      range,
      count,
    }));

    // Year distribution
    const yearCounts = {};
    movies.forEach((m) => {
      if (m.release_date) {
        const year = m.release_date.substring(0, 4);
        yearCounts[year] = (yearCounts[year] || 0) + 1;
      }
    });
    const yearData = Object.entries(yearCounts)
      .map(([year, count]) => ({ year, count }))
      .sort((a, b) => a.year.localeCompare(b.year));

    // Genre radar (avg rating per genre)
    const genreRatings = {};
    movies.forEach((m) => {
      if (m.rating > 0) {
        if (!genreRatings[m.genre]) genreRatings[m.genre] = { total: 0, count: 0 };
        genreRatings[m.genre].total += m.rating;
        genreRatings[m.genre].count++;
      }
    });
    const radarData = Object.entries(genreRatings).map(([genre, d]) => ({
      genre,
      rating: Math.round((d.total / d.count) * 10) / 10,
    }));

    const avgRating = movies.filter(m => m.rating > 0).reduce((s, m) => s + m.rating, 0) / (movies.filter(m => m.rating > 0).length || 1);
    const avgDuration = movies.filter(m => m.duration > 0).reduce((s, m) => s + m.duration, 0) / (movies.filter(m => m.duration > 0).length || 1);

    return { genreData, ratingData, yearData, radarData, avgRating, avgDuration };
  }, [movies]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid sm:grid-cols-4 gap-4">
          {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-72 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">数据统计</h1>
          <p className="text-sm text-muted-foreground">电影数据可视化分析</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SummaryCard icon={Film} label="电影总数" value={movies.length} color="text-primary" />
        <SummaryCard icon={Star} label="平均评分" value={stats?.avgRating?.toFixed(1) || "0"} color="text-yellow-400" />
        <SummaryCard icon={TrendingUp} label="评论总数" value={reviews.length} color="text-green-400" />
        <SummaryCard icon={Clock} label="平均时长" value={`${Math.round(stats?.avgDuration || 0)}min`} color="text-violet-400" />
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Genre Pie */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-card/80 border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">类型分布</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={stats?.genreData || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {(stats?.genreData || []).map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "hsl(222 40% 9%)", border: "1px solid hsl(215 25% 17%)", borderRadius: "8px", fontSize: "12px" }}
                    itemStyle={{ color: "hsl(210 40% 96%)" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 justify-center mt-2">
                {(stats?.genreData || []).map((g, i) => (
                  <span key={g.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    {g.name} ({g.value})
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Rating Bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-card/80 border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">评分分布</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats?.ratingData || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 25% 17%)" />
                  <XAxis dataKey="range" tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }} />
                  <YAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ background: "hsl(222 40% 9%)", border: "1px solid hsl(215 25% 17%)", borderRadius: "8px", fontSize: "12px" }}
                    itemStyle={{ color: "hsl(210 40% 96%)" }}
                  />
                  <Bar dataKey="count" fill="hsl(199 89% 48%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Year Trend */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-card/80 border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">年份趋势</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={stats?.yearData || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 25% 17%)" />
                  <XAxis dataKey="year" tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }} />
                  <YAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ background: "hsl(222 40% 9%)", border: "1px solid hsl(215 25% 17%)", borderRadius: "8px", fontSize: "12px" }}
                    itemStyle={{ color: "hsl(210 40% 96%)" }}
                  />
                  <Area type="monotone" dataKey="count" stroke="hsl(262 83% 58%)" fill="hsl(262 83% 58% / 0.2)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Genre Rating Radar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="bg-card/80 border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">类型评分雷达</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={stats?.radarData || []}>
                  <PolarGrid stroke="hsl(215 25% 17%)" />
                  <PolarAngleAxis dataKey="genre" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} />
                  <PolarRadiusAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 10 }} />
                  <Radar dataKey="rating" stroke="hsl(199 89% 48%)" fill="hsl(199 89% 48% / 0.2)" />
                  <Tooltip
                    contentStyle={{ background: "hsl(222 40% 9%)", border: "1px solid hsl(215 25% 17%)", borderRadius: "8px", fontSize: "12px" }}
                    itemStyle={{ color: "hsl(210 40% 96%)" }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, color }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
      <Card className="bg-card/80 border-border/50">
        <CardContent className="p-4">
          <Icon className={`w-5 h-5 ${color} mb-2`} />
          <div className="text-2xl font-bold font-mono">{value}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}