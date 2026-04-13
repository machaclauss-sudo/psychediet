import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useLogMood } from "../hooks/useQueries";

const MOOD_EMOJIS = [
  { emoji: "😢", label: "Terrible", range: [1, 2] as [number, number] },
  { emoji: "😟", label: "Bad", range: [3, 4] as [number, number] },
  { emoji: "😐", label: "Okay", range: [5, 6] as [number, number] },
  { emoji: "🙂", label: "Good", range: [7, 8] as [number, number] },
  { emoji: "😄", label: "Great", range: [9, 10] as [number, number] },
];

const MOOD_TAGS = [
  "Good Sleep",
  "Exercise",
  "Healthy Meal",
  "Stress",
  "Sugar",
  "Caffeine",
  "Social",
  "Alone",
];

export default function LogMoodPage() {
  const navigate = useNavigate();
  const { mutateAsync: logMood, isPending } = useLogMood();

  const [score, setScore] = useState(5);
  const [tags, setTags] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const activeEmoji =
    MOOD_EMOJIS.find((m) => score >= m.range[0] && score <= m.range[1]) ??
    MOOD_EMOJIS[2];

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleSubmit = async () => {
    try {
      await logMood({
        id: crypto.randomUUID(),
        time: BigInt(Date.now()),
        score,
        moodTags: tags,
        notes,
      });
      toast.success("Mood logged! 😊");
      navigate({ to: "/dashboard" });
    } catch {
      toast.error("Failed to log mood. Please try again.");
    }
  };

  return (
    <div className="px-4 py-5">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-5">
          <h1 className="text-2xl font-display font-bold">Log Your Mood</h1>
          <p className="text-sm text-muted-foreground">
            How are you feeling right now?
          </p>
        </div>

        <div className="space-y-4">
          {/* Emoji Scale */}
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <motion.div
                  key={score}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.15 }}
                  className="text-6xl mb-1"
                >
                  {activeEmoji.emoji}
                </motion.div>
                <p className="font-semibold text-lg">{activeEmoji.label}</p>
                <p className="text-sm text-muted-foreground">
                  Score: {score}/10
                </p>
              </div>

              {/* Emoji row */}
              <div className="flex justify-between mb-4">
                {MOOD_EMOJIS.map((m) => (
                  <button
                    key={m.label}
                    type="button"
                    onClick={() => setScore(m.range[0] + 1)}
                    className={`text-2xl transition-transform ${
                      activeEmoji.label === m.label
                        ? "scale-125"
                        : "opacity-50 hover:opacity-75"
                    }`}
                    title={m.label}
                  >
                    {m.emoji}
                  </button>
                ))}
              </div>

              <Slider
                min={1}
                max={10}
                step={1}
                value={[score]}
                onValueChange={(val) => setScore(val[0])}
                className="mt-2"
                data-ocid="mood.input"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1</span>
                <span>10</span>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                What influenced your mood?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {MOOD_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      tags.includes(tag)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border hover:border-primary/50"
                    }`}
                    data-ocid="mood.toggle"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Notes (optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="What's on your mind?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="resize-none"
                rows={3}
                data-ocid="mood.textarea"
              />
            </CardContent>
          </Card>

          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="w-full"
            data-ocid="mood.submit_button"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isPending ? "Saving..." : "Save Mood Entry"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
