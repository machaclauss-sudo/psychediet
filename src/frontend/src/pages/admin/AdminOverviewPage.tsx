import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, Smile, TrendingUp, Users } from "lucide-react";
import { motion } from "motion/react";
import { useAggregateAnalytics } from "../../hooks/useQueries";

export default function AdminOverviewPage() {
  const { data: analytics, isLoading } = useAggregateAnalytics();

  const stats = analytics
    ? [
        {
          label: "Total Users",
          value: String(analytics.totalUsers),
          icon: Users,
          color: "text-blue-600",
          bg: "bg-blue-50",
        },
        {
          label: "Active Users",
          value: String(analytics.activeUsers),
          icon: Activity,
          color: "text-primary",
          bg: "bg-primary/10",
        },
        {
          label: "Avg Mood Score",
          value: analytics.averageMoodScore.toFixed(1),
          icon: Smile,
          color: "text-yellow-600",
          bg: "bg-yellow-50",
        },
        {
          label: "Nutrient Trends",
          value: "Active",
          icon: TrendingUp,
          color: "text-purple-600",
          bg: "bg-purple-50",
        },
      ]
    : [];

  return (
    <div className="p-8 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-display font-bold mb-1">
          Dashboard Overview
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          Platform-wide analytics and metrics
        </p>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4" data-ocid="admin.loading_state">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-2 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {stats.map(({ label, value, icon: Icon, color, bg }, _i) => (
            <Card key={label} className="shadow-card" data-ocid={"admin.card"}>
              <CardContent className="pt-5">
                <div className={`inline-flex p-2 rounded-lg ${bg} mb-3`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <p className="text-2xl font-display font-bold">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      )}

      {analytics?.nutrientTrends && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6"
        >
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-sm">
                Nutrient Trends Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {analytics.nutrientTrends}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
