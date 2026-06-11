import React from 'react';
import { Link } from 'react-router-dom';
import { Swords, Github, Heart } from 'lucide-react';

const Footer = () => (
  <footer className="border-t border-border mt-20 bg-surface-warm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center">
            <Swords className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-display font-bold text-ink-primary">CP<span className="text-brand-500">Battle</span></span>
        </div>

        <div className="flex items-center gap-6 text-sm text-ink-muted">
          <Link to="/" className="hover:text-ink-primary transition-colors">Home</Link>
          <Link to="/leaderboard" className="hover:text-ink-primary transition-colors">Leaderboard</Link>
          <Link to="/battle" className="hover:text-ink-primary transition-colors">Battle</Link>
        </div>

        <div className="flex items-center gap-2 text-xs text-ink-muted">
          <span>Built with</span>
          <Heart className="w-3 h-3 text-rose" />
          <span>by</span>
          <a
            href="https://github.com/aliscodess"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink-secondary hover:text-ink-primary flex items-center gap-1 transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            aliscodess
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
