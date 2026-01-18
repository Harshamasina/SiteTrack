"use client";

import Image from "next/image";
import Link from "next/link";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BadgeCheck, BadgeCheckIcon, BarChart3, CheckCheckIcon, CheckCircleIcon, Globe2, Layers, Lock, Radar, Sparkles } from "lucide-react";

const highlights = [
  { title: "Live streams", desc: "Visitors, sessions, and live users in real time." },
  { title: "Geo + devices", desc: "Countries, cities, devices, OS, and browsers at a glance." },
  { title: "Session quality", desc: "Total and average active time, time-zone aware." },
];

const features = [
  { title: "Hourly & daily charts", desc: "Toggle granularity with smooth transitions.", icon: BarChart3 },
  { title: "Geo widgets", desc: "Countries, cities, regions with flags.", icon: Globe2 },
  { title: "Tech mix", desc: "Devices, OS, browsers with smart icons.", icon: Layers },
  { title: "Recent IP intel", desc: "Click IPs to open ip-api details in-app.", icon: Radar },
  { title: "Privacy & auth", desc: "Clerk auth on APIs; no invasive tracking.", icon: Lock },
  { title: "One-line install", desc: "Drop the script and watch data flow instantly.", icon: Sparkles },
];

export default function Home() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-[#26242b] text-foreground">
      <header className="sticky top-0 z-20 bg-[#26242b]/85 border-b border-white/10 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="logo" width={100} height={150} className="" />
          </Link>
          <div className="flex items-center gap-3">
            {user && (
              <Link href="/dashboard">
                <Button variant="ghost" className="text-sm text-muted-foreground transition">
                  Dashboard
                </Button>
              </Link>
            )}
            {!user ? (
              <SignInButton mode="modal" signUpForceRedirectUrl="/dashboard">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 transition">
                  Sign In
                </Button>
              </SignInButton>
            ) : (
              <UserButton />
            )}
          </div>
        </div>
      </header>

      <main className="relative overflow-hidden">
        {/* Glow accents */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-10 h-80 w-80 rounded-full bg-[#5f72b0]/30 blur-[90px]" />
          <div className="absolute top-10 right-0 h-96 w-96 rounded-full bg-[#3f497e]/30 blur-[110px]" />
        </div>

        {/* Hero */}
        <section className="relative mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 pb-16 pt-14 text-center sm:px-6">
          <div className="glass rounded-full px-6 py-2 inline-flex items-center gap-2 text-sm text-primary-foreground/80 border border-white/10 shadow-lg shadow-black/30 animate-fade-in">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            Built for Live Analytics of Web Apps
          </div>
          <div className="space-y-6 max-w-3xl animate-fade-up">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Live Analytics Updates of Web Apps on the Tip of Your Hands.
            </h1>
            <p className="text-lg text-muted-foreground">
              Clean charts, widgets, and IP intelligence in a single dashboard. No clutter just the correct amount of data you need.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-up">
            {user ? (
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="px-6 bg-primary text-primary-foreground hover:bg-primary/90 transition shadow-lg shadow-primary/30"
                >
                  Launch Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <SignInButton mode="modal" signUpForceRedirectUrl="/dashboard">
                <Button
                  size="lg"
                  className="px-6 bg-primary text-primary-foreground hover:bg-primary/90 transition shadow-lg shadow-primary/30"
                >
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </SignInButton>
            )}
            <Button
              size="lg"
              variant="outline"
              className="px-6 border-white/20 text-white hover:bg-white/5 transition"
            >
              View Pricing
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 w-full max-w-5xl animate-fade-up">
            {highlights.map((item, idx) => (
              <Card
                key={item.title}
                className="glass border-white/10 text-white transition hover:-translate-y-1 hover:border-primary/40"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <CardContent className="p-5 space-y-2">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Feature grid */}
        <section className="relative mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <Card className="glass border-white/10 text-white shadow-xl shadow-black/30">
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">All-in-one dashboard</p>
                  <h3 className="text-2xl font-semibold">Charts, widgets, and IP details</h3>
                  <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
                    Hourly/daily charts, geo and tech widgets, and click to expand IP intel powered by ip-api—live inside the app.
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="rounded-xl bg-white/5 px-4 py-3 text-white shadow-inner shadow-black/20">
                    <p className="text-xs text-muted-foreground">Live Users</p>
                    <span><BadgeCheckIcon /></span>
                  </div>

                  <div className="rounded-xl bg-white/5 px-4 py-3 text-white shadow-inner shadow-black/20">
                    <p className="text-xs text-muted-foreground">Geo Loc</p>
                    <span><BadgeCheckIcon /></span>
                  </div>
                </div>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-3">
                {features.map((card, idx) => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={card.title}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white space-y-2 transition hover:-translate-y-1 hover:border-primary/50"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <Icon className="h-5 w-5 text-primary" />
                      <p className="text-sm font-semibold">{card.title}</p>
                      <p className="text-sm text-muted-foreground">{card.desc}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <footer className="mt-12 border-t border-white/10 backdrop-blur-sm">
            <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <p className="text-xs text-muted-foreground hidden sm:block">SiteTrack</p>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <a href="mailto:support@sitetrack.app">Support</a>
                {user && (
                  <>
                    <Link href="/">Home</Link>
                    <Link href="/dashboard">Dashboard</Link>
                  </>
                )}
              </div>
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}
