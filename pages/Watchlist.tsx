import React from 'react';
import { useStore } from '../context/Store';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';

const Watchlist: React.FC = () => {
  const { watchlist, removeFromWatchlist } = useStore();

  if (watchlist.length === 0) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h2 className="text-2xl font-bold text-white">Your list is empty</h2>
        <p className="mt-2 text-slate-400">Go explore and save some anime for later!</p>
        <Link to="/" className="mt-6 rounded-lg bg-primary px-6 py-3 font-bold text-white transition-transform hover:scale-105">
            Discover Anime
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-6 pb-24">
      <h1 className="mb-6 text-3xl font-bold text-white">My Watchlist <span className="text-lg font-normal text-slate-500">({watchlist.length})</span></h1>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {watchlist.map((item) => (
          <div key={item.mal_id} className="flex items-center gap-4 rounded-xl bg-surface p-3 transition-colors hover:bg-surface/80">
            <Link to={`/anime/${item.mal_id}`} className="shrink-0">
                <img src={item.image_url} alt={item.title} className="h-24 w-16 rounded-lg object-cover" />
            </Link>
            
            <div className="flex-1 overflow-hidden">
                <Link to={`/anime/${item.mal_id}`}>
                    <h3 className="mb-1 truncate font-bold text-white hover:text-primary">{item.title}</h3>
                </Link>
                <p className="text-xs text-slate-400">Added {new Date(item.added_at).toLocaleDateString()}</p>
            </div>

            <button 
                onClick={() => removeFromWatchlist(item.mal_id)}
                className="rounded-lg p-2 text-slate-500 hover:bg-red-500/10 hover:text-red-500"
            >
                <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Watchlist;
