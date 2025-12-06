import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { jikanService } from '../services/jikanService';
import { geminiService } from '../services/geminiService';
import { Anime } from '../types';
import Loading from '../components/Loading';
import { useStore } from '../context/Store';
import { Play, Calendar, Star, Heart, Share2, Sparkles } from 'lucide-react';

const Details: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiInsight, setAiInsight] = useState<string>('');
  const [insightLoading, setInsightLoading] = useState(false);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useStore();

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      setLoading(true);
      setAiInsight(''); // Reset AI state
      try {
        const res = await jikanService.getAnimeDetails(parseInt(id));
        setAnime(res.data);
      } catch (error) {
        console.error("Error details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleGetInsight = async () => {
    if (!anime) return;
    setInsightLoading(true);
    const text = await geminiService.getAnimeInsight(anime.title, anime.synopsis || "No synopsis available.");
    setAiInsight(text);
    setInsightLoading(false);
  };

  if (loading || !anime) return <Loading />;

  const isSaved = isInWatchlist(anime.mal_id);
  const title = anime.title_english || anime.title;

  return (
    <div className="pb-24">
      {/* Backdrop */}
      <div className="relative h-[30vh] w-full md:h-[40vh]">
        {anime.trailer?.images?.maximum_image_url ? (
           <img src={anime.trailer.images.maximum_image_url} alt="backdrop" className="h-full w-full object-cover" />
        ) : (
           <img src={anime.images.webp.large_image_url} alt="backdrop" className="h-full w-full object-cover blur-sm" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="container mx-auto -mt-24 px-4 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
            {/* Poster Card */}
            <div className="flex-shrink-0 w-48 md:w-64 mx-auto md:mx-0">
                <img 
                    src={anime.images.webp.large_image_url} 
                    alt={title} 
                    className="w-full rounded-xl shadow-2xl border-4 border-surface" 
                />
                <button 
                    onClick={() => isSaved ? removeFromWatchlist(anime.mal_id) : addToWatchlist({
                        mal_id: anime.mal_id,
                        title: title,
                        image_url: anime.images.webp.large_image_url,
                        added_at: Date.now()
                    })}
                    className={`mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-colors ${isSaved ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'bg-primary text-white hover:bg-primary/90'}`}
                >
                    <Heart className={isSaved ? "fill-current" : ""} size={20} />
                    {isSaved ? "Saved" : "Add to Watchlist"}
                </button>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-6">
                <div>
                    <h1 className="text-3xl font-black text-white md:text-5xl">{title}</h1>
                    <p className="text-lg text-slate-400 mt-1">{anime.title_japanese}</p>
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1 rounded-full bg-surface px-3 py-1 text-slate-300 border border-white/5">
                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                        <span className="font-bold text-white">{anime.score}</span>
                        <span className="text-slate-500">({anime.scored_by?.toLocaleString()} users)</span>
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-surface px-3 py-1 text-slate-300 border border-white/5">
                        <Calendar size={14} />
                        <span>{anime.year}</span>
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-surface px-3 py-1 text-slate-300 border border-white/5">
                        <Play size={14} />
                        <span>{anime.type} ({anime.episodes || '?'} eps)</span>
                    </div>
                     <div className="flex items-center gap-1 rounded-full bg-surface px-3 py-1 text-slate-300 border border-white/5">
                        <span>{anime.status}</span>
                    </div>
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2">
                    {anime.genres.map(g => (
                        <span key={g.mal_id} className="text-xs font-semibold px-2 py-1 rounded bg-white/5 text-slate-300 hover:bg-white/10 cursor-default">
                            {g.name}
                        </span>
                    ))}
                </div>

                {/* Synopsis */}
                <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white">Synopsis</h3>
                    <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                        {anime.synopsis}
                    </p>
                </div>

                {/* AI Insight Section */}
                <div className="rounded-xl bg-gradient-to-br from-violet-900/20 to-fuchsia-900/20 border border-primary/20 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                            <Sparkles className="text-primary" /> AI Insight
                        </h3>
                        {!aiInsight && (
                            <button 
                                onClick={handleGetInsight}
                                disabled={insightLoading}
                                className="px-4 py-1.5 rounded-lg bg-primary/20 text-primary text-sm font-semibold hover:bg-primary/30 disabled:opacity-50"
                            >
                                {insightLoading ? "Analyzing..." : "Generate Review"}
                            </button>
                        )}
                    </div>
                    
                    {aiInsight ? (
                         <div className="bg-background/50 rounded-lg p-4 text-slate-200 text-sm leading-relaxed border border-white/5 animate-in fade-in slide-in-from-bottom-2">
                            "{aiInsight}"
                            <div className="mt-2 text-xs text-slate-500 text-right">- Gemini 2.5 Flash</div>
                         </div>
                    ) : (
                        <p className="text-sm text-slate-500 italic">
                            Want a quick reason to watch? Ask our AI assistant for a 2-second pitch.
                        </p>
                    )}
                </div>

                {/* Trailer */}
                {anime.trailer?.embed_url && (
                    <div className="space-y-2">
                         <h3 className="text-lg font-bold text-white">Trailer</h3>
                         <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
                            <iframe 
                                src={anime.trailer.embed_url} 
                                title="Trailer" 
                                className="h-full w-full"
                                allowFullScreen
                            />
                         </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
