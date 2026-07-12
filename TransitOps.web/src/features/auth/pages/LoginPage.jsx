import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LogIn, AlertCircle } from "lucide-react";
import { Input, Button } from "@/components/common";
import { Select, Checkbox } from "@/components/forms";
import { loginSchema } from "../schemas";
import { useLogin } from "../hooks";
import { ROLES, ROLE_LABELS } from "@/constants/app";


export default function LoginPage() {
  const [remember, setRemember] = useState(true);
  const login = useLogin();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  function onSubmit(values) {
    login.mutate(values);
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      {}
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
        {}
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

        <div className="mb-8 text-center">
          <h1 className="font-display text-[34px] font-bold leading-tight tracking-[-0.03em] text-text-primary">
            Sign in to your account
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Enter your credentials to continue
          </p>
        </div>

        <div className="glass-elevated px-8 py-9">
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-4"
          >

            <Input
              label="Email"
              type="email"
              placeholder="raven.k@transitops.in"
              required
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              required
              error={errors.password?.message}
              {...register("password")}
            />



            <div className="flex items-center justify-between pt-1">
              <Checkbox
                label="Remember me"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <button
                type="button"
                className="text-[13px] font-medium text-ink-500 hover:underline"
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
              icon={<LogIn size={16} />}
            >
              Sign In
            </Button>
          </form>
        </div>


      </div>
    </div>
  );
}
