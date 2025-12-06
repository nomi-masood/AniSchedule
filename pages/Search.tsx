import React, { useState, useEffect } from 'react';
import { jikanService } from '../services/jikanService';
import { Anime, AnimeGenre } from '../types';
import AnimeCard from '../components/AnimeCard';
import { Search as SearchIcon, Filter, X } from 'lucide-react';
import Loading from '../components/Loading';

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Filter States
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  
  // Data Options
  const [genres, setGenres] = useState<AnimeGenre[]>([]);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Generate Year Options (Next year down to 1980)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 46 }, (_, i) => currentYear + 1 - i);

  // Fetch Genres on Mount
  useEffect(() => {
    jikanService.getAnimeGenres().then(res => {
        setGenres(res.data);
    }).catch(err => console.error("Failed to load genres", err));
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(timer);
  }, [query]);

  // Search Effect
  useEffect(() => {
    const search = async () => {
      // Don't search if everything is empty
      if (!debouncedQuery && !type && !status && !selectedGenre && !selectedYear) return;
      
      setLoading(true);
      try {
        let startDate = undefined;
        let endDate = undefined;

        if (selectedYear) {
            startDate = `${selectedYear}-01-01`;
            endDate = `${selectedYear}-12-31`;
        }

        const res = await jikanService.searchAnime(
            debouncedQuery, 
            type, 
            status, 
            selectedGenre,
            startDate,
            endDate
        );
        setResults(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    search();
  }, [debouncedQuery, type, status, selectedGenre, selectedYear]);

  const clearFilters = () => {
      setType('');
      setStatus('');
      setSelectedGenre('');
      setSelectedYear('');
      setQuery('');
  };

  const hasActiveFilters = type || status || selectedGenre || selectedYear || query;

  return (
    <div className="container mx-auto px-4 pt-6 pb-24">
       <div className="sticky top-0 z-30 -mx-4 mb-6 bg-background/95 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:static md:mx-0 md:bg-transparent md:p-0">
          <div className="flex flex-col gap-4">
              {/* Search Input */}
              <div className="relative w-full">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search anime title..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-surface py-3 pl-10 pr-12 text-white placeholder-slate-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                  />
                  {query && (
                      <button 
                        onClick={() => setQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                      >
                          <X size={16} />
                      </button>
                  )}
              </div>

              {/* Filters Grid */}
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5">
                  <select 
                    value={type} 
                    onChange={(e) => setType(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-surface px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none hover:bg-surface/80 transition-colors appearance-none cursor-pointer"
                  >
                      <option value="">All Types</option>
                      <option value="tv">TV Series</option>
                      <option value="movie">Movies</option>
                      <option value="ova">OVA</option>
                      <option value="special">Special</option>
                      <option value="ona">ONA</option>
                  </select>
                  
                  <select 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-surface px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none hover:bg-surface/80 transition-colors appearance-none cursor-pointer"
                  >
                      <option value="">All Status</option>
                      <option value="airing">Airing Now</option>
                      <option value="complete">Finished</option>
                      <option value="upcoming">Upcoming</option>
                  </select>

                  <select 
                    value={selectedGenre} 
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-surface px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none hover:bg-surface/80 transition-colors appearance-none cursor-pointer"
                  >
                      <option value="">All Genres</option>
                      {genres.map(g => (
                          <option key={g.mal_id} value={g.mal_id}>{g.name}</option>
                      ))}
                  </select>

                  <select 
                    value={selectedYear} 
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-surface px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none hover:bg-surface/80 transition-colors appearance-none cursor-pointer"
                  >
                      <option value="">Any Year</option>
                      {years.map(y => (
                          <option key={y} value={y}>{y}</option>
                      ))}
                  </select>

                  {/* Clear Button (Visible on Desktop/Grid) */}
                   <button 
                        onClick={clearFilters}
                        disabled={!hasActiveFilters}
                        className={`col-span-2 md:col-span-1 flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold transition-colors ${hasActiveFilters ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border-red-500/20' : 'text-slate-500 opacity-50 cursor-not-allowed'}`}
                   >
                       <X size={16} /> Clear
                   </button>
              </div>
          </div>
       </div>

       {loading ? (
           <Loading />
       ) : (
           <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {results.map((anime) => (
                  <AnimeCard key={anime.mal_id} anime={anime} />
              ))}
              {results.length === 0 && hasActiveFilters && (
                  <div className="col-span-full py-12 text-center text-slate-500">
                      No results found matching your criteria.
                  </div>
              )}
               {results.length === 0 && !hasActiveFilters && (
                  <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
                       <div className="mb-6 rounded-full bg-surface p-6 shadow-xl shadow-black/20">
                            <Filter className="text-primary" size={48} />
                       </div>
                       <h3 className="text-2xl font-bold text-white">Find your next obsession</h3>
                       <p className="mt-2 text-slate-400 max-w-sm">Use the filters above to search by genre, year, type, or specific title.</p>
                  </div>
              )}
           </div>
       )}
    </div>
  );
};

export default Search;
