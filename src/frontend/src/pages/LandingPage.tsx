import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useNavigate } from "@tanstack/react-router";
import { Brain, LineChart, Shield, Smile, Utensils, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const features = [
  {
    icon: Smile,
    title: "Mood Tracking",
    description:
      "Log your emotional state daily and discover patterns across your week.",
    color: "text-violet-500",
    bg: "bg-violet-50",
  },
  {
    icon: Utensils,
    title: "Food Insights",
    description:
      "Track meals and nutrients that fuel your brain — omega-3, magnesium, B-vitamins.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: Brain,
    title: "AI Recommendations",
    description:
      "Get personalized meal plans based on your unique mood-nutrition correlation.",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    icon: LineChart,
    title: "Correlation Analysis",
    description:
      "See exactly how your diet affects your mental state with visual dashboards.",
    color: "text-violet-500",
    bg: "bg-violet-50",
  },
  {
    icon: Zap,
    title: "Personalized Plans",
    description:
      "Receive evidence-based meal suggestions tailored to reduce anxiety, boost focus, and improve sleep.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: Shield,
    title: "Private & Secure",
    description:
      "Built on decentralized infrastructure. Your health data stays yours — always.",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
];

const testimonials = [
  {
    name: "Sarah K.",
    text: "After 3 weeks I realized my anxiety spiked every time I had sugar in the afternoon. PsycheDiet showed me the pattern.",
    emoji: "🧘",
  },
  {
    name: "Marcus L.",
    text: "The omega-3 meal suggestions genuinely improved my focus at work. I feel different — calmer, sharper.",
    emoji: "💼",
  },
  {
    name: "Priya N.",
    text: "I never connected my diet to my depression before. This app changed how I eat and how I feel every day.",
    emoji: "🌱",
  },
];

export default function LandingPage() {
  const { login, identity, isLoggingIn, isInitializing } =
    useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (identity) {
      navigate({ to: "/dashboard" });
    }
  }, [identity, navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/assets/generated/psychediet-logo-transparent.dim_400x200.png"
              alt="PsycheDiet"
              className="h-8 object-contain"
            />
          </div>
          <div className="flex items-center gap-3">
            <Link to="/admin/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground text-xs"
              >
                Admin Login
              </Button>
            </Link>
            <Button
              onClick={login}
              disabled={isLoggingIn || isInitializing}
              size="sm"
              data-ocid="landing.primary_button"
            >
              {isLoggingIn || isInitializing ? "Connecting..." : "Get Started"}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="relative h-[480px] sm:h-[500px]">
          <img
            src="/assets/generated/hero-banner.dim_1200x500.jpg"
            alt="Nutritious foods for mental wellness"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/60 via-indigo-900/40 to-background/95" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-white mb-4 leading-tight">
                Nourish Your Mind,
                <br />
                <span className="text-emerald-400">Transform Your Life</span>
              </h1>
              <p className="text-white/80 text-lg sm:text-xl max-w-2xl mb-8">
                AI-powered nutritional psychology that reveals the connection
                between what you eat and how you feel.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={login}
                  disabled={isLoggingIn || isInitializing}
                  size="lg"
                  className="h-12 px-8 text-base bg-emerald-500 hover:bg-emerald-600 text-white border-0"
                  data-ocid="landing.primary_button"
                >
                  <Shield className="mr-2 h-5 w-5" />
                  {isLoggingIn || isInitializing
                    ? "Connecting..."
                    : "Start Your Journey"}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-8 text-base bg-white/10 border-white/30 text-white hover:bg-white/20"
                  onClick={() =>
                    document
                      .getElementById("features")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  data-ocid="landing.secondary_button"
                >
                  Learn More
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="bg-indigo-600 text-white py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { value: "87%", label: "Mood Improvement" },
              { value: "12+", label: "Nutrients Tracked" },
              { value: "3×", label: "Better Food Choices" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl sm:text-3xl font-display font-bold">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm text-indigo-200">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <section id="features" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
              The Science of Eating Well
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Nutritional psychiatry meets AI. Understand your gut-brain axis
              and take control of your mental health through food.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Card className="h-full shadow-card hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div
                      className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center mb-4`}
                    >
                      <f.icon className={`h-5 w-5 ${f.color}`} />
                    </div>
                    <h3 className="font-display font-semibold text-lg mb-2">
                      {f.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {f.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-bold mb-2">
              Real Stories, Real Change
            </h2>
            <p className="text-muted-foreground">
              From our community of wellness explorers
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full shadow-card">
                  <CardContent className="pt-6">
                    <span className="text-3xl mb-3 block">{t.emoji}</span>
                    <p className="text-sm text-foreground leading-relaxed italic mb-3">
                      "{t.text}"
                    </p>
                    <p className="text-xs font-semibold text-muted-foreground">
                      {t.name}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-emerald-600 rounded-3xl p-10 text-white shadow-xl">
              <h2 className="text-3xl font-display font-bold mb-3">
                Start Today — It's Free
              </h2>
              <p className="text-white/80 mb-6">
                Join thousands who've transformed their mental wellness through
                the power of nutrition.
              </p>
              <Button
                onClick={login}
                disabled={isLoggingIn || isInitializing}
                size="lg"
                className="h-12 px-10 bg-white text-indigo-700 hover:bg-white/90 font-semibold border-0"
                data-ocid="landing.primary_button"
              >
                <Shield className="mr-2 h-5 w-5" />
                {isLoggingIn || isInitializing
                  ? "Connecting..."
                  : "Sign In Securely"}
              </Button>
              <p className="text-white/60 text-xs mt-4">
                No password needed · Decentralized identity · Full privacy
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <img
            src="/assets/generated/psychediet-logo-transparent.dim_400x200.png"
            alt="PsycheDiet"
            className="h-7 object-contain"
          />
          <p className="text-xs text-muted-foreground text-center">
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
          <Link to="/admin/login">
            <span className="text-xs text-muted-foreground hover:text-foreground">
              Admin Portal →
            </span>
          </Link>
        </div>
      </footer>
    </div>
  );
}
