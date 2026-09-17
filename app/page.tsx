import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ThreeDHeroCanvas } from '@/components/shared/ThreeDHeroCanvas';
import { ThreeDTiltCard } from '@/components/shared/ThreeDTiltCard';
import { Building2, ShieldCheck, ArrowRight, UserCheck, Users, Sparkles, Zap, Award, Layers } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#020617] text-white flex flex-col justify-between p-6 relative overflow-hidden">
      {/* Background Animated Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-sky-500/15 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '2s' }} />

      <div className="max-w-7xl mx-auto w-full py-8 z-10 space-y-16">
        {/* Hero Section with Interactive 3D WebGL Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-7 text-left">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/80 border border-sky-500/30 text-sky-400 text-xs font-semibold shadow-[0_0_20px_rgba(56,189,248,0.2)] backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-sky-400 animate-pulse" /> 
              <span>3D WebGL Interactive Security Engine</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-sky-400 drop-shadow-sm">
              Enterprise Vendor & Partner Management Platform
            </h1>

            <p className="text-slate-300 text-base sm:text-xl leading-relaxed max-w-2xl font-light">
              Automated 3-tier sequential onboarding workflows, statutory document compliance, real-time SLA ticketing desk, and PL/pgSQL database code generation.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/register/vendor">
                <Button size="lg" className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold px-8 py-6 rounded-xl shadow-[0_10px_30px_rgba(14,165,233,0.35)] hover:shadow-[0_15px_40px_rgba(14,165,233,0.5)] transition-all duration-300 gap-3 text-base">
                  <span>Register Vendor Organization</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/admin/dashboard">
                <Button size="lg" variant="outline" className="border-slate-700/80 bg-slate-900/60 text-slate-200 hover:bg-slate-800/80 hover:text-white font-semibold px-7 py-6 rounded-xl backdrop-blur-md transition-all duration-300 gap-2.5 text-base">
                  <ShieldCheck className="w-5 h-5 text-sky-400" />
                  <span>Executive Command Center</span>
                </Button>
              </Link>
            </div>

            {/* Quick High-Impact Feature Pill Matrix */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800/60 max-w-xl">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>3-Tier Approvals</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>3 Vendor Categories</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>PostgreSQL DB</span>
              </div>
            </div>
          </div>

          {/* 3D WebGL Canvas Container with Glowing Rim */}
          <div className="lg:col-span-5 flex justify-center items-center relative">
            <div className="w-full max-w-lg h-[420px] rounded-3xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.7),_inset_0_1px_1px_rgba(255,255,255,0.15)] p-4 flex items-center justify-center overflow-hidden group">
              {/* Corner specular light accents */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-sky-500/20 transition-all duration-500" />
              <ThreeDHeroCanvas />
            </div>
          </div>
        </div>

        {/* 3D Tilt Portal Gateway Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Vendor Portal Gateway Card */}
          <ThreeDTiltCard>
            <Card className="glass-card glass-card-hover border-slate-800 h-full flex flex-col justify-between shadow-2xl p-2">
              <CardHeader className="space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500/20 to-blue-600/30 text-sky-400 flex items-center justify-center border border-sky-500/30 shadow-[0_0_20px_rgba(56,189,248,0.2)]">
                  <Building2 className="w-7 h-7" />
                </div>
                <CardTitle className="text-white text-2xl font-bold">Vendor Onboarding</CardTitle>
                <CardDescription className="text-slate-300 text-sm leading-relaxed">
                  Submit Statutory Docs, Select Category (Cash, WCC, B2B), Track L1/L2/L3 Approvals & Payouts.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <Link href="/register/vendor" className="block">
                  <Button className="w-full bg-sky-600 hover:bg-sky-500 text-white justify-between font-semibold py-5 rounded-xl shadow-lg shadow-sky-600/30">
                    <span>Register as Vendor</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/vendor/dashboard" className="block">
                  <Button variant="outline" className="w-full border-slate-700/80 bg-slate-900/50 text-slate-300 hover:bg-slate-800 hover:text-white justify-between font-medium py-5 rounded-xl">
                    <span>Vendor Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </ThreeDTiltCard>

          {/* Customer / Partner Gateway Card */}
          <ThreeDTiltCard>
            <Card className="glass-card glass-card-hover border-slate-800 h-full flex flex-col justify-between shadow-2xl p-2">
              <CardHeader className="space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-600/30 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shadow-[0_0_20px_rgba(52,211,153,0.2)]">
                  <Users className="w-7 h-7" />
                </div>
                <CardTitle className="text-white text-2xl font-bold">Customer Portal</CardTitle>
                <CardDescription className="text-slate-300 text-sm leading-relaxed">
                  Complete account verification, sign digital service contracts, and manage commercial milestones.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <Link href="/register/customer" className="block">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white justify-between font-semibold py-5 rounded-xl shadow-lg shadow-emerald-600/30">
                    <span>Register as Customer</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/customer/dashboard" className="block">
                  <Button variant="outline" className="w-full border-slate-700/80 bg-slate-900/50 text-slate-300 hover:bg-slate-800 hover:text-white justify-between font-medium py-5 rounded-xl">
                    <span>Customer Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </ThreeDTiltCard>

          {/* Executive Console Gateway Card */}
          <ThreeDTiltCard>
            <Card className="glass-card glass-card-hover border-slate-800 h-full flex flex-col justify-between shadow-2xl p-2">
              <CardHeader className="space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-600/30 text-purple-400 flex items-center justify-center border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                  <UserCheck className="w-7 h-7" />
                </div>
                <CardTitle className="text-white text-2xl font-bold">Executive Console</CardTitle>
                <CardDescription className="text-slate-300 text-sm leading-relaxed">
                  L1 Document Specialist, L2 Assessor, L3 Management Approval, SLA Ticketing & Risk Scoring.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <Link href="/admin/dashboard" className="block">
                  <Button className="w-full bg-purple-600 hover:bg-purple-500 text-white justify-between font-semibold py-5 rounded-xl shadow-lg shadow-purple-600/30">
                    <span>Open Command Center</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/admin/approvals" className="block">
                  <Button variant="outline" className="w-full border-slate-700/80 bg-slate-900/50 text-slate-300 hover:bg-slate-800 hover:text-white justify-between font-medium py-5 rounded-xl">
                    <span>Approval Pipelines</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </ThreeDTiltCard>
        </div>
      </div>

      <div className="border-t border-slate-800/80 max-w-7xl mx-auto w-full pt-8 text-center text-xs text-slate-500 font-medium">
        Enterprise Vendor & Customer Management Portal • Built with Next.js 16, Three.js 3D WebGL & PostgreSQL
      </div>
    </div>
  );
}

