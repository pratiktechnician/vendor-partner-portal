import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ThreeDHeroCanvas } from '@/components/shared/ThreeDHeroCanvas';
import { ThreeDTiltCard } from '@/components/shared/ThreeDTiltCard';
import { Building2, ShieldCheck, ArrowRight, UserCheck, Users, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col justify-between p-6 relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto w-full py-8 z-10">
        {/* Hero Section with Interactive 3D Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold shadow-inner">
              <Sparkles className="w-4 h-4 text-sky-400 animate-pulse" /> 3D Powered Security & Workflow Automation
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-sky-400 bg-clip-text text-transparent leading-[1.15]">
              Enterprise Vendor & Customer Management Portal
            </h1>
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-xl">
              Centralized platform for progressive vendor onboarding, manual compliance verification, dynamic multi-tier invoice approval workflows, and finance payment tracking.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/register/vendor">
                <Button size="lg" className="bg-sky-600 hover:bg-sky-500 text-white font-bold px-8 shadow-lg shadow-sky-600/30 gap-2">
                  <span>Register Organization</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800/80 font-semibold px-6">
                  <span>Employee Sign In</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Interactive Three.js WebGL Canvas */}
          <div className="lg:col-span-5 flex justify-center items-center relative">
            <div className="w-full max-w-md h-[380px] rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl shadow-2xl p-4 flex items-center justify-center overflow-hidden">
              <ThreeDHeroCanvas />
            </div>
          </div>
        </div>

        {/* 3D Tilt Portal Gateway Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Vendor Portal Card */}
          <ThreeDTiltCard>
            <Card className="bg-slate-900/70 border-slate-800 hover:border-sky-500/50 transition-colors h-full flex flex-col justify-between shadow-xl">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-sky-600/20 text-sky-400 flex items-center justify-center mb-2 shadow-inner">
                  <Building2 className="w-6 h-6" />
                </div>
                <CardTitle className="text-white text-xl">Vendor Portal</CardTitle>
                <CardDescription className="text-slate-400">
                  Register organization, upload statutory compliance docs, submit invoices, and track payouts.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-2">
                <Link href="/register/vendor" className="block">
                  <Button className="w-full bg-sky-600 hover:bg-sky-500 text-white justify-between font-semibold">
                    <span>Register as Vendor</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/vendor/dashboard" className="block">
                  <Button variant="outline" className="w-full border-slate-800 text-slate-300 hover:bg-slate-800 justify-between">
                    <span>Vendor Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </ThreeDTiltCard>

          {/* Customer Portal Card */}
          <ThreeDTiltCard>
            <Card className="bg-slate-900/70 border-slate-800 hover:border-teal-500/50 transition-colors h-full flex flex-col justify-between shadow-xl">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-teal-600/20 text-teal-400 flex items-center justify-center mb-2 shadow-inner">
                  <Users className="w-6 h-6" />
                </div>
                <CardTitle className="text-white text-xl">Customer Portal</CardTitle>
                <CardDescription className="text-slate-400">
                  Complete onboarding, submit service agreements, and monitor account verification status.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-2">
                <Link href="/register/customer" className="block">
                  <Button className="w-full bg-teal-600 hover:bg-teal-500 text-white justify-between font-semibold">
                    <span>Register as Customer</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/customer/dashboard" className="block">
                  <Button variant="outline" className="w-full border-slate-800 text-slate-300 hover:bg-slate-800 justify-between">
                    <span>Customer Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </ThreeDTiltCard>

          {/* Management Console Card */}
          <ThreeDTiltCard>
            <Card className="bg-slate-900/70 border-slate-800 hover:border-purple-500/50 transition-colors h-full flex flex-col justify-between shadow-xl">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-2 shadow-inner">
                  <UserCheck className="w-6 h-6" />
                </div>
                <CardTitle className="text-white text-xl">Management Console</CardTitle>
                <CardDescription className="text-slate-400">
                  For Document Verifiers, Procurement Officers, Dept Approvers, Finance, and Super Admins.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-2">
                <Link href="/admin/dashboard" className="block">
                  <Button className="w-full bg-purple-600 hover:bg-purple-500 text-white justify-between font-semibold">
                    <span>Open Executive Console</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/login" className="block">
                  <Button variant="outline" className="w-full border-slate-800 text-slate-300 hover:bg-slate-800 justify-between">
                    <span>Employee Login</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </ThreeDTiltCard>
        </div>
      </div>

      <div className="border-t border-slate-800/80 max-w-6xl mx-auto w-full pt-6 text-center text-xs text-slate-500">
        Enterprise Vendor & Customer Portal • Interactive 3D WebGL Canvas & Next.js 15
      </div>
    </div>
  );
}
