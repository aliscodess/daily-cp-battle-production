import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  User, Zap, Trophy, Swords, TrendingUp, TrendingDown,
  Minus, ExternalLink, Calendar, Edit2, Check, X, Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import { usersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Badge, Card, Spinner, EmptyState, Button, Input, OnlineDot } from '../components/ui';

const getRatingTier = (rating) => {
  if (rating >= 2400) return { label: 'Grandmaster',      color: 'red',     bg: 'bg-rose/10'    };
  if (rating >= 2100) return { label: 'Master',           color: 'orange',  bg: 'bg-apricot/10' };
  if (rating >= 1900) return { label: 'Candidate Master', color: 'yellow',  bg: 'bg-mustard/10' };
  if (rating >= 1600) return { label: 'Expert',           color: 'purple',  bg: 'bg-apricot/10' };
  if (rating >= 1400) return { label: 'Specialist',       color: 'cyan',    bg: 'bg-dusty/10'   };
  if (rating >= 1200) return { label: 'Pupil',            color: 'green',   bg: 'bg-sage/10'    };
  return                     { label: 'Newbie',           color: 'default', bg: 'bg-surface-warm' };
};

const ResultIcon = ({ result }) => {
  if (result === 'win')  return <TrendingUp   className="w-4 h-4 text-sage" />;
  if (result === 'loss') return <TrendingDown className="w-4 h-4 text-rose" />;
  return                        <Minus        className="w-4 h-4 text-ink-muted" />;
};

