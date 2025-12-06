import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WatchlistItem } from '../types';

interface StoreContextType {
  watchlist: WatchlistItem[];
  addToWatchlist: (item: WatchlistItem) => void;
  removeFromWatchlist: (mal_id: number) => void;
  isInWatchlist: (mal_id: number) => boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('aniSchedule_watchlist');
    if (stored) {
      setWatchlist(JSON.parse(stored));
    }
  }, []);

  const addToWatchlist = (item: WatchlistItem) => {
    setWatchlist((prev) => {
      const updated = [...prev, item];
      localStorage.setItem('aniSchedule_watchlist', JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromWatchlist = (mal_id: number) => {
    setWatchlist((prev) => {
      const updated = prev.filter((i) => i.mal_id !== mal_id);
      localStorage.setItem('aniSchedule_watchlist', JSON.stringify(updated));
      return updated;
    });
  };

  const isInWatchlist = (mal_id: number) => {
    return watchlist.some((i) => i.mal_id === mal_id);
  };

  return (
    <StoreContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
