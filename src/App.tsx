import { useState } from 'react';
import { HomeScreen, ChatScreen, SettingsScreen, StatusDrawer, SpotifySearchModal } from '@/components';
import { Contact, AppSettings, NowPlaying } from '@/types';

const defaultSettings: AppSettings = {
  language: 'tr',
  profileFrame: 'Windows XP',
};

export default function App() {
  const [screen, setScreen] = useState<'home' | 'chat' | 'settings'>('home');
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null);
  const [spotifyOpen, setSpotifyOpen] = useState(false);

  const openChat = (contact: Contact) => {
    setActiveContact(contact);
    setScreen('chat');
  };

  const backToHome = () => {
    setScreen('home');
    setActiveContact(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-black flex items-center justify-center p-4 sm:p-6">
      {/* Phone frame */}
      <div className="relative w-[390px] h-[844px] max-h-[95vh] bg-black rounded-[3rem] shadow-2xl overflow-hidden border-[10px] border-black sm:scale-90 md:scale-100">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-black rounded-b-2xl z-30" />

        {/* Screen content */}
        <div className="absolute inset-0 bg-white overflow-hidden">
          {screen === 'home' && (
            <HomeScreen
              onOpenChat={openChat}
              onOpenSettings={() => setScreen('settings')}
              onOpenSettingsDrawer={() => setDrawerOpen(true)}
              nowPlaying={nowPlaying}
              onOpenSpotify={() => setSpotifyOpen(true)}
              onClearNowPlaying={() => setNowPlaying(null)}
            />
          )}
          {screen === 'chat' && activeContact && (
            <ChatScreen
              contact={activeContact}
              onBack={backToHome}
              myNowPlaying={nowPlaying}
              onOpenSpotify={() => setSpotifyOpen(true)}
            />
          )}
          {screen === 'settings' && (
            <SettingsScreen
              settings={settings}
              onChangeSettings={setSettings}
              onBack={() => setScreen('home')}
            />
          )}

          <StatusDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
          <SpotifySearchModal
            open={spotifyOpen}
            onClose={() => setSpotifyOpen(false)}
            onSelect={(track) => setNowPlaying(track)}
          />
        </div>

        {/* Home indicator */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-600 rounded-full z-30" />
      </div>
    </div>
  );
}
