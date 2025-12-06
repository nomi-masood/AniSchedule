import React, { useEffect, useState } from 'react';
import { jikanService } from '../services/jikanService';
import { Anime } from '../types';
import AnimeCard from '../components/AnimeCard';
import SkeletonCard from '../components/SkeletonCard';
import { Link } from 'react-router-dom';
import { ChevronRight, Calendar } from 'lucide-react';

const Home: React.FC = () => {
  const [featured, setFeatured] = useState<Anime[]>([]);
  const [daily, setDaily] = useState<Anime[]>([]);
  const [upcoming, setUpcoming] = useState<Anime[]>([]);
  
  // Independent loading states for progressive rendering
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingDaily, setLoadingDaily] = useState(true);
  const [loadingUpcoming, setLoadingUpcoming] = useState(true);

  useEffect(() => {
    // 1. Fetch Featured (Top Airing)
    const fetchFeatured = async () => {
      try {
        const topRes = await jikanService.getTopAnime('airing');
        setFeatured(topRes.data.slice(0, 5));
      } catch (error) {
        console.error("Failed to load featured", error);
      } finally {
        setLoadingFeatured(false);
      }
    };

    // 2. Fetch Daily Schedule
    const fetchDaily = async () => {
      try {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const today = days[new Date().getDay()];
        const scheduleRes = await jikanService.getSchedule(today);
        setDaily(scheduleRes.data.slice(0, 12));
      } catch (error) {
        console.error("Failed to load daily", error);
      } finally {
        setLoadingDaily(false);
      }
    };

    // 3. Fetch Upcoming
    const fetchUpcoming = async () => {
      try {
        const upcomingRes = await jikanService.getTopAnime('upcoming');
        setUpcoming(upcomingRes.data.slice(0, 12));
      } catch (error) {
        console.error("Failed to load upcoming", error);
      } finally {
        setLoadingUpcoming(false);
      }
    };

    fetchFeatured();
    fetchDaily();
    fetchUpcoming();
  }, []);

  return (
    <div className="space-y-12 pb-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-10 blur-xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white md:text-3xl">Top Airing Now</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
             {loadingFeatured ? (
                <>
                  {/* Hero Skeleton */}
                  <div className="col-span-1 h-[400px] overflow-hidden rounded-2xl bg-surface/50 animate-pulse md:col-span-2 lg:col-span-2 md:h-[500px]">
                      <div className="h-full w-full bg-white/5" />
                  </div>
                  {/* Side List Skeleton */}
                  <div className="hidden flex-col gap-4 lg:flex">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex flex-1 gap-4 rounded-xl bg-surface/50 p-3 animate-pulse border border-white/5">
                            <div className="h-full w-24 rounded-lg bg-slate-700/50" />
                            <div className="flex flex-1 flex-col justify-center gap-2">
                                <div className="h-4 w-8 rounded bg-slate-700/50" />
                                <div className="h-5 w-3/4 rounded bg-slate-700/50" />
                                <div className="h-3 w-1/2 rounded bg-slate-700/50" />
                            </div>
                        </div>
                    ))}
                  </div>
                </>
             ) : (
                <>
                    {/* Main Hero Card */}
                    {featured[0] && (
                    <div className="group relative col-span-1 h-[400px] overflow-hidden rounded-2xl md:col-span-2 lg:col-span-2 md:h-[500px] shadow-2xl shadow-black/50">
                        <Link to={`/anime/${featured[0].mal_id}`}>
                            <img 
                                src={featured[0].images.webp.large_image_url} 
                                alt="Hero" 
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90"></div>
                            <div className="absolute bottom-0 p-6 md:p-10">
                                <span className="mb-2 inline-block rounded bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                                    #1 Trending
                                </span>
                                <h1 className="mb-2 text-3xl font-black text-white md:text-5xl line-clamp-2">
                                    {featured[0].title_english || featured[0].title}
                                </h1>
                                <p className="mb-4 max-w-xl text-sm text-slate-300 line-clamp-2 md:text-base">
                                    {featured[0].synopsis}
                                </p>
                                <div className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-bold text-black transition-transform hover:scale-105">
                                    View Details <ChevronRight size={16} />
                                </div>
                            </div>
                        </Link>
                    </div>
                    )}
                    
                    {/* Secondary Hero List */}
                    <div className="hidden flex-col gap-4 lg:flex">
                        {featured.slice(1, 4).map((anime, idx) => (
                            <Link key={anime.mal_id} to={`/anime/${anime.mal_id}`} className="flex flex-1 gap-4 rounded-xl bg-surface p-3 transition-colors hover:bg-surface/80 border border-white/5 hover:border-white/10">
                                <img src={anime.images.webp.image_url} className="h-full w-24 rounded-lg object-cover" alt="" />
                                <div className="flex flex-col justify-center">
                                    <span className="text-xs font-bold text-primary">#{idx + 2}</span>
                                    <h4 className="line-clamp-2 font-bold text-white">{anime.title_english || anime.title}</h4>
                                    <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                                        <span className="flex items-center gap-1"><Calendar size={10} /> {anime.type}</span>
                                        <span>•</span>
                                        <span>{anime.score} ★</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </>
             )}
          </div>
        </div>
      </section>

      {/* Daily Schedule */}
      <section className="container mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white md:text-2xl">Released Today</h2>
            <p className="text-sm text-slate-400">Fresh from Japan</p>
          </div>
          <Link to="/calendar" className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80">
            Full Schedule <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {loadingDaily 
                ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                : daily.map(anime => (
                    <AnimeCard key={anime.mal_id} anime={anime} />
                ))
            }
        </div>
      </section>

      {/* Upcoming Section */}
      <section className="container mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white md:text-2xl">Hype for Next Season</h2>
            <p className="text-sm text-slate-400">Add these to your watchlist</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {loadingUpcoming 
                ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                : upcoming.map(anime => (
                    <AnimeCard key={anime.mal_id} anime={anime} />
                ))
            }
        </div>
      </section>
    </div>
  );
};

export default Home;