import React, { useState, useEffect } from 'react';
import { jikanService } from '../services/jikanService';
import { Anime } from '../types';
import AnimeCard from '../components/AnimeCard';
import SkeletonCard from '../components/SkeletonCard';

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const Schedule: React.FC = () => {
  const [activeDay, setActiveDay] = useState<string>(days[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]);
  const [schedule, setSchedule] = useState<Anime[]>([]);
  // Start loading as true to avoid "No releases" flash on initial render
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true);
      setSchedule([]); // Clear previous results immediately for clarity or keep them? Clearing makes skeletons appear
      try {
        const res = await jikanService.getSchedule(activeDay);
        setSchedule(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, [activeDay]);

  return (
    <div className="container mx-auto px-4 pt-6 pb-24">
      <h1 className="mb-6 text-3xl font-bold text-white">Weekly Schedule</h1>
      
      {/* Day Tabs */}
      <div className="mb-8 overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex min-w-max gap-2">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`rounded-full px-6 py-2 text-sm font-bold capitalize transition-all ${
                activeDay === day
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'bg-surface text-slate-400 hover:bg-surface/80 hover:text-white'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {loading ? (
             Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
        ) : schedule.length > 0 ? (
          schedule.map((anime) => <AnimeCard key={anime.mal_id} anime={anime} />)
        ) : (
           <div className="col-span-full py-12 text-center text-slate-500 bg-surface/30 rounded-xl border border-white/5">
              <p className="text-lg font-medium">No scheduled releases found for this day.</p>
              <p className="text-sm opacity-60">Try checking another day!</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default Schedule;