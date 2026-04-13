import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2, Shield, User } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useUserAuth } from "../hooks/useUserAuth";

export default function LoginPage() {
  const {
    login: iiLogin,
    identity,
    isLoggingIn,
    isInitializing,
  } = useInternetIdentity();
  const { login: credLogin, register, isLoggedIn } = useUserAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (identity || isLoggedIn) {
      navigate({ to: "/dashboard" });
    }
  }, [identity, isLoggedIn, navigate]);

  function handleCredSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    const result =
      mode === "login"
        ? credLogin(username.trim(), password)
        : register(username.trim(), password);
    setIsSubmitting(false);
    if (!result.success) {
      setError(result.error ?? "Something went wrong.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-2xl bg-primary/10">
              <img
                src="/assets/generated/psychediet-logo-transparent.dim_200x200.png"
                alt="PsycheDiet"
                className="h-20 w-20 object-contain"
              />
            </div>
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            PsycheDiet
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Nutrition meets mental wellness.
          </p>
        </div>

        <Tabs defaultValue="credentials" className="w-full">
          <TabsList
            className="grid w-full grid-cols-2 mb-4"
            data-ocid="login.tab"
          >
            <TabsTrigger value="credentials" data-ocid="login.credentials_tab">
              Sign Up / Login
            </TabsTrigger>
            <TabsTrigger value="identity" data-ocid="login.identity_tab">
              Internet Identity
            </TabsTrigger>
          </TabsList>

          {/* Credentials Tab */}
          <TabsContent value="credentials">
            <div className="bg-card rounded-2xl shadow-card border border-border p-6">
              <div className="flex gap-2 mb-5">
                <Button
                  type="button"
                  variant={mode === "login" ? "default" : "outline"}
                  className="flex-1 h-9 text-sm"
                  onClick={() => {
                    setMode("login");
                    setError("");
                  }}
                  data-ocid="login.toggle"
                >
                  Log In
                </Button>
                <Button
                  type="button"
                  variant={mode === "register" ? "default" : "outline"}
                  className="flex-1 h-9 text-sm"
                  onClick={() => {
                    setMode("register");
                    setError("");
                  }}
                  data-ocid="login.toggle"
                >
                  Register
                </Button>
              </div>

              <form onSubmit={handleCredSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-9"
                      autoComplete="username"
                      data-ocid="login.input"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-9"
                      autoComplete={
                        mode === "register"
                          ? "new-password"
                          : "current-password"
                      }
                      data-ocid="login.input"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword((v) => !v)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <p
                    className="text-sm text-destructive"
                    data-ocid="login.error_state"
                  >
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 text-sm font-semibold"
                  data-ocid="login.submit_button"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait...
                    </>
                  ) : mode === "login" ? (
                    "Log In"
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </div>
          </TabsContent>

          {/* Internet Identity Tab */}
          <TabsContent value="identity">
            <div className="bg-card rounded-2xl shadow-card border border-border p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="text-base">🧠</span>
                  <span>AI-powered mood & nutrition insights</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="text-base">🍽️</span>
                  <span>Smart meal tracking & recommendations</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="text-base">📊</span>
                  <span>Personalized mental health dashboard</span>
                </div>
              </div>

              <Button
                onClick={iiLogin}
                disabled={isLoggingIn || isInitializing}
                className="w-full h-11 text-sm font-semibold"
                data-ocid="login.primary_button"
              >
                {isLoggingIn || isInitializing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Sign In Securely
                  </>
                )}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Decentralized identity — no passwords, full privacy
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <p className="text-center text-xs text-muted-foreground mt-6">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            caffeine.ai
          </a>
        </p>
      </motion.div>
    </div>
  );
}
