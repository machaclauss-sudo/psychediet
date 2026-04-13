import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Brain, Fish, Leaf, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { usePersonalizedInsights } from "../hooks/useQueries";

type Cuisine =
  | "All"
  | "Vegan"
  | "Gluten-Free"
  | "Mediterranean"
  | "African"
  | "Asian";

const FILTERS: Cuisine[] = [
  "All",
  "Vegan",
  "Gluten-Free",
  "Mediterranean",
  "African",
  "Asian",
];

const RECOMMENDED_FOODS = [
  {
    name: "Wild Salmon",
    reason: "High omega-3 (2.2g/serving)",
    emoji: "🐟",
    nutrients: ["Omega-3", "Vitamin D"],
    cuisines: ["All", "Mediterranean", "Gluten-Free"],
  },
  {
    name: "Walnuts",
    reason: "Plant-based omega-3 & magnesium",
    emoji: "🌰",
    nutrients: ["Omega-3", "Magnesium"],
    cuisines: ["All", "Vegan", "Gluten-Free"],
  },
  {
    name: "Dark Leafy Greens",
    reason: "High magnesium & folate",
    emoji: "🥬",
    nutrients: ["Magnesium", "Folate"],
    cuisines: ["All", "Vegan", "Gluten-Free"],
  },
  {
    name: "Chia Seeds",
    reason: "Omega-3 & fiber for mood",
    emoji: "🌱",
    nutrients: ["Omega-3", "Fiber"],
    cuisines: ["All", "Vegan", "Gluten-Free"],
  },
  {
    name: "Dark Chocolate (70%+)",
    reason: "Magnesium & mood-boosting",
    emoji: "🍫",
    nutrients: ["Magnesium", "Antioxidants"],
    cuisines: ["All", "Vegan", "Gluten-Free"],
  },
  // African
  {
    name: "Egusi Soup",
    reason: "Magnesium-rich, iron & protein powerhouse",
    emoji: "🍲",
    nutrients: ["Magnesium", "Iron", "Protein"],
    cuisines: ["All", "African", "Gluten-Free"],
  },
  {
    name: "Jollof Rice with Vegetables",
    reason: "Fiber-rich with B-vitamins for energy",
    emoji: "🍚",
    nutrients: ["B-Vitamins", "Fiber"],
    cuisines: ["All", "African", "Vegan"],
  },
  {
    name: "Peanut Stew",
    reason: "Protein, healthy fats & vitamin B6",
    emoji: "🥜",
    nutrients: ["Protein", "B6", "Healthy Fats"],
    cuisines: ["All", "African", "Vegan", "Gluten-Free"],
  },
  // Asian
  {
    name: "Miso Soup",
    reason: "Probiotics for the gut-brain axis",
    emoji: "🍜",
    nutrients: ["Probiotics", "Zinc"],
    cuisines: ["All", "Asian", "Vegan"],
  },
  {
    name: "Edamame",
    reason: "Tryptophan & folate for serotonin",
    emoji: "🫘",
    nutrients: ["Tryptophan", "Folate"],
    cuisines: ["All", "Asian", "Vegan", "Gluten-Free"],
  },
  {
    name: "Green Tea Matcha",
    reason: "L-theanine for calm, focused energy",
    emoji: "🍵",
    nutrients: ["L-Theanine", "Antioxidants"],
    cuisines: ["All", "Asian", "Vegan", "Gluten-Free"],
  },
  // Mediterranean
  {
    name: "Greek Yogurt Bowl",
    reason: "Probiotics & protein for gut health",
    emoji: "🥣",
    nutrients: ["Probiotics", "Protein"],
    cuisines: ["All", "Mediterranean", "Gluten-Free"],
  },
  {
    name: "Sardines on Whole Grain",
    reason: "Omega-3 & B12 for brain function",
    emoji: "🐟",
    nutrients: ["Omega-3", "B12"],
    cuisines: ["All", "Mediterranean"],
  },
  {
    name: "Lentil Soup",
    reason: "Folate, iron & fiber for mood stability",
    emoji: "🥘",
    nutrients: ["Folate", "Iron", "Fiber"],
    cuisines: ["All", "Mediterranean", "Vegan", "Gluten-Free"],
  },
];

