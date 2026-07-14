import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swords, Zap, Trophy, Users, Timer, ChevronRight, Code2, Globe, TrendingUp } from 'lucide-react';
import { matchesAPI } from '../services/api';
import { Card, Badge, Spinner } from '../components/ui';
import { useAuth } from '../context/AuthContext';

const FEATURES = [
  {
    icon: Swords,
    title: 'Real-Time Battles',
    desc: 'Challenge opponents live in 1v1 coding duels powered by Socket.IO.',
    color: 'text-brand-500',
    bg: 'bg-brand-50 border border-brand-100',
  },
  {
    icon: Code2,
    title: 'Codeforces Problems',
    desc: 'Fresh random problems from Codeforces API every match.',
    color: 'text-dusty',
    bg: 'bg-dusty/10 border border-dusty/20',
  },
  {
    icon: Zap,
    title: 'Elo Rating System',
    desc: 'Track progress with a competitive Elo rating system.',
    color: 'text-mustard',
    bg: 'bg-mustard/10 border border-mustard/20',
  },
  {
    icon: Trophy,
    title: 'Global Leaderboard',
    desc: 'Compete for top spots on the global rankings.',
    color: 'text-apricot',
    bg: 'bg-apricot/10 border border-apricot/20',
  },
  {
    icon: Globe,
    title: 'Invite System',
    desc: 'Challenge a specific friend with shareable invite codes.',
    color: 'text-sage',
    bg: 'bg-sage/10 border border-sage/20',
  },
  {
    icon: Timer,
    title: '30-Minute Sprints',
    desc: 'Intense timed matches that keep you on your toes.',
    color: 'text-brand-400',
    bg: 'bg-brand-50 border border-brand-100',
  },
];

const Landing = () => {
  const { user } = useAuth();
  const [liveMatches, setLiveMatches] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [loadingLive, setLoadingLive] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [live, recent] = await Promise.all([
          matchesAPI.getLive(),
          matchesAPI.getRecent(),
        ]);
        setLiveMatches(live.data.matches.slice(0, 5));
        setRecentMatches(recent.data.matches.slice(0, 5));
      } catch {
        // silently fail — optional data
      } finally {
        setLoadingLive(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-surface-base">
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        {/* Subtle warm wash */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-b from-brand-50/60 to-transparent" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-card border border-border text-ink-secondary text-sm font-medium mb-8 animate-fade-in shadow-card">

           
          </div>

          <h1 className="font-display font-bold text-5xl sm:text-6xl md:text-7xl text-ink-primary leading-tight mb-6 animate-slide-up">
            Code Faster.
            <br />
            <span className="text-brand-500">Battle Harder.</span>
          </h1>

          <p className="text-lg sm:text-xl text-ink-secondary mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.1s' }}>
            1v1 real-time competitive programming battles using Codeforces problems.
            Sharpen your skills, climb the leaderboard, and prove you're the fastest coder.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {user ? (
              <Link to="/battle" className="btn-primary text-lg px-8 py-4">
                <Swords className="w-5 h-5" />
                Start Battle
                <ChevronRight className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary text-lg px-8 py-4">
                  <Zap className="w-5 h-5" />
                  Get Started Free
                  <ChevronRight className="w-5 h-5" />
                </Link>
                <Link to="/leaderboard" className="btn-secondary text-lg px-8 py-4">
                  <Trophy className="w-5 h-5" />
                  View Rankings
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-ink-primary mb-4">
              Everything you need to compete
            </h2>
            <p className="text-ink-secondary max-w-lg mx-auto">
              A full-featured battle platform built for competitive programmers.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc, color, bg }) => (
              <Card key={title} glow className="group">
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <h3 className="font-display font-semibold text-ink-primary mb-2">{title}</h3>
                <p className="text-sm text-ink-secondary leading-relaxed">{desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Live Matches ─────────────────────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-sage animate-pulse" />
              <h2 className="font-display font-bold text-2xl text-ink-primary">Live Battles</h2>
            </div>
            <Link to="/battle" className="text-sm text-brand-500 hover:text-brand-600 flex items-center gap-1">
              Join battle <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loadingLive ? (
            <div className="flex justify-center py-12"><Spinner /></div>
          ) : liveMatches.length > 0 ? (
            <div className="space-y-2">
              {liveMatches.map((m, i) => (
                <div key={i} className="glass p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-sage animate-pulse flex-shrink-0" />
                    <span className="text-sm font-medium text-ink-primary">
                      {m.player1?.username} <span className="text-ink-muted">vs</span> {m.player2?.username}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {m.problem?.rating && <Badge variant="brand">{m.problem.rating}</Badge>}
                    <span className="text-xs text-ink-muted hidden sm:block truncate max-w-[160px]">
                      {m.problem?.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass p-8 text-center text-ink-muted">
              <Swords className="w-8 h-8 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No live battles right now. Be the first!</p>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      {!user && (
        <section className="py-20 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="glass p-12 relative overflow-hidden bg-surface-card">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-50/80 to-surface-warm/50 pointer-events-none rounded-2xl" />
              <h2 className="font-display font-bold text-3xl text-ink-primary mb-4 relative">
                Ready to battle?
              </h2>
              <p className="text-ink-secondary mb-8 relative">
                Join thousands of competitive programmers. Create your account and start your first battle today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center relative">
                <Link to="/register" className="btn-primary px-8 py-3">
                  <Zap className="w-4 h-4" />
                  Create Account
                </Link>
                <Link to="/login" className="btn-secondary px-8 py-3">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Landing;
