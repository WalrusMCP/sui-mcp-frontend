"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, ShieldCheck, Rocket } from "lucide-react";
import { motion } from "framer-motion";

export default function Landing() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col">
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="flex-grow flex flex-col items-center justify-center px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl lg:text-6xl font-bold leading-tight max-w-4xl"
        >
          Chat. Sign. <span className="text-teal-400">Go On‑Chain</span>
        </motion.h1>

        <p className="mt-6 max-w-xl text-lg text-slate-300">
          <strong>SuiMCP</strong> lets anyone connect to Sui and execute
          transactions inside a single chat window — no extensions, no seed
          phrase.
        </p>

        <div className="mt-10 flex gap-4">
          <Button
            asChild
            size="lg"
            className="rounded-2xl px-8 py-6 text-lg"
          >
            <a
              href="https://app.suimcp.xyz"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get Early Access
            </a>
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className="rounded-2xl px-8 py-6 text-lg"
            asChild
          >
            <a href="#demo">Watch Demo</a>
          </Button>
        </div>

        <motion.img
          id="demo"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          src="/mock/chat-demo.png"
          alt="Sui chat‑wallet demo screenshot"
          className="mt-16 w-full max-w-4xl rounded-2xl shadow-2xl ring-1 ring-teal-500/20"
        />
      </section>

      {/* ── Features ───────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-slate-950/60 backdrop-blur">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<MessageCircle className="w-10 h-10" />}
            title="Chat‑Native UX"
            desc="Send, swap, stake — everything happens through messages. No context switching."
          />
          <FeatureCard
            icon={<ShieldCheck className="w-10 h-10" />}
            title="Self‑Custody Security"
            desc="Private keys never leave your device. Transactions are human‑readable before signing."
          />
          <FeatureCard
            icon={<Rocket className="w-10 h-10" />}
            title="60‑Second Onboarding"
            desc="Social login + biometrics let anyone spin up a wallet in under a minute."
          />
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-teal-600 text-slate-900 text-center">
        <h2 className="text-3xl lg:text-4xl font-semibold">
          Ready to chat with your wallet?
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg">
          Join the private beta and be among the first to experience seamless
          on‑chain interactions.
        </p>
        <Button
          size="lg"
          className="mt-8 rounded-2xl px-8 py-6 text-lg bg-slate-900 text-white hover:bg-slate-800"
          asChild
        >
          <a
            href="https://app.suimcp.xyz"
            target="_blank"
            rel="noopener noreferrer"
          >
            Join Waitlist
          </a>
        </Button>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="py-6 text-center text-sm text-slate-500 bg-slate-900/60">
        © {currentYear} SuiMCP. All rights reserved.
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <Card className="bg-slate-800/70 border-none shadow-lg ring-1 ring-slate-700/40">
      <CardContent className="p-8 flex flex-col items-center text-center gap-4">
        <div className="p-4 bg-teal-500/20 rounded-full text-teal-400">
          {icon}
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-slate-300">{desc}</p>
      </CardContent>
    </Card>
  );
}