const AVOID_FOODS = [
  { name: "Refined Sugar", reason: "Spikes & crashes affect mood" },
  { name: "Processed Foods", reason: "Low in mood-supporting nutrients" },
  { name: "Alcohol", reason: "Disrupts sleep and serotonin" },
  { name: "Trans Fats", reason: "Linked to depression risk" },
];

const NUTRIENT_TARGETS = [
  {
    name: "Omega-3",
    target: "1,600–3,000 mg/day",
    icon: Fish,
    color: "text-blue-600",
  },
  {
    name: "Magnesium",
    target: "310–420 mg/day",
    icon: Leaf,
    color: "text-primary",
  },
  {
    name: "Vitamin D",
    target: "600–2,000 IU/day",
    icon: Zap,
    color: "text-yellow-600",
  },
];

const MOOD_ADAPTIVE = {
  low: {
    label: "Calm & Comfort",
    description: "Mood 1–4 · Anxiety or low energy detected",
    color: "border-violet-200 bg-violet-50 dark:bg-violet-950/20",
    badgeClass: "bg-violet-100 text-violet-700",
    icon: "🌙",
    foods: [
      {
        name: "Dark Chocolate",
        benefit: "Magnesium reduces cortisol",
        emoji: "🍫",
      },
      {
        name: "Pumpkin Seeds",
        benefit: "High magnesium, anxiety relief",
        emoji: "🎃",
      },
      {
        name: "Chamomile Tea",
        benefit: "Apigenin binds GABA receptors",
        emoji: "🍵",
      },
      {
        name: "Warm Oatmeal",
        benefit: "Complex carbs stabilize blood sugar",
        emoji: "🥣",
      },
    ],
  },
  moderate: {
    label: "Balance & Sustain",
    description: "Mood 5–7 · Maintaining steady energy",
    color: "border-blue-200 bg-blue-50 dark:bg-blue-950/20",
    badgeClass: "bg-blue-100 text-blue-700",
    icon: "⚖️",
    foods: [
      { name: "Kefir", benefit: "Live probiotics, gut-mood axis", emoji: "🥛" },
      { name: "Tempeh", benefit: "Probiotics + complete protein", emoji: "🧆" },
      {
        name: "Brown Rice",
        benefit: "Steady glucose for even mood",
        emoji: "🍚",
      },
      {
        name: "Sweet Potato",
        benefit: "B6, fiber & antioxidants",
        emoji: "🍠",
      },
    ],
  },
  high: {
    label: "Boost & Focus",
    description: "Mood 8–10 · Great energy, amplify cognition",
    color: "border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20",
    badgeClass: "bg-emerald-100 text-emerald-700",
    icon: "🚀",
    foods: [
      {
        name: "Blueberries",
        benefit: "Antioxidants protect neurons",
        emoji: "🫐",
      },
      { name: "Walnuts", benefit: "DHA for memory & cognition", emoji: "🌰" },
      {
        name: "Green Tea",
        benefit: "L-theanine + caffeine synergy",
        emoji: "🍵",
      },
      {
        name: "Eggs",
        benefit: "Choline for acetylcholine synthesis",
        emoji: "🥚",
      },
    ],
  },
};

