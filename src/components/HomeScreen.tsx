import { useState } from 'react';
import { Settings, Search, ChevronDown, Music, X } from 'lucide-react';
import { Contact, Group, StatusType, NowPlaying } from '@/types';
import { currentUser, groups as initialGroups, contacts, recentChats } from '@/data';

type Tab = 'all' | 'groups' | 'recent';

interface Props {
  onOpenChat: (contact: Contact) => void;
  onOpenSettings: () => void;
  onOpenSettingsDrawer: () => void;
  nowPlaying: NowPlaying | null;
  onOpenSpotify: () => void;
  onClearNowPlaying: () => void;
}

const statusColors: Record<StatusType, string> = {
  online: 'bg-green-500',
  away: 'bg-yellow-400',
  busy: 'bg-red-500',
  offline: 'bg-gray-400',
};

export default function HomeScreen({
  onOpenChat,
  onOpenSettings,
  onOpenSettingsDrawer,
  nowPlaying,
  onOpenSpotify,
  onClearNowPlaying,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('groups');
  const [groupsState, setGroupsState] = useState(initialGroups);
  const [statusOpen, setStatusOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<StatusType>('online');
  const [searchQuery, setSearchQuery] = useState('');

  const statusLabels: Record<StatusType, string> = {
    online: 'Çevrimiçi',
    away: 'Uzakta',
    busy: 'Meşgul',
    offline: 'Görünmez',
  };

  const toggleGroup = (id: string) => {
    setGroupsState(prev =>
      prev.map(g => g.id === id ? { ...g, expanded: !g.expanded } : g)
    );
  };

  const filteredContacts = contacts.filter(c =>
    c.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-sky-300 to-blue-100">
      {/* Header */}
      <div className="bg-gradient-to-b from-sky-400 to-sky-300 px-3 pt-3 pb-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-2xl">🦋</span>
            </div>
            <span className="text-sky-700 font-bold text-lg tracking-wide">msn</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSettingsDrawer}
              className="w-9 h-9 bg-white/60 rounded-full flex items-center justify-center shadow-sm hover:bg-white/80 transition-colors"
            >
              <Settings size={18} className="text-sky-700" />
            </button>
            <div className="relative">
              <button
                onClick={() => setStatusOpen(!statusOpen)}
                className="flex items-center gap-1.5 bg-white/80 rounded-full px-3 py-1.5 shadow-sm hover:bg-white transition-colors"
              >
                <span className={`w-2.5 h-2.5 rounded-full ${statusColors[currentStatus]}`} />
                <span className="text-sm font-medium text-sky-800">{statusLabels[currentStatus]}</span>
                <ChevronDown size={14} className="text-sky-600" />
              </button>
              {statusOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg overflow-hidden z-50 w-36">
                  {(Object.keys(statusLabels) as StatusType[]).map(s => (
                    <button
                      key={s}
                      onClick={() => { setCurrentStatus(s); setStatusOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-sky-50 transition-colors"
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${statusColors[s]}`} />
                      <span className="text-sm text-gray-700">{statusLabels[s]}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="flex items-start gap-3 mb-2">
          <div className="relative flex-shrink-0">
            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${currentUser.avatarColor} flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-2xl">{currentUser.avatar}</span>
            </div>
            <span className={`absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${statusColors[currentStatus]}`} />
          </div>
          <div className="flex-1 min-w-0 pt-1">
            <p className="text-sky-900 font-bold text-base truncate">{currentUser.name}</p>
            <p className="text-sky-600 text-xs truncate">♪ {currentUser.personalMessage}</p>
          </div>
        </div>

        {/* Now Playing Bar */}
        {nowPlaying ? (
          <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-xl px-3 py-2 flex items-center gap-2.5 mb-2 shadow-sm">
            {nowPlaying.albumArt ? (
              <img src={nowPlaying.albumArt} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                <Music size={18} className="text-white" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm truncate">
                ♪ {nowPlaying.trackName}
              </p>
              <p className="text-green-100 text-xs truncate">{nowPlaying.artist}</p>
            </div>
            <button
              onClick={onClearNowPlaying}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors flex-shrink-0"
            >
              <X size={16} className="text-white" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenSpotify}
            className="w-full bg-white/60 rounded-xl px-3 py-2 flex items-center gap-2 mb-2 hover:bg-white/80 transition-colors"
          >
            <Music size={16} className="text-green-600 flex-shrink-0" />
            <span className="text-sky-700 text-sm font-medium">Spotify'dan şarkı seç — dinliyorum:</span>
          </button>
        )}

        {/* Personal Message */}
        <div className="bg-white/60 rounded-xl px-3 py-2 flex items-center gap-2">
          <span className="text-sky-500 text-sm">✏</span>
          <span className="text-sky-700 italic text-sm">{currentUser.personalMessage}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white/50 px-2 py-1.5 flex gap-1">
        {(['all', 'groups', 'recent'] as Tab[]).map(tab => {
          const labels = { all: 'Tüm Kişiler', groups: 'Gruplar', recent: 'Son Sohbetler' };
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-sky-700 hover:bg-white/60'
              }`}
            >
              {labels[tab]}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1.5">
        {activeTab === 'groups' && groupsState.map(group => (
          <div key={group.id}>
            <button
              onClick={() => toggleGroup(group.id)}
              className="w-full bg-white/70 rounded-xl px-3 py-3 flex items-center justify-between hover:bg-white/90 transition-colors"
            >
              <span className="font-bold text-sky-800 text-sm">[+]{group.name}</span>
              <span className="text-sky-500 text-sm font-medium">{group.online} / {group.total}</span>
            </button>
            {group.expanded && (
              <div className="mt-1 space-y-1 pl-1">
                {group.contacts.map(contact => (
                  <button
                    key={contact.id}
                    onClick={() => onOpenChat(contact)}
                    className="w-full bg-white/80 rounded-xl px-3 py-2.5 flex items-center gap-3 hover:bg-white transition-colors"
                  >
                    <div className="relative flex-shrink-0">
                      <div className={`w-10 h-10 rounded-xl ${contact.avatarColor} flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{contact.avatar}</span>
                      </div>
                      <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${statusColors[contact.status]}`} />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-gray-800 font-medium text-sm truncate">{contact.displayName}</p>
                      <p className="text-gray-400 text-xs truncate">
                        {contact.statusText}{contact.nowPlaying ? ` · ♪ ${contact.nowPlaying}` : ''}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {activeTab === 'all' && (
          <div className="space-y-1">
            {filteredContacts.map(contact => (
              <button
                key={contact.id}
                onClick={() => onOpenChat(contact)}
                className="w-full bg-white/80 rounded-xl px-3 py-2.5 flex items-center gap-3 hover:bg-white transition-colors"
              >
                <div className="relative flex-shrink-0">
                  <div className={`w-10 h-10 rounded-xl ${contact.avatarColor} flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{contact.avatar}</span>
                  </div>
                  <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${statusColors[contact.status]}`} />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-gray-800 font-medium text-sm truncate">{contact.displayName}</p>
                  <p className="text-gray-400 text-xs truncate">
                    {contact.statusText}{contact.nowPlaying ? ` · ♪ ${contact.nowPlaying}` : ''}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {activeTab === 'recent' && (
          <div className="space-y-1">
            {recentChats.map(contact => (
              <button
                key={contact.id}
                onClick={() => onOpenChat(contact)}
                className="w-full bg-white/80 rounded-xl px-3 py-2.5 flex items-center gap-3 hover:bg-white transition-colors"
              >
                <div className="relative flex-shrink-0">
                  <div className={`w-10 h-10 rounded-xl ${contact.avatarColor} flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{contact.avatar}</span>
                  </div>
                  <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${statusColors[contact.status]}`} />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-gray-800 font-medium text-sm truncate">{contact.displayName}</p>
                  <p className="text-gray-400 text-xs truncate">
                    {contact.statusText}{contact.nowPlaying ? ` · ♪ ${contact.nowPlaying}` : ''}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-white/60 px-3 py-2.5 border-t border-sky-200/50">
        <div className="flex items-center gap-2 bg-white/80 rounded-xl px-3 py-2">
          <Search size={16} className="text-sky-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Ara & Web"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none"
          />
        </div>
      </div>
    </div>
  );
}
