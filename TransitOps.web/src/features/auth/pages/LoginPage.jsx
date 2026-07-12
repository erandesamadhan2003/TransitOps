import { useState, useEffect, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LogIn, AlertCircle, Lock, Mail, ArrowLeft } from "lucide-react";
import { Input, Button } from "@/components/common";
import { Checkbox } from "@/components/forms";
import { loginSchema } from "../schemas";
import { useLogin } from "../hooks";

// ── Lockout callout ──────────────────────────────────────────────────
function LockoutBanner({ secondsLeft }) {
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timeStr =
    secondsLeft > 0
      ? mins > 0
        ? `${mins}m ${secs}s`
        : `${secs}s`
      : null;

  return (
    <div
      className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/80 px-4 py-3 text-sm"
      role="alert"
      aria-live="assertive"
    >
      <Lock size={16} className="mt-0.5 shrink-0 text-red-600" />
      <div>
        <p className="font-semibold text-red-700">Account locked</p>
        <p className="mt-0.5 text-red-600">
          Too many failed attempts. Your account has been temporarily locked.
          {timeStr && (
            <span className="ml-1 font-medium">
              Try again in {timeStr}.
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

// ── Forgot Password mini-screen ──────────────────────────────────────
function ForgotPasswordView({ onBack }) {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-[13px] font-medium text-ink-500 hover:text-ink-700 transition-colors"
      >
        <ArrowLeft size={14} />
        Back to sign in
      </button>

      <div>
        <h2 className="font-display text-xl font-bold text-text-primary">
          Reset your password
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          Enter your email and we'll send reset instructions when this feature
          is available.
        </p>
      </div>

      {submitted ? (
        <div className="flex items-start gap-3 rounded-xl border border-teal-200 bg-teal-50/80 px-4 py-3 text-sm">
          <Mail size={16} className="mt-0.5 shrink-0 text-teal-600" />
          <p className="text-teal-700">
            If an account exists for <strong>{email}</strong>, reset
            instructions will be sent once this feature is live.
          </p>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (email) setSubmitted(true);
          }}
          className="space-y-4"
          noValidate
        >
          <Input
            label="Email"
            type="email"
            placeholder="you@transitops.in"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="rounded-lg border border-amber-200 bg-amber-50/70 px-3 py-2 text-xs text-amber-700">
            ⚠ Password reset is not yet available — this screen is a placeholder.
          </div>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={!email}
          >
            Send Reset Link
          </Button>
        </form>
      )}
    </div>
  );
}

// ── Main LoginPage ───────────────────────────────────────────────────
export default function LoginPage() {
  const [remember, setRemember] = useState(true);
  const [showForgot, setShowForgot] = useState(false);
  const [locked, setLocked] = useState(false);
  const [lockSecondsLeft, setLockSecondsLeft] = useState(0);

  const login = useLogin({
    onAccountLocked: useCallback((retryAfterSeconds) => {
      setLocked(true);
      setLockSecondsLeft(retryAfterSeconds ?? 0);
    }, []),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  // Countdown timer while locked
  useEffect(() => {
    if (!locked || lockSecondsLeft <= 0) return;
    const id = setInterval(() => {
      setLockSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          setLocked(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [locked, lockSecondsLeft]);

  function onSubmit(values) {
    login.mutate(values);
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M0 0H60M0 0V60' stroke='%231a3c5e' stroke-width='0.4' stroke-opacity='0.25' fill='none'/%3E%3C/svg%3E\")",
          }}
        />
        <div className="absolute right-[-10%] top-1/3 h-[420px] w-[420px] rounded-full bg-ink-500/10 blur-3xl" />
        <div className="absolute bottom-[-15%] left-[-10%] h-[380px] w-[380px] rounded-full bg-ink-500/10 blur-3xl" />
      </div>

      <div className="relative z-[1] w-full max-w-[420px]">
        {/* Brand chip */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 py-1.5 pl-1.5 pr-3.5">
            <span className="brand-gradient flex h-5 w-5 items-center justify-center rounded-[8px] text-[10px] font-bold text-white">
              T
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-600">
              TransitOps
            </span>
          </div>
        </div>

        {!showForgot && (
          <div className="mb-8 text-center">
            <h1 className="font-display text-[34px] font-bold leading-tight tracking-[-0.03em] text-text-primary">
              Sign in to your account
            </h1>
            <p className="mt-2 text-sm text-text-secondary">
              Enter your credentials to continue
            </p>
          </div>
        )}

        <div className="glass-elevated px-8 py-9">
          {showForgot ? (
            <ForgotPasswordView onBack={() => setShowForgot(false)} />
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="space-y-4"
            >
              {/* Lockout banner */}
              {locked && <LockoutBanner secondsLeft={lockSecondsLeft} />}

              <Input
                label="Email"
                type="email"
                id="login-email"
                placeholder="raven.k@transitops.in"
                required
                disabled={locked}
                error={errors.email?.message}
                {...register("email")}
              />

              <Input
                label="Password"
                type="password"
                id="login-password"
                placeholder="••••••••"
                required
                disabled={locked}
                error={errors.password?.message}
                {...register("password")}
              />

              <div className="flex items-center justify-between pt-1">
                <Checkbox
                  label="Remember me"
                  checked={remember}
                  disabled={locked}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <button
                  type="button"
                  className="text-[13px] font-medium text-ink-500 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={locked}
                  onClick={() => setShowForgot(true)}
                >
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                loading={login.isPending}
                disabled={locked}
                icon={locked ? <Lock size={16} /> : <LogIn size={16} />}
              >
                {locked ? "Account Locked" : "Sign In"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
