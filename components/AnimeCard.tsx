import React from 'react';
import { Link } from 'react-router-dom';
import { Anime } from '../types';
import { Play, Star, Calendar } from 'lucide-react';

interface AnimeCardProps {
  anime: Anime;
  showRank?: boolean;
}

const AnimeCard: React.FC<AnimeCardProps> = ({ anime, showRank }) => {
  const title = anime.title_english || anime.title;
  const isAiring = anime.airing;

  return (
    <Link to={`/anime/${anime.mal_id}`} className="group relative block h-[380px] w-full overflow-hidden rounded-xl bg-surface transition-transform hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/20">
      {/* Image Background */}
      <div className="absolute inset-0 h-full w-full">
        <img
          src={anime.images.webp.large_image_url}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      {/* Badges */}
      <div className="absolute left-3 top-3 flex gap-2">
        {isAiring && (
            <span className="flex items-center gap-1 rounded-full bg-secondary/90 px-2 py-1 text-xs font-bold text-white shadow-sm backdrop-blur-sm">
            <Play size={10} className="fill-current" /> Airing
            </span>
        )}
        <span className="flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs font-bold text-white backdrop-blur-sm">
            <Star size={10} className="fill-yellow-400 text-yellow-400" /> {anime.score || 'N/A'}
        </span>
      </div>

      {/* Rank Badge */}
      {showRank && anime.rank && (
          <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary font-bold text-white shadow-lg">
              #{anime.rank}
          </div>
      )}

      {/* Content */}
      <div className="absolute bottom-0 w-full p-4">
        <div className="mb-1 flex items-center gap-2 text-xs font-medium text-slate-300">
            <span>{anime.type || 'TV'}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
                <Calendar size={12} /> {anime.year || 'TBA'}
            </span>
        </div>
        <h3 className="line-clamp-2 text-lg font-bold leading-tight text-white group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="mt-2 line-clamp-2 text-xs text-slate-400">
            {anime.genres.map(g => g.name).join(', ')}
        </p>
      </div>
    </Link>
  );
};

export default AnimeCard;
