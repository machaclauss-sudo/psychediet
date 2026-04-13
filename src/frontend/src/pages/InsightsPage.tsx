import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Brain } from "lucide-react";
import { motion } from "motion/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  useFoodEntries,
  useMoodEntries,
  usePersonalizedInsights,
} from "../hooks/useQueries";

export default function InsightsPage() {
  const { data: moodEntries, isLoading: moodLoading } = useMoodEntries();
  const { data: foodEntries, isLoading: foodLoading } = useFoodEntries();
  const { data: insights, isLoading: insightsLoading } =
    usePersonalizedInsights();

  const moodChartData = (moodEntries ?? [])
    .slice(0, 14)
    .reverse()
    .map((entry, i) => ({
      day: `D${i + 1}`,
      mood: entry.score,
    }));

  const caloriesChartData = (foodEntries ?? [])
    .slice(0, 7)
    .reverse()
    .map((entry, i) => ({
      day: `D${i + 1}`,
      calories: entry.calories,
    }));

  const dayAnalysis = insights?.dayAnalysis ?? [];
  const analysisChartData = dayAnalysis.slice(0, 7).map((d, i) => ({
    day: `D${i + 1}`,
    mood: d.moodScore,
    calories: d.calories,
  }));

  const finalMoodData =
    analysisChartData.length > 0 ? analysisChartData : moodChartData;
  const finalCalData =
    analysisChartData.length > 0 ? analysisChartData : caloriesChartData;

  return (
    <div className="px-4 py-5 space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-display font-bold">Your Insights</h1>
        <p className="text-sm text-muted-foreground">
          Patterns between food and mood
        </p>
      </motion.div>

      {/* Mood Trend */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <Card className="shadow-card" data-ocid="insights.card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Mood Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {moodLoading ? (
              <Skeleton
                className="h-40 w-full"
                data-ocid="insights.loading_state"
              />
            ) : finalMoodData.length === 0 ? (
              <div
                className="h-40 flex items-center justify-center"
                data-ocid="insights.empty_state"
              >
                <p className="text-sm text-muted-foreground">
                  Log moods to see trends
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={finalMoodData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.88 0.02 148)"
                  />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="oklch(0.52 0.16 148)"
                    strokeWidth={2}
                    dot={{ fill: "oklch(0.52 0.16 148)", r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Calories Trend */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="shadow-card" data-ocid="insights.card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Calorie Intake</CardTitle>
          </CardHeader>
          <CardContent>
            {foodLoading ? (
              <Skeleton
                className="h-40 w-full"
                data-ocid="insights.loading_state"
              />
            ) : finalCalData.length === 0 ? (
              <div
                className="h-40 flex items-center justify-center"
                data-ocid="insights.empty_state"
              >
                <p className="text-sm text-muted-foreground">
                  Log meals to see trends
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={finalCalData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.88 0.02 148)"
                  />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar
                    dataKey="calories"
                    fill="oklch(0.52 0.18 270)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card
          className="shadow-card border-accent/30 bg-accent/20"
          data-ocid="insights.card"
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            {insightsLoading ? (
              <Skeleton
                className="h-20 w-full"
                data-ocid="insights.loading_state"
              />
            ) : !insights ? (
              <p
                className="text-sm text-muted-foreground"
                data-ocid="insights.empty_state"
              >
                Log data to receive AI analysis.
              </p>
            ) : (
              <p className="text-sm leading-relaxed">
                {insights.recommendations}
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Day Analysis breakdown */}
      {dayAnalysis.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Daily Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {dayAnalysis.slice(0, 5).map((day, i) => (
                <div
                  key={day.recommendation.slice(0, 20) || String(i)}
                  className="p-3 rounded-lg bg-muted"
                  data-ocid={`insights.item.${i + 1}`}
                >
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Day {i + 1}</span>
                    <span>Mood: {day.moodScore}/10</span>
                  </div>
                  <p className="text-sm">{day.recommendation}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
