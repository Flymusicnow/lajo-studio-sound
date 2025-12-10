import { useState, useRef } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import AnimatedSection from './AnimatedSection';

interface Track {
  id: string;
  title: string;
  artist: string;
  genre: string;
  duration: string;
  // Using placeholder audio - in production, replace with real tracks
  audioUrl: string;
}

const tracks: Track[] = [
  {
    id: '1',
    title: 'Midnight Dreams',
    artist: 'Artist A',
    genre: 'Pop',
    duration: '3:45',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: '2',
    title: 'Electric Soul',
    artist: 'Artist B',
    genre: 'R&B',
    duration: '4:12',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: '3',
    title: 'Northern Lights',
    artist: 'Artist C',
    genre: 'Electronic',
    duration: '5:30',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
  {
    id: '4',
    title: 'Acoustic Horizon',
    artist: 'Artist D',
    genre: 'Indie',
    duration: '3:58',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  },
];

const Portfolio = () => {
  const { t } = useLanguage();
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayPause = (track: Track) => {
    if (currentTrack === track.id && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      if (audioRef.current) {
        audioRef.current.src = track.audioUrl;
        audioRef.current.play();
      }
      setCurrentTrack(track.id);
      setIsPlaying(true);
    }
  };

  return (
    <section className="py-24 md:py-32">
      <div className="container px-6">
        <AnimatedSection>
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-center mb-4">
            {t('portfolio.title')}
          </h2>
          <p className="text-muted-foreground font-sans text-center max-w-xl mx-auto mb-4">
            {t('portfolio.subtitle')}
          </p>
          <div className="w-16 h-[1px] bg-primary mx-auto mb-16" />
        </AnimatedSection>

        {/* Audio element (hidden) */}
        <audio 
          ref={audioRef} 
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />

        {/* Track list */}
        <div className="max-w-3xl mx-auto space-y-4">
          {tracks.map((track, index) => (
            <AnimatedSection key={track.id} delay={index * 100}>
              <div 
                className={`group flex items-center gap-4 p-4 border transition-all duration-300 cursor-pointer ${
                  currentTrack === track.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => handlePlayPause(track)}
              >
                {/* Play button */}
                <button 
                  className={`w-12 h-12 flex items-center justify-center border transition-all ${
                    currentTrack === track.id && isPlaying
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'border-border text-muted-foreground group-hover:border-primary group-hover:text-primary'
                  }`}
                >
                  {currentTrack === track.id && isPlaying ? (
                    <Pause size={20} />
                  ) : (
                    <Play size={20} className="ml-1" />
                  )}
                </button>

                {/* Track info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-sans font-medium truncate">{track.title}</h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {track.artist} · {track.genre}
                  </p>
                </div>

                {/* Duration */}
                <span className="text-sm text-muted-foreground font-sans">
                  {track.duration}
                </span>

                {/* Playing indicator */}
                {currentTrack === track.id && isPlaying && (
                  <Volume2 size={16} className="text-primary animate-pulse" />
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Note */}
        <AnimatedSection delay={400}>
          <p className="text-center text-sm text-muted-foreground mt-8 font-sans">
            {t('portfolio.note')}
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default Portfolio;
