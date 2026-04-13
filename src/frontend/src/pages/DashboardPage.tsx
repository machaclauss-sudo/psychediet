import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { Brain, Smile, TrendingUp, Utensils } from "lucide-react";
import { motion } from "motion/react";
import {
  useCurrentUserProfile,
  useFoodEntries,
  useMoodEntries,
  usePersonalizedInsights,
} from "../hooks/useQueries";

const MOOD_EMOJIS = ["😢", "😟", "😐", "🙂", "😄"];

function getMoodEmoji(score: number) {
  const idx = Math.min(4, Math.max(0, Math.floor((score - 1) / 2)));
  return MOOD_EMOJIS[idx];
}

export default function DashboardPage() {
  const { data: profile, isLoading: profileLoading } = useCurrentUserProfile();
  const { data: moodEntries, isLoading: moodLoading } = useMoodEntries();
  const { data: foodEntries, isLoading: foodLoading } = useFoodEntries();
  const { data: insights, isLoading: insightsLoading } =
    usePersonalizedInsights();

  const recentMoods = moodEntries?.slice(0, 7) ?? [];
  const avgMood =
    recentMoods.length > 0
      ? recentMoods.reduce((sum, e) => sum + e.score, 0) / recentMoods.length
      : 0;

  const latestFood = foodEntries?.[0];

  return (
    <div className="px-4 py-5 space-y-4">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {profileLoading ? (
          <Skeleton className="h-8 w-48" />
        ) : (
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Good morning 👋
            </h1>
            <p className="text-sm text-muted-foreground">
              {profile?.goals
                ? `Goal: ${profile.goals}`
                : "Track your wellness journey"}
            </p>
          </div>
        )}
      </motion.div>

      {/* Mood Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <Card className="shadow-card" data-ocid="dashboard.card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              7-Day Mood Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            {moodLoading ? (
              <Skeleton
                className="h-12 w-full"
                data-ocid="dashboard.loading_state"
              />
            ) : recentMoods.length === 0 ? (
              <div
                className="text-center py-2"
                data-ocid="dashboard.empty_state"
              >
                <p className="text-muted-foreground text-sm">
                  No mood data yet. Log your first mood!
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-display font-bold">
                    {getMoodEmoji(avgMood)} {avgMood.toFixed(1)}
                  </span>
                  <span className="text-sm text-muted-foreground">/ 10</span>
                </div>
                <Progress value={avgMood * 10} className="h-2" />
                <div className="flex gap-1 mt-2">
                  {recentMoods.map((m, i) => (
                    <div
                      key={m.id}
                      className="flex-1 rounded-full text-center text-xs"
                      title={`Score: ${m.score}`}
                      data-ocid={`dashboard.item.${i + 1}`}
                    >
                      <div
                        className="h-1.5 rounded-full bg-primary/40"
                        style={{ opacity: 0.3 + (m.score / 10) * 0.7 }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Today's Meal */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="shadow-card" data-ocid="dashboard.card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Last Food Entry
            </CardTitle>
          </CardHeader>
          <CardContent>
            {foodLoading ? (
              <Skeleton
                className="h-12 w-full"
                data-ocid="dashboard.loading_state"
              />
            ) : !latestFood ? (
              <div
                className="text-center py-2"
                data-ocid="dashboard.empty_state"
              >
                <p className="text-muted-foreground text-sm">
                  No meals logged yet.
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{latestFood.foodName}</p>
                  <p className="text-xs text-muted-foreground">
                    {latestFood.calories} kcal · Ω3: {latestFood.omega3}mg · Mg:{" "}
                    {latestFood.magnesium}mg
                  </p>
                </div>
                <Utensils className="h-8 w-8 text-primary/40" />
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
      >
        <div className="grid grid-cols-2 gap-3">
          <Link to="/log-food">
            <Button
              variant="default"
              className="w-full h-14 flex-col gap-1 text-sm"
              data-ocid="dashboard.primary_button"
            >
              <Utensils className="h-5 w-5" />
              Log Meal
            </Button>
          </Link>
          <Link to="/log-mood">
            <Button
              variant="outline"
              className="w-full h-14 flex-col gap-1 text-sm border-primary/20 hover:bg-primary/5"
              data-ocid="dashboard.secondary_button"
            >
              <Smile className="h-5 w-5 text-primary" />
              Log Mood
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* AI Insight Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card
          className="shadow-card border-accent/30 bg-accent/20"
          data-ocid="dashboard.card"
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Brain className="h-4 w-4 text-accent-foreground" />
              AI Insight
            </CardTitle>
          </CardHeader>
          <CardContent>
            {insightsLoading ? (
              <Skeleton
                className="h-16 w-full"
                data-ocid="dashboard.loading_state"
              />
            ) : !insights ? (
              <p
                className="text-sm text-muted-foreground"
                data-ocid="dashboard.empty_state"
              >
                Start logging meals and moods to get personalized insights.
              </p>
            ) : (
              <p className="text-sm text-foreground leading-relaxed">
                {insights.recommendations ||
                  "Keep logging to generate insights!"}
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Nav to Insights */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.25 }}
      >
        <Link to="/insights">
          <Card className="shadow-card hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-semibold text-sm">View Full Insights</p>
                  <p className="text-xs text-muted-foreground">
                    Charts & analysis
                  </p>
                </div>
              </div>
              <span className="text-muted-foreground">→</span>
            </CardContent>
          </Card>
        </Link>
      </motion.div>

      {/* Footer */}
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
