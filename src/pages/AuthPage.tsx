import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn, ShieldCheck, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { useAuth } from "@/context/AuthContext";
import { ApiError, authApi } from "@/lib/api";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

type Mode = "login" | "signup";

const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const signupSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
    email: z.string().trim().email("Please enter a valid email").max(255),
    password: z.string().min(8, "Password must be at least 8 characters").max(128),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function AuthPage() {
  const { login, signup, verifyOtp } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const initialMode: Mode = location.pathname === "/signup" ? "signup" : "login";
  const [mode, setMode] = useState<Mode>(initialMode);

  useEffect(() => {
    setMode(location.pathname === "/signup" ? "signup" : "login");
  }, [location.pathname]);

  const switchMode = (next: Mode) => {
    setMode(next);
    // Preserve the `from` state so users sent here from a protected action
    // (e.g. Donate, Apply) still get bounced back after they finish signing up.
    navigate(next === "signup" ? "/signup" : "/login", {
      replace: true,
      state: location.state,
    });
  };

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // OTP verification state — set after a successful signup or when login is
  // blocked because the account is unverified.
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

  const redirectTo = (location.state as { from?: string } | null)?.from || "/";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = loginSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

    setSubmitting(true);
    try {
      await login(parsed.data.email, parsed.data.password);
      toast.success("Welcome back!");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        const email =
          (err.data as { email?: string } | null)?.email || parsed.data.email;
        setPendingEmail(email);
        setOtp("");
        toast.error(err.message);
      } else {
        toast.error(
          err instanceof ApiError
            ? err.message
            : "Unable to log in right now. Please try again."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = signupSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

    setSubmitting(true);
    try {
      const { message, devOtp } = await signup(
        parsed.data.name,
        parsed.data.email,
        parsed.data.password
      );
      toast.success(message);
      setPendingEmail(parsed.data.email);
      // If the backend handed back a dev OTP (SMTP isn't configured), prefill
      // the input so the user can just click "Verify and continue".
      if (devOtp && /^\d{6}$/.test(devOtp)) {
        setOtp(devOtp);
        toast.info(`Dev mode: your verification code is ${devOtp}`, { duration: 15000 });
      } else {
        setOtp("");
      }
    } catch (err) {
      toast.error(
        err instanceof ApiError
          ? err.message
          : "Unable to create your account right now. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingEmail || otp.length !== 6) {
      toast.error("Enter the 6-digit code from your email");
      return;
    }

    setVerifying(true);
    try {
      await verifyOtp(pendingEmail, otp);
      toast.success("Email verified — welcome!");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setOtp("");
      toast.error(
        err instanceof ApiError ? err.message : "Verification failed. Please try again."
      );
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!pendingEmail) return;
    setResending(true);
    try {
      const res = await authApi.resendOtp(pendingEmail);
      toast.success(res.message);
      if (res.devOtp && /^\d{6}$/.test(res.devOtp)) {
        setOtp(res.devOtp);
        toast.info(`Dev mode: your verification code is ${res.devOtp}`, { duration: 15000 });
      }
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Unable to resend right now.");
    } finally {
      setResending(false);
    }
  };

  const copy = useMemo(
    () =>
      mode === "login"
        ? {
            badge: "Welcome Back",
            title: "Sign in to continue your impact",
            desc: "Track your contributions, volunteer activity and stay connected with the Mesho Foundation community.",
          }
        : {
            badge: "Join Us",
            title: "Create your account",
            desc: "Become part of the Mesho Foundation community. Support causes, volunteer for drives and help us build a better future.",
          },
    [mode]
  );

  // --- OTP verification screen ---
  if (pendingEmail) {
    return (
      <section className="section-padding pt-28 min-h-screen flex items-center">
        <div className="container-narrow w-full">
          <motion.form
            onSubmit={handleVerifyOtp}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-elevated rounded-3xl p-8 md:p-10 max-w-lg mx-auto text-center"
            noValidate
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <ShieldCheck className="text-primary" size={28} />
            </div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold mb-2">
              Enter verification code
            </h1>
            <p className="text-sm text-muted-foreground mb-1">We sent a 6-digit code to</p>
            <p className="font-semibold text-foreground mb-6 break-all">{pendingEmail}</p>

            <div className="flex justify-center mb-6">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(v) => setOtp(v.replace(/\D/g, ""))}
                containerClassName="gap-2"
              >
                <InputOTPGroup className="gap-2">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <InputOTPSlot
                      key={i}
                      index={i}
                      className="h-12 w-12 rounded-xl border text-lg font-semibold bg-background/60"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>

            <motion.button
              type="submit"
              disabled={verifying || otp.length !== 6}
              whileHover={{ scale: verifying ? 1 : 1.01 }}
              whileTap={{ scale: verifying ? 1 : 0.98 }}
              className="gradient-btn w-full py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {verifying ? "Verifying..." : "Verify and continue"}
            </motion.button>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-6">
              <span>Didn't get the code?</span>
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-primary hover:underline font-medium disabled:opacity-60"
              >
                {resending ? "Sending..." : "Resend"}
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                const carryEmail = pendingEmail;
                setPendingEmail(null);
                setOtp("");
                switchMode("login");
                setForm({ name: "", email: carryEmail, password: "", confirmPassword: "" });
              }}
              className="mt-6 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to login
            </button>

            <p className="text-xs text-muted-foreground mt-6">
              The code expires in 10 minutes. Check your spam folder if it doesn't arrive.
            </p>
          </motion.form>
        </div>
      </section>
    );
  }

  // --- Login / Signup form ---
  return (
    <section className="section-padding pt-28 min-h-screen flex items-center">
      <div className="container-narrow w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            key={mode + "-copy"}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="hidden md:block"
          >
            <span className="section-badge">{copy.badge}</span>
            <h1 className="section-title mt-4">{copy.title}</h1>
            <p className="section-desc mt-4">{copy.desc}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="card-elevated rounded-3xl p-8 w-full max-w-md mx-auto"
          >
            {/* Tabs */}
            <div className="relative grid grid-cols-2 gap-2 mb-8 p-1 rounded-2xl bg-muted/40">
              <button
                type="button"
                onClick={() => switchMode("login")}
                className={`relative z-10 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                  mode === "login"
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => switchMode("signup")}
                className={`relative z-10 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                  mode === "signup"
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign up
              </button>
              <motion.div
                layout
                className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl bg-primary"
                style={{ left: mode === "login" ? 4 : "calc(50% + 0px)" }}
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            </div>

            <AnimatePresence mode="wait">
              {mode === "login" ? (
                <motion.form
                  key="login-form"
                  onSubmit={handleLogin}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                  noValidate
                >
                  <Field label="Email address">
                    <input
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      className="input-field"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      maxLength={255}
                      required
                    />
                  </Field>

                  <Field label="Password">
                    <PasswordInput
                      value={form.password}
                      onChange={(v) => setForm({ ...form, password: v })}
                      show={showPassword}
                      onToggleShow={() => setShowPassword((v) => !v)}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                    />
                  </Field>

                  <SubmitButton submitting={submitting} icon={<LogIn size={16} />}>
                    {submitting ? "Signing in..." : "Sign in"}
                  </SubmitButton>

                  <p className="text-center text-sm text-muted-foreground pt-2">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => switchMode("signup")}
                      className="text-primary hover:underline font-medium"
                    >
                      Create one
                    </button>
                  </p>
                </motion.form>
              ) : (
                <motion.form
                  key="signup-form"
                  onSubmit={handleSignup}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                  noValidate
                >
                  <Field label="Full name">
                    <input
                      type="text"
                      autoComplete="name"
                      placeholder="Jane Doe"
                      className="input-field"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      maxLength={100}
                      required
                    />
                  </Field>

                  <Field label="Email address">
                    <input
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      className="input-field"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      maxLength={255}
                      required
                    />
                  </Field>

                  <Field label="Password">
                    <PasswordInput
                      value={form.password}
                      onChange={(v) => setForm({ ...form, password: v })}
                      show={showPassword}
                      onToggleShow={() => setShowPassword((v) => !v)}
                      autoComplete="new-password"
                      placeholder="At least 8 characters"
                      minLength={8}
                    />
                  </Field>

                  <Field label="Confirm password">
                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Re-enter your password"
                      className="input-field"
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      minLength={8}
                      required
                    />
                  </Field>

                  <SubmitButton submitting={submitting} icon={<UserPlus size={16} />}>
                    {submitting ? "Creating account..." : "Create account"}
                  </SubmitButton>

                  <p className="text-center text-xs text-muted-foreground pt-2">
                    We'll email you a 6-digit code to verify your account.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
        {label}
      </label>
      {children}
    </div>
  );
}

function PasswordInput({
  value,
  onChange,
  show,
  onToggleShow,
  autoComplete,
  placeholder,
  minLength,
}: {
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggleShow: () => void;
  autoComplete: string;
  placeholder: string;
  minLength?: number;
}) {
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="input-field pr-11"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        minLength={minLength}
        required
      />
      <button
        type="button"
        onClick={onToggleShow}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

function SubmitButton({
  submitting,
  icon,
  children,
}: {
  submitting: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      type="submit"
      disabled={submitting}
      whileHover={{ scale: submitting ? 1 : 1.01 }}
      whileTap={{ scale: submitting ? 1 : 0.98 }}
      className="gradient-btn w-full py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {icon}
      {children}
    </motion.button>
  );
}
