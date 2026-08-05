import { useState, useEffect, useRef } from 'react';
import { X, Search, Music, Play, Loader2, AlertCircle } from 'lucide-react';
import { NowPlaying } from '@/types';

interface SpotifyTrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  albumArt: string;
  previewUrl: string | null;
  spotifyUrl: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (track: NowPlaying) => void;
}

export default function SpotifySearchModal({ open, onClose, onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setTracks([]);
      setError(null);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setPlayingId(null);
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setTracks([]);
      setError(null);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => searchTracks(query), 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const searchTracks = async (q: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/spotify-proxy?q=${encodeURIComponent(q)}&action=search`;
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Arama başarısız (${res.status})`);
      }

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setTracks(data.tracks || []);
    } catch (err: any) {
      setError(err.message || 'Şarkı aranırken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const togglePreview = (track: SpotifyTrack) => {
    if (playingId === track.id) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setPlayingId(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (!track.previewUrl) return;

    const audio = new Audio(track.previewUrl);
    audio.play().catch(() => {});
    audioRef.current = audio;
    setPlayingId(track.id);
  };

  const selectTrack = (track: SpotifyTrack) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    onSelect({
      trackName: track.name,
      artist: track.artist,
      albumArt: track.albumArt,
      spotifyUrl: track.spotifyUrl,
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="absolute inset-0 z-[60] flex flex-col bg-black/50" onClick={onClose}>
      <div
        className="mt-auto h-[88%] bg-gradient-to-b from-sky-50 to-white rounded-t-3xl flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-500 px-4 pt-4 pb-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Music size={22} className="text-white" />
              <span className="text-white font-bold text-base">Spotify'dan Şarkı Ara</span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
            >
              <X size={20} className="text-white" />
            </button>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2.5">
            <Search size={18} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Şarkı veya sanatçı ara..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              autoFocus
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
            />
            {loading && <Loader2 size={16} className="text-gray-400 animate-spin flex-shrink-0" />}
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto px-3 py-2">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-3 mb-2">
              <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
              <span className="text-red-600 text-sm">{error}</span>
            </div>
          )}

          {!error && !loading && query.trim() && tracks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Music size={40} className="mb-2 opacity-50" />
              <span className="text-sm">Sonuç bulunamadı</span>
            </div>
          )}

          {!error && !query.trim() && (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Search size={40} className="mb-2 opacity-50" />
              <span className="text-sm">Şarkı aramaya başla</span>
            </div>
          )}

          {tracks.map(track => (
            <div
              key={track.id}
              className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-sky-50 transition-colors"
            >
              {/* Album Art / Play */}
              <button
                onClick={() => togglePreview(track)}
                className="relative flex-shrink-0 group"
                disabled={!track.previewUrl}
              >
                {track.albumArt ? (
                  <img
                    src={track.albumArt}
                    alt={track.album}
                    className="w-12 h-12 rounded-lg object-cover shadow-sm"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                    <Music size={20} className="text-gray-400" />
                  </div>
                )}
                {track.previewUrl && (
                  <div className={`absolute inset-0 rounded-lg flex items-center justify-center transition-opacity ${
                    playingId === track.id ? 'bg-black/60' : 'bg-black/0 group-hover:bg-black/30'
                  }`}>
                    <Play
                      size={18}
                      className={`text-white ${playingId === track.id ? 'fill-white' : 'fill-white/0'}`}
                    />
                  </div>
                )}
              </button>

              {/* Track Info */}
              <button
                onClick={() => selectTrack(track)}
                className="flex-1 min-w-0 text-left"
              >
                <p className="text-gray-800 font-medium text-sm truncate">{track.name}</p>
                <p className="text-gray-500 text-xs truncate">{track.artist}</p>
                <p className="text-gray-400 text-xs truncate">{track.album}</p>
              </button>

              {/* Select Button */}
              <button
                onClick={() => selectTrack(track)}
                className="flex-shrink-0 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
              >
                Seç
              </button>
            </div>
          ))}
        </div>

        {/* Handle */}
        <div className="flex justify-center pb-2">
          <div className="w-32 h-1 bg-gray-300 rounded-full" />
        </div>
      </div>
    </div>
  );
}
