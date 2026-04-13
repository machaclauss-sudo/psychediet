import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, Brain, TrendingUp, Users } from "lucide-react";
import { motion } from "motion/react";
import { useAggregateAnalytics } from "../../hooks/useQueries";

export default function AdminAnalyticsPage() {
  const { data: analytics, isLoading } = useAggregateAnalytics();

  const totalUsers = Number(analytics?.totalUsers ?? 0);
  const activeUsers = Number(analytics?.activeUsers ?? 0);
  const activePct =
    totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-display font-bold">Analytics</h2>
        <p className="text-sm text-muted-foreground">
          Platform-wide nutrient and mood trends
        </p>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total Users",
            value: isLoading ? null : totalUsers,
            icon: Users,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
          },
          {
            label: "Active Users",
            value: isLoading ? null : activeUsers,
            icon: Activity,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: "Avg Mood Score",
            value: isLoading
              ? null
              : (analytics?.averageMoodScore?.toFixed(1) ?? "—"),
            icon: Brain,
            color: "text-violet-600",
            bg: "bg-violet-50",
          },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="shadow-card">
              <CardContent className="pt-5">
                <div
                  className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}
                >
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                {isLoading ? (
                  <Skeleton
                    className="h-8 w-20"
                    data-ocid="admin.loading_state"
                  />
                ) : (
                  <p className="text-3xl font-display font-bold">
                    {stat.value}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Active rate */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            User Engagement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Active users</span>
              <span className="font-semibold">{activePct}%</span>
            </div>
            <Progress value={activePct} className="h-3" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Platform health</span>
              <span className="font-semibold">Good</span>
            </div>
            <Progress value={75} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Nutrient Trends */}
      {analytics?.nutrientTrends && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Nutrient Trend Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
              {analytics.nutrientTrends}
            </p>
          </CardContent>
        </Card>
      )}

      {!analytics?.nutrientTrends && !isLoading && (
        <Card className="shadow-card">
          <CardContent
            className="py-8 text-center"
            data-ocid="admin.empty_state"
          >
            <TrendingUp className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-muted-foreground text-sm">
              Nutrient trends will appear as users log more food entries.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
