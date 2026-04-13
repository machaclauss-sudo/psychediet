import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Utensils } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useLogFood } from "../hooks/useQueries";

export default function LogFoodPage() {
  const navigate = useNavigate();
  const { mutateAsync: logFood, isPending } = useLogFood();

  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");
  const [magnesium, setMagnesium] = useState("");
  const [omega3, setOmega3] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName.trim()) {
      toast.error("Please enter a food name");
      return;
    }
    try {
      await logFood({
        id: crypto.randomUUID(),
        time: BigInt(Date.now()),
        foodName: foodName.trim(),
        calories: Number(calories) || 0,
        magnesium: Number(magnesium) || 0,
        omega3: Number(omega3) || 0,
      });
      toast.success("Meal logged successfully! 🍽️");
      navigate({ to: "/dashboard" });
    } catch {
      toast.error("Failed to log meal. Please try again.");
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
          <h1 className="text-2xl font-display font-bold">Log a Meal</h1>
          <p className="text-sm text-muted-foreground">
            Track what you eat to understand its impact on your mood
          </p>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Utensils className="h-4 w-4 text-primary" />
              Meal Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="foodName">Food Name *</Label>
                <Input
                  id="foodName"
                  placeholder="e.g. Grilled salmon with spinach"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  className="mt-1"
                  data-ocid="food.input"
                />
              </div>

              <div>
                <Label htmlFor="calories">Calories (kcal)</Label>
                <Input
                  id="calories"
                  type="number"
                  placeholder="e.g. 350"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  className="mt-1"
                  min="0"
                  data-ocid="food.input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="magnesium">Magnesium (mg)</Label>
                  <Input
                    id="magnesium"
                    type="number"
                    placeholder="e.g. 45"
                    value={magnesium}
                    onChange={(e) => setMagnesium(e.target.value)}
                    className="mt-1"
                    min="0"
                    data-ocid="food.input"
                  />
                </div>
                <div>
                  <Label htmlFor="omega3">Omega-3 (mg)</Label>
                  <Input
                    id="omega3"
                    type="number"
                    placeholder="e.g. 1200"
                    value={omega3}
                    onChange={(e) => setOmega3(e.target.value)}
                    className="mt-1"
                    min="0"
                    data-ocid="food.input"
                  />
                </div>
              </div>

              {/* Quick fill presets */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Quick fill:
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: "Salmon", cal: 280, mg: 35, o3: 2200 },
                    { name: "Spinach Salad", cal: 120, mg: 87, o3: 150 },
                    { name: "Walnuts", cal: 185, mg: 44, o3: 2570 },
                  ].map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setFoodName(preset.name);
                        setCalories(String(preset.cal));
                        setMagnesium(String(preset.mg));
                        setOmega3(String(preset.o3));
                      }}
                      className="px-2.5 py-1 rounded-full text-xs border border-border bg-muted hover:bg-muted/80 transition-colors"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full"
                data-ocid="food.submit_button"
              >
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {isPending ? "Saving..." : "Log Meal"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
