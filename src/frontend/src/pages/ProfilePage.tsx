import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, LogOut, User } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCompleteOnboarding,
  useCurrentUserProfile,
} from "../hooks/useQueries";

export default function ProfilePage() {
  const { data: profile, isLoading } = useCurrentUserProfile();
  const { clear, identity } = useInternetIdentity();
  const { mutateAsync: updateProfile, isPending } = useCompleteOnboarding();

  const [editingGoals, setEditingGoals] = useState(false);
  const [goals, setGoals] = useState("");

  const handleSaveGoals = async () => {
    if (!profile) return;
    try {
      await updateProfile({ ...profile, goals });
      toast.success("Goals updated!");
      setEditingGoals(false);
    } catch {
      toast.error("Failed to update goals");
    }
  };

  if (isLoading) {
    return (
      <div className="px-4 py-5 space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <div className="px-4 py-5 space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-display font-bold">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage your health profile
        </p>
      </motion.div>

      {/* User Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <User className="h-4 w-4" />
              Personal Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">
                  {identity?.getPrincipal().toString().slice(0, 12)}...
                </p>
                <p className="text-xs text-muted-foreground">
                  Internet Identity
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-muted rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Age</p>
                <p className="font-semibold">
                  {profile ? String(profile.age) : "—"}
                </p>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Gender</p>
                <p className="font-semibold capitalize">
                  {profile?.gender || "—"}
                </p>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Diet</p>
                <p className="font-semibold capitalize">
                  {profile?.dietType || "—"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Health Conditions */}
      {profile && profile.healthConditions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Health Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.healthConditions.map((c) => (
                  <Badge key={c} variant="secondary">
                    {c}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Goals */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card className="shadow-card">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Goals</CardTitle>
            {!editingGoals && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setGoals(profile?.goals ?? "");
                  setEditingGoals(true);
                }}
                data-ocid="profile.edit_button"
              >
                Edit
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {editingGoals ? (
              <div className="space-y-2">
                <Input
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  placeholder="Enter your goals"
                  data-ocid="profile.input"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSaveGoals}
                    disabled={isPending}
                    data-ocid="profile.save_button"
                  >
                    {isPending ? (
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                    ) : null}
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingGoals(false)}
                    data-ocid="profile.cancel_button"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {profile?.goals || "No goals set yet."}
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Data Sharing */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="shadow-card">
          <CardContent className="py-4">
            <Button
              variant="destructive"
              className="w-full"
              onClick={clear}
              data-ocid="profile.delete_button"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <p className="text-center text-xs text-muted-foreground">
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
