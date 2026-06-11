import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
  ExternalLink, Clock, Zap, Trophy, Check, X, Loader2,
  RefreshCw, CheckCircle2, XCircle, Minus
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../hooks/useSocket';
import { useCountdown } from '../hooks/useCountdown';
import { Badge, Card, Button, Spinner } from '../components/ui';
import { getSocket } from '../services/socket';

const BattleRoom = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [match, setMatch] = useState(location.state?.matchData || null);
  const [p1Solved, setP1Solved] = useState(false);
  const [p2Solved, setP2Solved] = useState(false);
  const [result, setResult] = useState(null);
  const [checking, setChecking] = useState(false);
  const [reconnecting, setReconnecting] = useState(!match);

  const { formatted, isLow, isCritical, timeLeft } = useCountdown(
    match?.startTime,
    match?.duration || 30 * 60 * 1000
  );

  const myPlayer =
    match?.player1?.username === user?.username ? 'player1' : 'player2';
  const opponent = myPlayer === 'player1' ? match?.player2 : match?.player1;
  const myData = myPlayer === 'player1' ? match?.player1 : match?.player2;

  const { emit } = useSocket({
    match_started: (data) => {
      setMatch(data);
      setReconnecting(false);
    },
    match_rejoined: (data) => {
      setMatch(data);
      setReconnecting(false);
    },
    player_solved: ({ player, username }) => {
      if (player === 'player1') setP1Solved(true);
      else setP2Solved(true);
      toast.success(`🎉 ${username} solved the problem!`, { duration: 4000 });
    },
    match_ended: (data) => {
      setResult(data);
      if (user) {
        const myResult = data[myPlayer];
        if (myResult) updateUser({ rating: myResult.newRating });
      }
    },
    opponent_disconnected: ({ message }) => {
      toast(message, { icon: '👋', duration: 5000 });
    },
    verdict_checking: ({ message }) => {
      setChecking(false);
      toast(message, { icon: '🔍' });
    },
    error: ({ message }) => {
      toast.error(message);
      setReconnecting(false);
    },
  });

  useEffect(() => {
    if (!match && user) {
      setReconnecting(true);
      emit('reconnect_match', { roomId, userId: user._id });
    }
  }, [roomId, user]);

  const handleSubmitCheck = () => {
    setChecking(true);
    emit('submit_solution', { roomId });
    setTimeout(() => setChecking(false), 5000);
  };

  if (reconnecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-base">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-ink-secondary">Reconnecting to match...</p>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-base">
        <Card className="max-w-sm text-center">
          <XCircle className="w-10 h-10 text-rose mx-auto mb-3" />
          <h3 className="font-bold text-ink-primary mb-2">Match Not Found</h3>
          <p className="text-ink-secondary text-sm mb-4">This match doesn't exist or has ended.</p>
          <Button onClick={() => navigate('/battle')}>Back to Battle</Button>
        </Card>
      </div>
    );
  }

  // ── Result overlay ──────────────────────────────────────────────────────────
  if (result) {
    const isDraw = result.result === 'draw';
    const iWon = result.winner === user?.username;
    const myResult = result[myPlayer];
    const theirResult = result[myPlayer === 'player1' ? 'player2' : 'player1'];

    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-16 bg-surface-base">
        <div className="max-w-lg w-full text-center">
          <div className="glass p-10 relative overflow-hidden">
            {iWon && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-mustard/40 via-brand-400 to-mustard/40 rounded-t-2xl" />
            )}

            <div className="text-6xl mb-4">
              {isDraw ? '🤝' : iWon ? '🏆' : '💪'}
            </div>

            <h1 className="font-display font-bold text-4xl text-ink-primary mb-2">
              {isDraw ? "It's a Draw!" : iWon ? 'You Won!' : 'You Lost'}
            </h1>
            <p className="text-ink-secondary mb-8">
              {isDraw
                ? "Both players ran out of time"
                : iWon
                ? `You solved it first!`
                : `${result.winner} solved it first`}
            </p>

            {/* Ratings */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { label: 'You', data: myResult },
                { label: 'Opponent', data: theirResult },
              ].map(({ label, data }) => (
                <div key={label} className="bg-surface-warm border border-border rounded-xl p-4">
                  <p className="text-xs text-ink-muted mb-1">{label}</p>
                  <p className="font-bold text-ink-primary">{data?.username}</p>
                  <p className="font-mono text-sm text-ink-primary mt-1">{data?.newRating}</p>
                  <p className={`text-xs font-mono ${data?.ratingChange >= 0 ? 'text-sage' : 'text-rose'}`}>
                    {data?.ratingChange >= 0 ? '+' : ''}{data?.ratingChange}
                  </p>
                </div>
              ))}
            </div>

            {/* Problem */}
            {result.problem && (
              <a
                href={result.problem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-sm text-brand-500 hover:text-brand-600 mb-8"
              >
                <ExternalLink className="w-4 h-4" />
                View Problem: {result.problem.title}
              </a>
            )}

            <div className="flex gap-3">
              <Button onClick={() => navigate('/battle')} className="flex-1">
                <Zap className="w-4 h-4" />
                Battle Again
              </Button>
              <Button variant="secondary" onClick={() => navigate('/leaderboard')} className="flex-1">
                <Trophy className="w-4 h-4" />
                Leaderboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Active match ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen pt-20 pb-16 px-4 bg-surface-base">
      <div className="max-w-4xl mx-auto">
        {/* Timer bar */}
        <div className={`glass mb-6 p-4 flex items-center justify-between ${
          isCritical
            ? 'border-rose/60 bg-rose/5'
            : isLow
            ? 'border-mustard/40'
            : ''
        }`}>
          <div className="flex items-center gap-6">
            <div>
              <p className="text-xs text-ink-muted mb-0.5">Your handle</p>
              <p className="text-sm font-medium text-ink-primary font-mono">{myData?.codeforcesHandle || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-ink-muted mb-0.5">Opponent</p>
              <p className="text-sm font-medium text-ink-primary">{opponent?.username}</p>
            </div>
          </div>

          <div className={`flex items-center gap-2 font-mono text-3xl font-bold ${
            isCritical ? 'timer-critical' : isLow ? 'text-mustard' : 'text-ink-primary'
          }`}>
            <Clock className={`w-5 h-5 ${isLow ? 'animate-pulse' : ''}`} />
            {formatted}
          </div>

          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1.5">
              {p1Solved
                ? <Check className="w-4 h-4 text-sage" />
                : <div className="w-4 h-4 rounded-full border-2 border-border-strong animate-pulse" />}
              <span className={`text-xs ${p1Solved ? 'text-sage' : 'text-ink-muted'}`}>
                {match.player1?.username}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {p2Solved
                ? <Check className="w-4 h-4 text-sage" />
                : <div className="w-4 h-4 rounded-full border-2 border-border-strong animate-pulse" />}
              <span className={`text-xs ${p2Solved ? 'text-sage' : 'text-ink-muted'}`}>
                {match.player2?.username}
              </span>
            </div>
          </div>
        </div>

        {/* Problem card */}
        <Card className="mb-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="brand" className="font-mono">
                  {match.problem?.contestId}{match.problem?.index}
                </Badge>
                {match.problem?.rating && (
                  <Badge variant="yellow">⭐ {match.problem.rating}</Badge>
                )}
              </div>
              <h2 className="font-display font-bold text-xl text-ink-primary">{match.problem?.title}</h2>
            </div>
            <a
              href={match.problem?.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm px-4 py-2 flex-shrink-0"
            >
              <ExternalLink className="w-4 h-4" />
              Open Problem
            </a>
          </div>

          {/* Tags */}
          {match.problem?.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {match.problem.tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 rounded-md bg-surface-warm text-xs text-ink-secondary border border-border">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="pt-4 border-t border-border-light">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-dusty/8 border border-dusty/20">
              <RefreshCw className="w-4 h-4 text-dusty flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-dusty font-medium mb-1">How submissions work</p>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  Submit your solution on <strong>Codeforces</strong>, then click the button below.
                  We'll automatically check your CF submissions for an{' '}
                  <span className="text-sage font-medium">Accepted</span> verdict.
                  Polling runs every 15 seconds automatically.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Submit check button */}
        {!(p1Solved && myPlayer === 'player1') && !(p2Solved && myPlayer === 'player2') && (
          <div className="text-center">
            <Button
              onClick={handleSubmitCheck}
              loading={checking}
              className="px-8"
              disabled={checking || timeLeft === 0}
            >
              {checking ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  I Submitted on Codeforces
                </>
              )}
            </Button>
            <p className="text-xs text-ink-muted mt-2">
              We auto-poll every 15 seconds. Click to trigger an immediate check.
            </p>
          </div>
        )}

        {(p1Solved || p2Solved) && (
          <div className="glass p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-sage">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">
                {p1Solved && p2Solved
                  ? 'Both players solved!'
                  : p1Solved
                  ? `${match.player1?.username} solved it!`
                  : `${match.player2?.username} solved it!`}
              </span>
            </div>
            <p className="text-xs text-ink-muted mt-1">Waiting for match to finalize...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BattleRoom;