const Profile = () => {
  const { username } = useParams();
  const { user: authUser, updateUser } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile]   = useState(null);
  const [history, setHistory]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [editing, setEditing]   = useState(false);
  const [cfHandle, setCfHandle] = useState('');
  const [saving, setSaving]     = useState(false);

  const isOwn = authUser?.username === username;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [profileRes, historyRes] = await Promise.all([
          usersAPI.getProfile(username),
          usersAPI.getHistory(username),
        ]);
        setProfile(profileRes.data.user);
        setHistory(historyRes.data.history);
        setCfHandle(profileRes.data.user.codeforcesHandle || '');
      } catch (err) {
        if (err.response?.status === 404) setError('User not found');
        else setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [username]);

  const handleSaveCF = async () => {
    setSaving(true);
    try {
      const { data } = await usersAPI.updateMe({ codeforcesHandle: cfHandle });
      setProfile((p) => ({ ...p, codeforcesHandle: data.user.codeforcesHandle }));
      updateUser({ codeforcesHandle: data.user.codeforcesHandle });
      setEditing(false);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex justify-center bg-surface-base">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-4 bg-surface-base">
        <Card className="max-w-sm text-center">
          <User className="w-10 h-10 text-ink-muted mx-auto mb-3" />
          <h3 className="font-bold text-ink-primary mb-2">{error}</h3>
          <Button variant="secondary" onClick={() => navigate(-1)}>Go Back</Button>
        </Card>
      </div>
    );
  }

  const tier    = getRatingTier(profile.rating);
  const winRate = profile.totalMatches > 0
    ? Math.round((profile.wins / profile.totalMatches) * 100) : 0;

  const STATS = [
    { label: 'Rating',   value: profile.rating,        sub: tier.label, icon: Zap,          color: 'text-mustard' },
    { label: 'Wins',     value: profile.wins,                            icon: Trophy,        color: 'text-sage'    },
    { label: 'Losses',   value: profile.losses,                          icon: TrendingDown,  color: 'text-rose'    },
    { label: 'Win Rate', value: `${winRate}%`,                           icon: TrendingUp,    color: winRate >= 50 ? 'text-sage' : 'text-ink-muted' },
    { label: 'Matches',  value: profile.totalMatches,                    icon: Swords,        color: 'text-brand-500' },
    { label: 'Draws',    value: profile.draws,                           icon: Minus,         color: 'text-ink-muted' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-surface-base">
      <div className="max-w-4xl mx-auto">
        {/* Profile header */}
        <Card className="mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className={`w-20 h-20 rounded-2xl ${tier.bg} border border-border flex items-center justify-center`}>
                <span className="font-display font-bold text-3xl text-ink-primary">
                  {profile.username[0].toUpperCase()}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1">
                <OnlineDot online={profile.isOnline} />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h1 className="font-display font-bold text-2xl text-ink-primary">{profile.username}</h1>
                <Badge variant={tier.color}>{tier.label}</Badge>
                {profile.isOnline
                  ? <Badge variant="green">● Online</Badge>
                  : <span className="text-xs text-ink-muted">Last seen {new Date(profile.lastSeen).toLocaleDateString()}</span>
                }
              </div>

              {/* CF Handle */}
              {isOwn ? (
                <div className="flex items-center gap-2 mt-2">
                  {editing ? (
                    <>
                      <input
                        className="input py-1.5 text-sm max-w-[200px]"
                        value={cfHandle}
                        onChange={(e) => setCfHandle(e.target.value)}
                        placeholder="CF handle"
                      />
                      <button onClick={handleSaveCF} disabled={saving} className="p-1.5 rounded-lg bg-sage/15 text-sage hover:bg-sage/25">
                        {saving ? <Spinner size="sm" /> : <Check className="w-4 h-4" />}
                      </button>
                      <button onClick={() => setEditing(false)} className="p-1.5 rounded-lg bg-rose/10 text-rose hover:bg-rose/20">
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="text-sm text-ink-secondary font-mono">
                        {profile.codeforcesHandle || <span className="text-ink-muted italic">No CF handle</span>}
                      </span>
                      <button onClick={() => setEditing(true)} className="p-1 rounded text-ink-muted hover:text-ink-secondary">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              ) : profile.codeforcesHandle ? (
                <a
                  href={`https://codeforces.com/profile/${profile.codeforcesHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-brand-500 hover:text-brand-600 mt-2"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  {profile.codeforcesHandle}
                </a>
              ) : null}

              <div className="flex items-center gap-1.5 text-xs text-ink-muted mt-2">
                <Calendar className="w-3.5 h-3.5" />
                Joined {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
            </div>

            {/* Actions */}
            {isOwn && (
              <Link to="/battle" className="btn-primary text-sm flex-shrink-0">
                <Swords className="w-4 h-4" />
                Battle
              </Link>
            )}
          </div>
        </Card>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {STATS.map(({ label, value, sub, icon: Icon, color }) => (
            <Card key={label} className="text-center p-4">
              <Icon className={`w-4 h-4 ${color} mx-auto mb-2`} />
              <p className={`font-mono font-bold text-xl ${color}`}>{value}</p>
              <p className="text-xs text-ink-muted mt-0.5">{label}</p>
              {sub && <p className="text-xs text-ink-faint mt-0.5">{sub}</p>}
            </Card>
          ))}
        </div>

        {/* Match history */}
        <div>
          <h2 className="font-display font-bold text-xl text-ink-primary mb-4">Match History</h2>
          {history.length === 0 ? (
            <EmptyState
              icon={Swords}
              title="No matches yet"
              description="Complete your first battle to see your match history here."
              action={isOwn && <Link to="/battle" className="btn-primary text-sm">Start Battle</Link>}
            />
          ) : (
            <div className="space-y-2">
              {history.map((m, i) => (
                <div key={i} className={`glass p-4 flex items-center gap-4 border-l-2 ${
                  m.result === 'win'  ? 'border-sage' :
                  m.result === 'loss' ? 'border-rose' : 'border-border-strong'
                }`}>
                  <ResultIcon result={m.result} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-ink-primary">
                        vs {m.opponent}
                      </span>
                      <Badge
                        variant={m.result === 'win' ? 'green' : m.result === 'loss' ? 'red' : 'default'}
                        className="capitalize"
                      >
                        {m.result}
                      </Badge>
                    </div>
                    {m.problemTitle && (
                      <div className="flex items-center gap-1.5 mt-1">
                        {m.problemUrl ? (
                          <a
                            href={m.problemUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-ink-secondary hover:text-brand-500 flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            {m.problemTitle}
                          </a>
                        ) : (
                          <span className="text-xs text-ink-muted">{m.problemTitle}</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className={`font-mono text-sm font-bold ${
                      m.ratingChange > 0 ? 'text-sage' :
                      m.ratingChange < 0 ? 'text-rose' : 'text-ink-muted'
                    }`}>
                      {m.ratingChange > 0 ? '+' : ''}{m.ratingChange}
                    </span>
                    <p className="text-xs text-ink-muted mt-0.5 flex items-center justify-end gap-1">
                      <Clock className="w-3 h-3" />
                      {m.duration}m
                    </p>
                    <p className="text-xs text-ink-faint">
                      {new Date(m.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
