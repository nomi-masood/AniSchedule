import React from 'react';
import { NavLink } from 'react-router-dom';
import { CalendarDays, Home, Search, Heart, Tv } from 'lucide-react';

const Navbar: React.FC = () => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center justify-center gap-1 px-4 py-2 text-xs font-medium transition-colors md:flex-row md:gap-2 md:text-sm md:px-6 md:py-3 rounded-lg ${
      isActive ? 'text-primary bg-primary/10' : 'text-slate-400 hover:text-white hover:bg-white/5'
    }`;

  return (
    <>
      {/* Desktop Header */}
      <header className="sticky top-0 z-50 hidden border-b border-white/5 bg-background/80 backdrop-blur-lg md:block">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <NavLink to="/" className="flex items-center gap-2 text-xl font-bold tracking-tighter text-white">
            <Tv className="text-primary" size={24} />
            Ani<span className="text-primary">Schedule</span>
          </NavLink>

          <nav className="flex items-center gap-2">
            <NavLink to="/" className={linkClass}>
                <Home size={18} /> Home
            </NavLink>
            <NavLink to="/calendar" className={linkClass}>
                <CalendarDays size={18} /> Schedule
            </NavLink>
            <NavLink to="/search" className={linkClass}>
                <Search size={18} /> Search
            </NavLink>
            <NavLink to="/watchlist" className={linkClass}>
                <Heart size={18} /> Watchlist
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 justify-around border-t border-white/5 bg-background/95 backdrop-blur-lg px-2 pb-safe md:hidden">
        <NavLink to="/" className={linkClass}>
            <Home size={20} />
            <span>Home</span>
        </NavLink>
        <NavLink to="/calendar" className={linkClass}>
            <CalendarDays size={20} />
            <span>Schedule</span>
        </NavLink>
        <NavLink to="/search" className={linkClass}>
            <Search size={20} />
            <span>Search</span>
        </NavLink>
        <NavLink to="/watchlist" className={linkClass}>
            <Heart size={20} />
            <span>Saved</span>
        </NavLink>
      </nav>
    </>
  );
};

export default Navbar;
