import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "@tanstack/react-router";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useCompleteOnboarding } from "../hooks/useQueries";

const HEALTH_CONDITIONS = [
  "Anxiety",
  "Depression",
  "Stress",
  "ADHD",
  "Insomnia",
  "Other",
];
const DIET_TYPES = [
  "Omnivore",
  "Vegetarian",
  "Vegan",
  "Keto",
  "Paleo",
  "Gluten-Free",
];
const TOTAL_STEPS = 5;

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { mutateAsync: completeOnboarding, isPending } =
    useCompleteOnboarding();

  const [step, setStep] = useState(1);
  const [healthConditions, setHealthConditions] = useState<string[]>([]);
  const [dietType, setDietType] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [goals, setGoals] = useState("");

  const toggleCondition = (c: string) => {
    setHealthConditions((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );
  };

  const handleFinish = async () => {
    try {
      await completeOnboarding({
        userId: crypto.randomUUID(),
        age: BigInt(Number(age) || 25),
        gender,
        dietType: dietType.toLowerCase(),
        healthConditions,
        goals,
      });
      toast.success("Profile saved! Welcome to PsycheDiet 🎉");
      navigate({ to: "/dashboard" });
    } catch {
      toast.error("Failed to save profile. Please try again.");
    }
  };

  const stepContent = [
    // Step 1: Welcome
    <div key="step1" className="text-center space-y-4">
      <div className="text-5xl mb-4">🧠</div>
      <h2 className="text-2xl font-display font-bold">Welcome to PsycheDiet</h2>
      <p className="text-muted-foreground leading-relaxed">
        We help you understand the deep connection between what you eat and how
        you feel. Track your nutrition and mood to unlock personalized AI
        insights.
      </p>
      <div className="grid grid-cols-3 gap-3 mt-6">
        {[
          { icon: "🍽️", label: "Food Tracking" },
          { icon: "😊", label: "Mood Logging" },
          { icon: "✨", label: "AI Insights" },
        ].map(({ icon, label }) => (
          <div key={label} className="bg-muted rounded-xl p-3 text-center">
            <div className="text-2xl mb-1">{icon}</div>
            <p className="text-xs text-muted-foreground font-medium">{label}</p>
          </div>
        ))}
      </div>
    </div>,

    // Step 2: Mental Health
    <div key="step2" className="space-y-4">
      <h2 className="text-xl font-display font-bold">Mental Health Profile</h2>
      <p className="text-sm text-muted-foreground">
        Select any conditions you experience. This helps us personalize your
        insights.
      </p>
      <div className="flex flex-wrap gap-2">
        {HEALTH_CONDITIONS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => toggleCondition(c)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
              healthConditions.includes(c)
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border text-foreground hover:border-primary/50"
            }`}
            data-ocid="onboarding.toggle"
          >
            {healthConditions.includes(c) && (
              <Check className="inline h-3 w-3 mr-1" />
            )}
            {c}
          </button>
        ))}
      </div>
    </div>,

    // Step 3: Diet
    <div key="step3" className="space-y-4">
      <h2 className="text-xl font-display font-bold">Diet & Lifestyle</h2>
      <p className="text-sm text-muted-foreground">
        How would you describe your current eating style?
      </p>
      <div className="grid grid-cols-2 gap-2">
        {DIET_TYPES.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDietType(d)}
            className={`px-3 py-3 rounded-xl text-sm font-medium border transition-all text-left ${
              dietType === d
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border hover:border-primary/50"
            }`}
            data-ocid="onboarding.toggle"
          >
            {d}
          </button>
        ))}
      </div>
    </div>,

    // Step 4: Lifestyle
    <div key="step4" className="space-y-4">
      <h2 className="text-xl font-display font-bold">About You</h2>
      <div className="space-y-3">
        <div>
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            placeholder="Your age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="mt-1"
            data-ocid="onboarding.input"
          />
        </div>
        <div>
          <Label htmlFor="gender">Gender</Label>
          <Select value={gender} onValueChange={setGender}>
            <SelectTrigger className="mt-1" data-ocid="onboarding.select">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="non-binary">Non-binary</SelectItem>
              <SelectItem value="prefer-not-to-say">
                Prefer not to say
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>,

    // Step 5: Goals
    <div key="step5" className="space-y-4">
      <h2 className="text-xl font-display font-bold">Your Goals</h2>
      <p className="text-sm text-muted-foreground">
        What do you want to achieve with PsycheDiet?
      </p>
      <textarea
        className="w-full rounded-xl border border-input bg-card px-3 py-2 text-sm min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-ring"
        placeholder="e.g. Improve my mood, reduce anxiety through better nutrition, track omega-3 intake..."
        value={goals}
        onChange={(e) => setGoals(e.target.value)}
        data-ocid="onboarding.textarea"
      />

      {/* Summary */}
      <div className="bg-muted rounded-xl p-4 space-y-2">
        <p className="text-sm font-semibold">Summary</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <span className="text-muted-foreground">Diet:</span>
          <span>{dietType || "—"}</span>
          <span className="text-muted-foreground">Age:</span>
          <span>{age || "—"}</span>
          <span className="text-muted-foreground">Gender:</span>
          <span>{gender || "—"}</span>
          <span className="text-muted-foreground">Conditions:</span>
          <span>
            {healthConditions.length > 0 ? healthConditions.join(", ") : "None"}
          </span>
        </div>
      </div>
    </div>,
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>
              Step {step} of {TOTAL_STEPS}
            </span>
            <span>{Math.round((step / TOTAL_STEPS) * 100)}% complete</span>
          </div>
          <Progress value={(step / TOTAL_STEPS) * 100} className="h-1.5" />
        </div>

        <div className="bg-card rounded-2xl shadow-card border border-border p-6 min-h-[320px] flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex-1"
            >
              {stepContent[step - 1]}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-6 pt-4 border-t border-border">
            <Button
              variant="ghost"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
              data-ocid="onboarding.cancel_button"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            {step < TOTAL_STEPS ? (
              <Button
                onClick={() => setStep((s) => s + 1)}
                data-ocid="onboarding.primary_button"
              >
                Continue
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleFinish}
                disabled={isPending}
                data-ocid="onboarding.submit_button"
              >
                {isPending ? "Saving..." : "Get Started 🚀"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
