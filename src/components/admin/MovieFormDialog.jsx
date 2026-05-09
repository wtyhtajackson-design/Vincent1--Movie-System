import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const genres = ["动作", "喜剧", "剧情", "科幻", "恐怖", "爱情", "动画", "悬疑", "纪录片", "战争", "历史", "奇幻"];

export default function MovieFormDialog({ open, onOpenChange, movie, onSubmit, isPending }) {
  const [form, setForm] = useState(
    movie || {
      title: "", original_title: "", director: "", actors: "",
      genre: "剧情", release_date: "", duration: "", country: "",
      language: "", synopsis: "", poster_url: "", status: "published"
    }
  );

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      duration: form.duration ? Number(form.duration) : undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle>{movie ? "编辑电影" : "添加电影"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>电影名称 *</Label>
              <Input value={form.title} onChange={(e) => handleChange("title", e.target.value)} required className="bg-secondary/50" />
            </div>
            <div className="space-y-1.5">
              <Label>原始名称</Label>
              <Input value={form.original_title} onChange={(e) => handleChange("original_title", e.target.value)} className="bg-secondary/50" />
            </div>
            <div className="space-y-1.5">
              <Label>导演</Label>
              <Input value={form.director} onChange={(e) => handleChange("director", e.target.value)} className="bg-secondary/50" />
            </div>
            <div className="space-y-1.5">
              <Label>类型 *</Label>
              <Select value={form.genre} onValueChange={(v) => handleChange("genre", v)}>
                <SelectTrigger className="bg-secondary/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {genres.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>上映日期</Label>
              <Input type="date" value={form.release_date} onChange={(e) => handleChange("release_date", e.target.value)} className="bg-secondary/50" />
            </div>
            <div className="space-y-1.5">
              <Label>时长（分钟）</Label>
              <Input type="number" value={form.duration} onChange={(e) => handleChange("duration", e.target.value)} className="bg-secondary/50" />
            </div>
            <div className="space-y-1.5">
              <Label>制片国家</Label>
              <Input value={form.country} onChange={(e) => handleChange("country", e.target.value)} className="bg-secondary/50" />
            </div>
            <div className="space-y-1.5">
              <Label>语言</Label>
              <Input value={form.language} onChange={(e) => handleChange("language", e.target.value)} className="bg-secondary/50" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>主演（逗号分隔）</Label>
            <Input value={form.actors} onChange={(e) => handleChange("actors", e.target.value)} className="bg-secondary/50" />
          </div>
          <div className="space-y-1.5">
            <Label>海报URL</Label>
            <Input value={form.poster_url} onChange={(e) => handleChange("poster_url", e.target.value)} placeholder="https://..." className="bg-secondary/50" />
          </div>
          <div className="space-y-1.5">
            <Label>剧情简介</Label>
            <Textarea value={form.synopsis} onChange={(e) => handleChange("synopsis", e.target.value)} className="bg-secondary/50 min-h-[80px]" />
          </div>
          <div className="space-y-1.5">
            <Label>状态</Label>
            <Select value={form.status} onValueChange={(v) => handleChange("status", v)}>
              <SelectTrigger className="bg-secondary/50 w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="published">已发布</SelectItem>
                <SelectItem value="draft">草稿</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
            <Button type="submit" disabled={isPending}>{movie ? "保存修改" : "添加电影"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}