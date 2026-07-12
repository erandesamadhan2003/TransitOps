import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { ArrowRight, ShieldCheck, TrendingUp, Truck } from "lucide-react";
import { Button } from "@/components/common";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white selection:bg-ink-100 selection:text-ink-900">
      {/* Dynamic Background Elements */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.3]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M0 0H60M0 0V60' stroke='%231a3c5e' stroke-width='0.4' stroke-opacity='0.25' fill='none'/%3E%3C/svg%3E\")",
          }}
        />
        <div className="absolute -top-1/4 right-0 h-[600px] w-[600px] rounded-full bg-ink-400/10 blur-[100px]" />
        <div className="absolute -bottom-1/4 -left-1/4 h-[500px] w-[500px] rounded-full bg-blue-400/10 blur-[100px]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center">
        {/* Header */}
        <header className="w-full px-6 py-6 md:px-12 md:py-8 flex items-center justify-between max-w-7xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 py-1.5 pl-1.5 pr-4 backdrop-blur-md">
            <span className="brand-gradient flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white">
              T
            </span>
            <span className="text-sm font-bold uppercase tracking-widest text-ink-700">
              TransitOps
            </span>
          </div>
          <Link to={ROUTES.LOGIN}>
            <Button variant="outline" size="sm" className="rounded-full px-6">
              Sign In
            </Button>
          </Link>
        </header>

        {/* Hero Section */}
        <main className="flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 py-12 text-center">
          <div className="animate-fade-up">
            <span className="mb-4 inline-flex items-center rounded-full bg-ink-50 px-3 py-1 text-xs font-medium text-ink-700 ring-1 ring-inset ring-ink-200">
              Next-Generation Fleet Management
            </span>
          </div>
          <h1 className="animate-fade-up mt-6 max-w-4xl font-display text-5xl font-extrabold tracking-tight text-text-primary sm:text-6xl md:text-7xl" style={{ animationDelay: "100ms" }}>
            Smart Transport Operations Platform
          </h1>
          <p className="animate-fade-up mt-6 max-w-2xl text-lg text-text-secondary sm:text-xl" style={{ animationDelay: "200ms" }}>
            Streamline your fleet, empower your drivers, and optimize your dispatch operations with real-time tracking, intelligent routing, and comprehensive financial analytics.
          </p>

          <div className="animate-fade-up mt-10 flex flex-col sm:flex-row items-center justify-center gap-4" style={{ animationDelay: "300ms" }}>
            <Link to={ROUTES.LOGIN}>
              <Button size="lg" className="rounded-full px-8 text-base shadow-xl shadow-ink-500/20" icon={<ArrowRight size={18} />}>
                Go to Dashboard
              </Button>
            </Link>
          </div>

          {/* Feature highlights */}
          <div className="animate-fade-up mt-20 grid w-full grid-cols-1 gap-6 sm:grid-cols-3 md:gap-8" style={{ animationDelay: "450ms" }}>
            {[
              { icon: <Truck className="text-blue-500" size={24} />, title: "Fleet Management", desc: "Track vehicles, monitor maintenance, and manage your entire fleet in real-time." },
              { icon: <ShieldCheck className="text-emerald-500" size={24} />, title: "Driver Safety", desc: "Monitor safety scores, track license expirations, and ensure compliance." },
              { icon: <TrendingUp className="text-amber-500" size={24} />, title: "Financial Analytics", desc: "Deep insights into operational costs, fuel logs, and expense reports." }
            ].map((feature, i) => (
              <div key={i} className="glass-elevated flex flex-col items-center p-6 text-center transition-transform hover:-translate-y-1">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-border">
                  {feature.icon}
                </div>
                <h3 className="mb-2 font-display text-lg font-bold text-text-primary">{feature.title}</h3>
                <p className="text-sm text-text-secondary">{feature.desc}</p>
              </div>
            ))}
          </div>
        </main>
        
        {/* Footer */}

      </div>
    </div>
  );
}
