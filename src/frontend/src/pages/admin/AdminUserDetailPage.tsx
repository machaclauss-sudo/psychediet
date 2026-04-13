import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { ChevronLeft, User } from "lucide-react";
import { motion } from "motion/react";
import { useActor } from "../../hooks/useActor";

export default function AdminUserDetailPage() {
  const params = useParams({ strict: false });
  const userId = (params as any).userId as string;
  const { actor, isFetching } = useActor();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: async () => {
      if (!actor || !userId) return null;
      return actor.getUserProfile(userId);
    },
    enabled: !!actor && !isFetching && !!userId,
  });

  const isLoading = profileLoading;

  return (
    <div className="p-8 max-w-3xl">
      <Link
        to="/admin/users"
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Users
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-display font-bold mb-1">User Detail</h1>
        <p className="text-sm text-muted-foreground mb-6 font-mono">{userId}</p>
      </motion.div>

      {isLoading ? (
        <div className="space-y-4" data-ocid="admin.loading_state">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : !profile ? (
        <div className="text-center py-12" data-ocid="admin.empty_state">
          <p className="text-muted-foreground">User not found</p>
        </div>
      ) : (
        <div className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Age</p>
                  <p className="font-semibold">{String(profile.age)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Gender</p>
                  <p className="font-semibold capitalize">
                    {profile.gender || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Diet Type</p>
                  <p className="font-semibold capitalize">
                    {profile.dietType || "—"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Goals</p>
                <p className="text-sm">{profile.goals || "No goals set"}</p>
              </div>
              {profile.healthConditions.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Health Conditions
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {profile.healthConditions.map((c) => (
                      <Badge key={c} variant="secondary" className="text-xs">
                        {c}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
