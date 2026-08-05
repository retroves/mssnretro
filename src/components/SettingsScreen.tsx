import { useState } from 'react';
import { ArrowLeft, Globe, Shield, Music, CheckCircle2, AlertCircle } from 'lucide-react';
import { AppSettings, Language, ProfileFrame } from '@/types';

interface Props {
  settings: AppSettings;
  onChangeSettings: (s: AppSettings) => void;
  onBack: () => void;
}

const frames: { name: ProfileFrame; icon: string; color: string }[] = [
  { name: 'Windows XP', icon: '😊', color: 'bg-blue-500' },
  { name: 'Windows 7', icon: '😊', color: 'bg-blue-600' },
  { name: 'Windows Vista', icon: '😊', color: 'bg-indigo-500' },
  { name: 'iOS', icon: '😊', color: 'bg-violet-500' },
  { name: 'Android', icon: '😊', color: 'bg-purple-500' },
];

export default function SettingsScreen({ settings, onChangeSettings, onBack }: Props) {
  const [spotifyCheck, setSpotifyCheck] = useState<'idle' | 'checking' | 'ok' | 'error'>('idle');

  const checkSpotify = async () => {
    setSpotifyCheck('checking');
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/spotify-proxy?q=test&action=search`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` },
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && !data.error) {
        setSpotifyCheck('ok');
      } else {
        setSpotifyCheck('error');
      }
    } catch {
      setSpotifyCheck('error');
    }
  };
  const setLanguage = (lang: Language) =>
    onChangeSettings({ ...settings, language: lang });

  const setFrame = (frame: ProfileFrame) =>
    onChangeSettings({ ...settings, profileFrame: frame });

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-sky-300 to-blue-100">
      {/* Header */}
      <div className="bg-gradient-to-b from-sky-400 to-sky-300 px-3 py-3 flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
        >
          <ArrowLeft size={20} className="text-white" />
        </button>
        <h1 className="text-white font-bold text-lg">Ayarlar</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
        {/* Language */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Globe size={20} className="text-sky-500" />
            <span className="font-bold text-gray-800 text-base">Dil</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setLanguage('tr')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ${
                settings.language === 'tr'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>🇹🇷</span>
              <span>Türkçe</span>
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ${
                settings.language === 'en'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>🇬🇧</span>
              <span>English</span>
            </button>
          </div>
        </div>

        {/* Profile Frame */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="font-bold text-gray-800 text-base mb-3">Profil Çerçevesi</h2>
          <div className="space-y-1">
            {frames.map((frame, i) => (
              <button
                key={frame.name}
                onClick={() => setFrame(frame.name)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                  settings.profileFrame === frame.name
                    ? 'border-2 border-sky-400 bg-sky-50'
                    : i === 0
                    ? 'border border-gray-200 hover:bg-gray-50'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl ${frame.color} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-lg">{frame.icon}</span>
                </div>
                <span className="flex-1 text-left text-gray-800 font-medium text-sm">{frame.name}</span>
                {settings.profileFrame === frame.name && (
                  <svg className="w-5 h-5 text-sky-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Spotify Status */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Music size={20} className="text-green-600 flex-shrink-0" />
            <span className="font-bold text-gray-800 text-base">Spotify Bağlantısı</span>
          </div>
          <p className="text-gray-500 text-xs mb-3 leading-relaxed">
            Şarkı arama ve "dinliyorum" özelliği için Spotify Client ID ve Client Secret
            anahtarlarını Supabase projene SPOTIFY_CLIENT_ID ve SPOTIFY_CLIENT_SECRET olarak eklemen
            gerekir. Anahtarları spotify.com/dashboard'dan alabilirsin.
          </p>
          <button
            onClick={checkSpotify}
            disabled={spotifyCheck === 'checking'}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold text-sm py-2.5 rounded-xl transition-colors disabled:opacity-60"
          >
            {spotifyCheck === 'checking' ? 'Kontrol ediliyor...' : 'Bağlantıyı Kontrol Et'}
          </button>
          {spotifyCheck === 'ok' && (
            <div className="flex items-center gap-2 mt-2 text-green-600">
              <CheckCircle2 size={16} />
              <span className="text-sm font-medium">Spotify bağlantısı çalışıyor!</span>
            </div>
          )}
          {spotifyCheck === 'error' && (
            <div className="flex items-center gap-2 mt-2 text-red-500">
              <AlertCircle size={16} />
              <span className="text-sm font-medium">Anahtarlar eksik veya hatalı.</span>
            </div>
          )}
        </div>

        {/* 2FA */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <button className="w-full flex items-center gap-3">
            <Shield size={20} className="text-sky-500 flex-shrink-0" />
            <span className="font-medium text-gray-800 text-sm">İki Faktörlü Doğrulama</span>
          </button>
        </div>
      </div>
    </div>
  );
}
