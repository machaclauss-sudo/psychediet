import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, PenLine } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const TOPICS = ["All", "Anxiety", "Depression", "ADHD", "Stress", "Nutrition"];

const TOPIC_COLORS: Record<string, string> = {
  Anxiety: "bg-violet-100 text-violet-700",
  Depression: "bg-blue-100 text-blue-700",
  ADHD: "bg-amber-100 text-amber-700",
  Stress: "bg-rose-100 text-rose-700",
  Nutrition: "bg-emerald-100 text-emerald-700",
};

const INITIAL_POSTS = [
  {
    id: "1",
    author: "WellnessWanderer",
    topic: "Anxiety",
    time: "2 hours ago",
    content:
      "Switching to a low-sugar diet this month genuinely reduced my anxiety. The first two weeks were rough but now I feel so much more stable. Anyone else experienced this?",
    likes: 24,
    comments: 8,
  },
  {
    id: "2",
    author: "MindfulEater",
    topic: "Depression",
    time: "5 hours ago",
    content:
      "Adding salmon twice a week to my diet for omega-3s. Three weeks in and my mood has noticeably lifted. PsycheDiet showed me the correlation clearly — I was missing this nutrient badly.",
    likes: 41,
    comments: 12,
  },
  {
    id: "3",
    author: "ZenNutritionist",
    topic: "Nutrition",
    time: "Yesterday",
    content:
      "Friendly reminder: magnesium deficiency is extremely common and directly linked to anxiety and sleep problems. Dark chocolate, pumpkin seeds, and spinach are my daily go-to's now.",
    likes: 67,
    comments: 19,
  },
  {
    id: "4",
    author: "FocusFirst",
    topic: "ADHD",
    time: "Yesterday",
    content:
      "Brain-boosting breakfast routine: eggs + walnuts + blueberries. My concentration has been noticeably better since I started tracking this with PsycheDiet. The data doesn't lie.",
    likes: 33,
    comments: 7,
  },
  {
    id: "5",
    author: "CalmSeeker",
    topic: "Stress",
    time: "2 days ago",
    content:
      "Discovered that my afternoon coffee + skipped lunch combo was tanking my cortisol. Switched to a proper lunch with magnesium-rich foods and the afternoon stress crashes are gone.",
    likes: 29,
    comments: 11,
  },
  {
    id: "6",
    author: "GutBrainExplorer",
    topic: "Depression",
    time: "3 days ago",
    content:
      "6 months of probiotic supplementation + fermented foods. My therapist noticed the difference before I even mentioned diet changes. The gut-brain connection is real. Keep going, everyone.",
    likes: 88,
    comments: 26,
  },
];

export default function CommunityPage() {
  const [activeTopic, setActiveTopic] = useState("All");
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [shareText, setShareText] = useState("");
  const [shareOpen, setShareOpen] = useState(false);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  const filtered =
    activeTopic === "All"
      ? posts
      : posts.filter((p) => p.topic === activeTopic);

  function handleShare() {
    if (!shareText.trim()) return;
    const newPost = {
      id: String(Date.now()),
      author: "Anonymous",
      topic: activeTopic === "All" ? "Nutrition" : activeTopic,
      time: "Just now",
      content: shareText.trim(),
      likes: 0,
      comments: 0,
    };
    setPosts((prev) => [newPost, ...prev]);
    setShareText("");
    setShareOpen(false);
  }

  function toggleLike(id: string) {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, likes: likedIds.has(id) ? p.likes - 1 : p.likes + 1 }
          : p,
      ),
    );
  }

  return (
    <div className="px-4 py-5 space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold">Community</h1>
            <p className="text-sm text-muted-foreground">
              Anonymous stories from the PsycheDiet community
            </p>
          </div>
          <Dialog open={shareOpen} onOpenChange={setShareOpen}>
            <DialogTrigger asChild>
              <Button size="sm" data-ocid="community.open_modal_button">
                <PenLine className="h-4 w-4 mr-1" />
                Share Story
              </Button>
            </DialogTrigger>
            <DialogContent data-ocid="community.dialog">
              <DialogHeader>
                <DialogTitle>Share Your Story</DialogTitle>
              </DialogHeader>
              <Textarea
                placeholder="Share your experience with nutrition and mental health..."
                value={shareText}
                onChange={(e) => setShareText(e.target.value)}
                rows={5}
                data-ocid="community.textarea"
              />
              <p className="text-xs text-muted-foreground">
                Posted anonymously. Be kind and supportive.
              </p>
              <DialogFooter>
                <Button
                  variant="ghost"
                  onClick={() => setShareOpen(false)}
                  data-ocid="community.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleShare}
                  disabled={!shareText.trim()}
                  data-ocid="community.submit_button"
                >
                  Post Anonymously
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Topic filter */}
      <Tabs value={activeTopic} onValueChange={setActiveTopic}>
        <TabsList
          className="flex flex-wrap gap-1 h-auto bg-transparent p-0"
          data-ocid="community.tab"
        >
          {TOPICS.map((t) => (
            <TabsTrigger
              key={t}
              value={t}
              className="rounded-full text-xs px-3 py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {t}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Posts */}
      <div className="space-y-3">
        {filtered.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            data-ocid={`community.item.${i + 1}`}
          >
            <Card className="shadow-card">
              <CardHeader className="pb-2 pt-4 px-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
                      {post.author[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{post.author}</p>
                      <p className="text-xs text-muted-foreground">
                        {post.time}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={`text-xs ${TOPIC_COLORS[post.topic] ?? "bg-gray-100 text-gray-700"}`}
                    variant="secondary"
                  >
                    {post.topic}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <p className="text-sm leading-relaxed text-foreground mb-3">
                  {post.content}
                </p>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    className={`flex items-center gap-1 text-xs transition-colors ${
                      likedIds.has(post.id)
                        ? "text-rose-500"
                        : "text-muted-foreground hover:text-rose-400"
                    }`}
                    onClick={() => toggleLike(post.id)}
                    data-ocid={`community.toggle.${i + 1}`}
                  >
                    <Heart
                      className={`h-4 w-4 ${likedIds.has(post.id) ? "fill-rose-500" : ""}`}
                    />
                    {post.likes}
                  </button>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MessageCircle className="h-4 w-4" />
                    {post.comments}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground pt-2">
        © {new Date().getFullYear()}. Built with ♥ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground"
        >
          caffeine.ai
        </a>
      </p>
    </div>
  );
}