export default function RecommendationsPage() {
  const { data: insights, isLoading } = usePersonalizedInsights();
  const [activeFilter, setActiveFilter] = useState<Cuisine>("All");

  const bulletPoints = insights?.recommendations
    ? insights.recommendations.split(/[.!]/).filter((s) => s.trim().length > 10)
    : [];

  // Determine mood tier
  const lastMood = (insights as any)?.lastMoodScore as number | undefined;
  const moodTier =
    lastMood === undefined
      ? null
      : lastMood <= 4
        ? "low"
        : lastMood <= 7
          ? "moderate"
          : "high";

  const filteredFoods = RECOMMENDED_FOODS.filter((f) =>
    (f.cuisines as string[]).includes(activeFilter),
  );

  return (
    <div className="px-4 py-5 space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-display font-bold">Recommendations</h1>
        <p className="text-sm text-muted-foreground">
          Personalized nutrition for mental wellness
        </p>
      </motion.div>

      {/* Dietary Filter Chips */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.03 }}
        className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
      >
        {FILTERS.map((f) => (
          <Button
            key={f}
            variant={activeFilter === f ? "default" : "outline"}
            size="sm"
            className="shrink-0 rounded-full text-xs h-8"
            onClick={() => setActiveFilter(f)}
            data-ocid="recommendations.toggle"
          >
            {f}
          </Button>
        ))}
      </motion.div>

      {/* AI Personalized Section */}
      {isLoading ? (
        <Skeleton
          className="h-32 w-full"
          data-ocid="recommendations.loading_state"
        />
      ) : bulletPoints.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Card
            className="shadow-card border-accent/30 bg-accent/20"
            data-ocid="recommendations.card"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Your Personalized Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {bulletPoints.slice(0, 4).map((point) => (
                  <li key={point.slice(0, 20)} className="flex gap-2 text-sm">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>{point.trim()}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      ) : null}

      {/* Mood-Adaptive Section */}
      {moodTier && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.07 }}
        >
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Mood-Adaptive Suggestions
          </h2>
          <Card
            className={`shadow-card border ${MOOD_ADAPTIVE[moodTier].color}`}
            data-ocid="recommendations.card"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <span className="text-lg">{MOOD_ADAPTIVE[moodTier].icon}</span>
                <div>
                  <div>{MOOD_ADAPTIVE[moodTier].label}</div>
                  <div className="text-xs font-normal text-muted-foreground">
                    {MOOD_ADAPTIVE[moodTier].description}
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {MOOD_ADAPTIVE[moodTier].foods.map((food) => (
                  <div
                    key={food.name}
                    className="flex items-start gap-2 p-2 rounded-lg bg-background/60"
                  >
                    <span className="text-xl">{food.emoji}</span>
                    <div>
                      <p className="text-xs font-medium">{food.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {food.benefit}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Nutrient Targets */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          Nutrients to Focus On
        </h2>
        <div className="grid grid-cols-1 gap-2">
          {NUTRIENT_TARGETS.map(({ name, target, icon: Icon, color }) => (
            <Card
              key={name}
              className="shadow-xs"
              data-ocid="recommendations.card"
            >
              <CardContent className="flex items-center justify-between py-3 px-4">
                <div className="flex items-center gap-3">
                  <Icon className={`h-5 w-5 ${color}`} />
                  <span className="font-medium text-sm">{name}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {target}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Recommended Foods */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          Recommended Foods
        </h2>
        <div className="space-y-2">
          {filteredFoods.map((food, i) => (
            <Card
              key={food.name}
              className="shadow-xs"
              data-ocid={`recommendations.item.${i + 1}`}
            >
              <CardContent className="flex items-center gap-3 py-3 px-4">
                <span className="text-2xl">{food.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{food.name}</p>
                  <p className="text-xs text-muted-foreground">{food.reason}</p>
                </div>
                <div className="flex gap-1 flex-wrap justify-end">
                  {food.nutrients.slice(0, 2).map((n) => (
                    <Badge key={n} variant="outline" className="text-xs">
                      {n}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Foods to Avoid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          Foods to Limit
        </h2>
        <div className="space-y-2">
          {AVOID_FOODS.map((food, i) => (
            <div
              key={food.name}
              className="flex items-start gap-3 p-3 rounded-xl bg-destructive/5 border border-destructive/10"
              data-ocid={`recommendations.item.${i + 1}`}
            >
              <span className="text-destructive mt-0.5">⚠</span>
              <div>
                <p className="font-medium text-sm">{food.name}</p>
                <p className="text-xs text-muted-foreground">{food.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
