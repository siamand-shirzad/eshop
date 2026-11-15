"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, LogIn, UserPlus, Watch } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/store/auth";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
type LoginForm = z.infer<typeof loginSchema>;

const registerSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "At least 8 characters"),
});
type RegisterForm = z.infer<typeof registerSchema>;

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const { login, register: registerUser } = useAuth();
  const { toast } = useToast();

  const [tab, setTab] = useState<string>("signin");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [loginBusy, setLoginBusy] = useState(false);
  const [registerBusy, setRegisterBusy] = useState(false);

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const handleLogin = async (data: LoginForm) => {
    setLoginBusy(true);
    setLoginError(null);
    try {
      const user = await login(data.email, data.password);
      toast({
        title: "Welcome back",
        description: `Signed in as ${user.name}.`,
      });
      loginForm.reset();
      onOpenChange(false);
    } catch (e) {
      setLoginError(e instanceof Error ? e.message : "Failed to sign in");
    } finally {
      setLoginBusy(false);
    }
  };

  const handleRegister = async (data: RegisterForm) => {
    setRegisterBusy(true);
    setRegisterError(null);
    try {
      const user = await registerUser(data.name, data.email, data.password);
      toast({
        title: "Welcome to CHRONOS",
        description: `Your account is ready, ${user.name.split(" ")[0]}.`,
      });
      registerForm.reset();
      onOpenChange(false);
    } catch (e) {
      setRegisterError(e instanceof Error ? e.message : "Failed to register");
    } finally {
      setRegisterBusy(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          setLoginError(null);
          setRegisterError(null);
        }
        onOpenChange(o);
      }}
    >
      <DialogContent
        aria-describedby={undefined}
        className="max-h-[92vh] max-w-md overflow-y-auto border-border/80 bg-card p-0 sm:rounded-xl"
      >
        {/* Brand header */}
        <div className="flex flex-col items-center gap-2 border-b border-border/60 bg-secondary/25 px-6 pb-6 pt-8 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 bg-secondary">
            <Watch className="h-5 w-5 text-gold" />
          </span>
          <DialogHeader className="space-y-1">
            <DialogTitle className="font-serif text-2xl">CHRONOS</DialogTitle>
            <DialogDescription className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Members &amp; collectors
            </DialogDescription>
          </DialogHeader>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="px-6 pb-7 pt-5">
          <TabsList className="grid w-full grid-cols-2 bg-secondary/60">
            <TabsTrigger value="signin" className="text-xs uppercase tracking-[0.1em]">
              Sign in
            </TabsTrigger>
            <TabsTrigger value="register" className="text-xs uppercase tracking-[0.1em]">
              Create account
            </TabsTrigger>
          </TabsList>

          {/* ————— Sign in ————— */}
          <TabsContent value="signin" className="mt-5">
            <form
              onSubmit={loginForm.handleSubmit(handleLogin)}
              className="space-y-4"
              noValidate
            >
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="bg-secondary/50"
                  {...loginForm.register("email")}
                />
                {loginForm.formState.errors.email && (
                  <p className="text-xs text-destructive">
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="bg-secondary/50"
                  {...loginForm.register("password")}
                />
                {loginForm.formState.errors.password && (
                  <p className="text-xs text-destructive">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              {loginError && (
                <p className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
                  {loginError}
                </p>
              )}

              <Button
                type="submit"
                disabled={loginBusy}
                className="h-11 w-full gap-2 bg-primary text-sm font-semibold uppercase tracking-[0.12em] text-primary-foreground hover:bg-gold-light disabled:opacity-50"
              >
                {loginBusy ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogIn className="h-4 w-4" />
                )}
                {loginBusy ? "Signing in…" : "Sign in"}
              </Button>

              <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
                Demo account —{" "}
                <span className="text-gold">demo@chronos.watch</span> ·{" "}
                <span className="text-gold">chronos123</span>
              </p>
            </form>
          </TabsContent>

          {/* ————— Register ————— */}
          <TabsContent value="register" className="mt-5">
            <form
              onSubmit={registerForm.handleSubmit(handleRegister)}
              className="space-y-4"
              noValidate
            >
              <div className="space-y-2">
                <Label htmlFor="register-name">Full name</Label>
                <Input
                  id="register-name"
                  autoComplete="name"
                  placeholder="James Sterling"
                  className="bg-secondary/50"
                  {...registerForm.register("name")}
                />
                {registerForm.formState.errors.name && (
                  <p className="text-xs text-destructive">
                    {registerForm.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="bg-secondary/50"
                  {...registerForm.register("email")}
                />
                {registerForm.formState.errors.email && (
                  <p className="text-xs text-destructive">
                    {registerForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <Input
                  id="register-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  className="bg-secondary/50"
                  {...registerForm.register("password")}
                />
                {registerForm.formState.errors.password && (
                  <p className="text-xs text-destructive">
                    {registerForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              {registerError && (
                <p className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
                  {registerError}
                </p>
              )}

              <Button
                type="submit"
                disabled={registerBusy}
                className="h-11 w-full gap-2 bg-primary text-sm font-semibold uppercase tracking-[0.12em] text-primary-foreground hover:bg-gold-light disabled:opacity-50"
              >
                {registerBusy ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <UserPlus className="h-4 w-4" />
                )}
                {registerBusy ? "Creating account…" : "Create account"}
              </Button>

              <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
                Members enjoy order history, a synced bag across devices, and
                first access to vault allocations.
              </p>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
