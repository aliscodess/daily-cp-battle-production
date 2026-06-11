import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swords, Zap, Users, Link2, Copy, Check, X, Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../hooks/useSocket';
import { Button, Card, Badge } from '../components/ui';

const RATINGS = [800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900];

const ratingColor = (r) => {
  if (r <= 1000) return { dot: 'bg-ink-muted',   ring: 'border-ink-muted',   text: 'text-ink-secondary'  };
  if (r <= 1200) return { dot: 'bg-sage',         ring: 'border-sage',        text: 'text-sage'           };
  if (r <= 1400) return { dot: 'bg-dusty',        ring: 'border-dusty',       text: 'text-dusty'          };
  if (r <= 1600) return { dot: 'bg-dusty',        ring: 'border-dusty',       text: 'text-dusty'          };
  if (r <= 1800) return { dot: 'bg-apricot',      ring: 'border-apricot',     text: 'text-apricot'        };
  return               { dot: 'bg-mustard',       ring: 'border-mustard',     text: 'text-mustard'        };
};

const Battle = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState(null);
  const [difficulty, setDifficulty] = useState(1200);
  const [inQueue, setInQueue] = useState(false);
  const [queueTime, setQueueTime] = useState(0);
  const [inviteCode, setInviteCode] = useState('');
  const [myInviteCode, setMyInviteCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!inQueue) return;
    const t = setInterval(() => setQueueTime((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, [inQueue]);

  const { emit } = useSocket({
    queue_joined: ({ position }) => {
      setInQueue(true);
      toast.success(`Joined queue! Position: ${position}`);
    },
    queue_left: () => {
      setInQueue(false);
      setQueueTime(0);
    },
    match_started: (matchData) => {
      setInQueue(false);
      toast.success('Match found! Entering battle room...');
      navigate(`/room/${matchData.roomId}`, { state: { matchData } });
    },
    invite_created: ({ inviteCode: code, roomId }) => {
      setMyInviteCode(code);
      setLoading(false);
    },
    error: ({ message }) => {
      toast.error(message);
      setInQueue(false);
      setLoading(false);
    },
  });

  const handleFindMatch = () => {
    if (!user?.codeforcesHandle) {
      toast.error('Please add your Codeforces handle in profile settings first');
      return;
    }
    emit('find_match', { difficulty });
    setMode('queue');
  };

  const handleCancelQueue = () => {
    emit('cancel_matchmaking');
    setMode(null);
    setInQueue(false);
    setQueueTime(0);
  };

  const handleCreateInvite = () => {
    if (!user?.codeforcesHandle) {
      toast.error('Please add your Codeforces handle in profile settings first');
      return;
    }
    setLoading(true);
    setMode('invite_create');
    emit('create_invite', { difficulty });
  };

  const handleJoinInvite = () => {
    if (!joinCode.trim()) return toast.error('Enter an invite code');
    if (!user?.codeforcesHandle) {
      toast.error('Please add your Codeforces handle in profile settings first');
      return;
    }
    setLoading(true);
    emit('join_invite', { inviteCode: joinCode.trim() });
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(myInviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Invite code copied!');
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 px-4 bg-surface-base">
        <Card className="max-w-md w-full text-center p-10">
          <Swords className="w-12 h-12 text-brand-400 mx-auto mb-4" />
          <h2 className="font-display font-bold text-xl text-ink-primary mb-2">Sign in to Battle</h2>
          <p className="text-ink-secondary text-sm mb-6">Create an account to start competing</p>
          <div className="flex gap-3">
            <a href="/register" className="btn-primary flex-1 justify-center">Create Account</a>
            <a href="/login" className="btn-secondary flex-1 justify-center">Sign In</a>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-surface-base">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-display font-bold text-4xl text-ink-primary mb-2">
            Find a <span className="text-brand-500">Battle</span>
          </h1>
          <p className="text-ink-secondary">Choose your difficulty and challenge an opponent</p>
          {!user.codeforcesHandle && (
            <div className="mt-4 px-4 py-3 rounded-xl bg-mustard/10 border border-mustard/30 text-mustard text-sm">
              ⚠️ Add your Codeforces handle in{' '}
              <a href={`/profile/${user.username}`} className="underline font-medium">profile settings</a>{' '}
              to submit solutions
            </div>
          )}
        </div>

        {/* Difficulty selector */}
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-muted">Problem Rating</h3>
            <span className={`font-mono font-bold text-lg ${ratingColor(difficulty).text}`}>{difficulty}</span>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {RATINGS.map((r) => {
              const c = ratingColor(r);
              const active = difficulty === r;
              return (
                <button
                  key={r}
                  onClick={() => setDifficulty(r)}
                  className={`relative py-3 rounded-xl border-2 text-center font-mono font-semibold text-sm transition-all duration-150 active:scale-95 ${
                    active
                      ? `${c.ring} bg-surface-warm ${c.text} shadow-card`
                      : 'border-border bg-surface-elevated text-ink-muted hover:border-border-strong hover:text-ink-secondary'
                  }`}
                >
                  {active && <span className={`absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full ${c.dot}`} />}
                  {r}
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-4 pt-3 border-t border-border-light">
            {[
              { label: 'Newbie',     range: '800–1000',  cls: 'bg-ink-muted'   },
              { label: 'Pupil',      range: '1100–1200', cls: 'bg-sage'        },
              { label: 'Specialist', range: '1300–1400', cls: 'bg-dusty'       },
              { label: 'Expert',     range: '1500–1600', cls: 'bg-dusty'       },
              { label: 'Candidate',  range: '1700–1800', cls: 'bg-apricot'     },
              { label: 'Master',     range: '1900',      cls: 'bg-mustard'     },
            ].map(({ label, range, cls }) => (
              <span key={label} className="flex items-center gap-1.5 text-xs text-ink-muted">
                <span className={`w-2 h-2 rounded-full ${cls}`} />
                {label} <span className="text-border-strong">{range}</span>
              </span>
            ))}
          </div>
        </Card>

        {/* Battle options */}
        {!mode && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card
              glow
              className="cursor-pointer hover:border-brand-300 transition-all"
              onClick={handleFindMatch}
            >
              <div className="flex flex-col items-center text-center py-4 gap-4">
                <div className="w-14 h-14 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center">
                  <Users className="w-7 h-7 text-brand-500" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-ink-primary">Quick Match</h3>
                  <p className="text-sm text-ink-secondary mt-1">Match with a random online player</p>
                </div>
                <Button className="w-full">
                  <Zap className="w-4 h-4" />
                  Find Match
                </Button>
              </div>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-apricot/15 border border-apricot/25 flex items-center justify-center">
                    <Link2 className="w-5 h-5 text-apricot" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-ink-primary">Invite Friend</h3>
                    <p className="text-xs text-ink-muted">Private battle with invite code</p>
                  </div>
                </div>

                <Button variant="secondary" onClick={handleCreateInvite} loading={loading && mode === 'invite_create'} className="w-full">
                  Create Invite
                </Button>

                <div className="flex gap-2">
                  <input
                    className="input flex-1 text-sm py-2"
                    placeholder="Enter code..."
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    maxLength={8}
                  />
                  <Button
                    variant="secondary"
                    onClick={handleJoinInvite}
                    loading={loading && mode === 'invite_join'}
                    className="px-4 py-2"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Queue state */}
        {inQueue && (
          <Card className="text-center py-12">
            <div className="relative inline-flex mb-6">
              <div className="w-20 h-20 rounded-full border-4 border-brand-100 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-brand-400 animate-spin" />
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-brand-400 border-t-transparent animate-spin" />
            </div>
            <h3 className="font-display font-bold text-xl text-ink-primary mb-1">Searching for opponent...</h3>
            <p className="text-ink-secondary text-sm mb-1 font-mono">{formatTime(queueTime)}</p>
            <p className="text-ink-muted text-xs mb-6">Difficulty: {difficulty} | Any rated player</p>
            <Button variant="danger" size="sm" onClick={handleCancelQueue}>
              <X className="w-4 h-4" />
              Cancel
            </Button>
          </Card>
        )}

        {/* Invite created state */}
        {mode === 'invite_create' && myInviteCode && !loading && (
          <Card className="text-center py-10">
            <Link2 className="w-10 h-10 text-apricot mx-auto mb-4" />
            <h3 className="font-display font-bold text-xl text-ink-primary mb-2">Invite Created!</h3>
            <p className="text-ink-secondary text-sm mb-6">Share this code with your friend</p>

            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="px-6 py-3 rounded-xl bg-surface-warm border border-border font-mono text-2xl font-bold text-ink-primary tracking-[0.2em]">
                {myInviteCode}
              </div>
              <button
                onClick={handleCopy}
                className="p-3 rounded-xl bg-surface-warm border border-border text-ink-muted hover:text-ink-primary hover:border-border-strong transition-colors"
              >
                {copied ? <Check className="w-5 h-5 text-sage" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-ink-muted mb-6">
              <Loader2 className="w-4 h-4 animate-spin" />
              Waiting for opponent to join...
            </div>

            <Button variant="secondary" size="sm" onClick={() => { setMode(null); setMyInviteCode(''); }}>
              Cancel
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Battle;
