import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Smile, Zap, Send, Music, Play } from 'lucide-react';
import { Contact, Message, StatusType, NowPlaying } from '@/types';
import { initialMessages } from '@/data';

interface Props {
  contact: Contact;
  onBack: () => void;
  myNowPlaying: NowPlaying | null;
  onOpenSpotify: () => void;
}

const statusColors: Record<StatusType, string> = {
  online: 'bg-green-500',
  away: 'bg-yellow-400',
  busy: 'bg-red-500',
  offline: 'bg-gray-400',
};

const statusLabels: Record<StatusType, string> = {
  online: 'Çevrimiçi',
  away: 'Uzakta',
  busy: 'Meşgul',
  offline: 'Çevrimdışı',
};

let msgIdCounter = 100;

export default function ChatScreen({ contact, onBack, myNowPlaying, onOpenSpotify }: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isNudging, setIsNudging] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    const msg: Message = {
      id: String(msgIdCounter++),
      text,
      fromMe: true,
      type: 'text',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, msg]);
    setInput('');
    setShowEmoji(false);

    setTimeout(() => {
      const reply: Message = {
        id: String(msgIdCounter++),
        text: getAutoReply(text),
        fromMe: false,
        type: 'text',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, reply]);
    }, 1200);
  };

  const sendNudge = () => {
    if (isNudging) return;
    setIsNudging(true);
    const msg: Message = {
      id: String(msgIdCounter++),
      text: '💥 Dürt gönderdin!',
      fromMe: true,
      type: 'nudge',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, msg]);
    setTimeout(() => setIsNudging(false), 3000);
  };

  const getAutoReply = (_text: string): string => {
    const replies = [
      'lol omg',
      'haha yeah!',
      'no way!!',
      'brb',
      'lmao 😂',
      'ikr!!',
      'omg same',
      ':)',
      'cool song btw',
      'what are you listening to?',
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const emojis = ['😀', '😂', '😍', '😎', '😭', '😡', '🥳', '🤔', '👍', '👎', '❤️', '💔', '🎵', '🔥', '✨', '⭐'];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-gradient-to-b from-sky-400 to-sky-300 px-3 py-2.5 flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors flex-shrink-0"
        >
          <ArrowLeft size={20} className="text-white" />
        </button>

        <div className="relative flex-shrink-0">
          <div className={`w-11 h-11 rounded-xl ${contact.avatarColor} flex items-center justify-center shadow-md">
            <span className="text-xl">{contact.avatar}</span>
          </div>
          <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-sky-300 ${statusColors[contact.status]}`} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-sm truncate">{contact.displayName}</p>
          <p className="text-sky-100 text-xs truncate">
            {statusLabels[contact.status]}{contact.nowPlaying ? ` · ♪ ${contact.nowPlaying}` : ''}
          </p>
        </div>

        <button
          onClick={sendNudge}
          className={`flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 shadow-sm hover:bg-sky-50 transition-all flex-shrink-0 ${isNudging ? 'animate-bounce' : ''}`}
        >
          <Zap size={14} className="text-yellow-500 fill-yellow-400" />
          <span className="text-sky-700 font-semibold text-sm">Dürt</span>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-sky-100 to-blue-50 px-3 py-3 space-y-2">
        {messages.map(msg => {
          if (msg.type === 'nudge') {
            return (
              <div key={msg.id} className="flex justify-center">
                <div className="bg-yellow-100 border border-yellow-300 rounded-full px-4 py-1.5 shadow-sm">
                  <span className="text-yellow-700 font-semibold text-sm">{msg.text}</span>
                </div>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex ${msg.fromMe ? 'justify-end' : 'justify-start'}`}
            >
              {!msg.fromMe && (
                <div className="mr-2 flex-shrink-0 self-end">
                  <div className={`w-7 h-7 rounded-lg ${contact.avatarColor} flex items-center justify-center">
                    <span className="text-xs">{contact.avatar}</span>
                  </div>
                </div>
              )}
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl shadow-sm ${
                  msg.fromMe
                    ? 'bg-sky-500 text-white rounded-br-md'
                    : 'bg-white text-gray-800 rounded-bl-md'
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* My Now Playing Bar (above input) */}
      {myNowPlaying && (
        <div className="bg-gradient-to-r from-green-600 to-green-500 px-3 py-2 flex items-center gap-2.5">
          {myNowPlaying.albumArt ? (
            <img src={myNowPlaying.albumArt} alt="" className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
          ) : (
            <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
              <Music size={16} className="text-white" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-xs truncate">
            ♪ {myNowPlaying.trackName}
            </p>
            <p className="text-green-100 text-xs truncate">{myNowPlaying.artist}</p>
          </div>
          <span className="flex items-center gap-1 text-green-100 text-xs flex-shrink-0">
            <Play size={12} className="fill-green-100" />
            <span className="flex gap-0.5">
              <span className="w-0.5 h-3 bg-white/80 animate-pulse" style={{ animationDelay: '0ms' }} />
              <span className="w-0.5 h-4 bg-white/80 animate-pulse" style={{ animationDelay: '150ms' }} />
              <span className="w-0.5 h-2 bg-white/80 animate-pulse" style={{ animationDelay: '300ms' }} />
              <span className="w-0.5 h-3.5 bg-white/80 animate-pulse" style={{ animationDelay: '450ms' }} />
            </span>
          </span>
        </div>
      )}

      {/* Emoji Picker */}
      {showEmoji && (
        <div className="bg-white border-t border-gray-200 px-3 py-2 grid grid-cols-8 gap-1">
          {emojis.map(e => (
            <button
              key={e}
              onClick={() => { setInput(prev => prev + e); setShowEmoji(false); }}
              className="text-xl py-1 hover:bg-gray-100 rounded transition-colors"
            >
              {e}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-3 py-2.5 flex items-center gap-2">
        <button
          onClick={() => setShowEmoji(!showEmoji)}
          className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors flex-shrink-0 ${showEmoji ? 'bg-sky-100' : 'hover:bg-gray-100'}`}
        >
          <Smile size={22} className="text-sky-400" />
        </button>
        <button
          onClick={onOpenSpotify}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-green-50 transition-colors flex-shrink-0"
          title="Spotify'dan şarkı paylaş"
        >
          <Music size={20} className="text-green-600" />
        </button>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Mesaj yaz..."
          className="flex-1 bg-gray-50 rounded-full px-4 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none border border-gray-200 focus:border-sky-400 transition-colors"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-sky-500 hover:bg-sky-600 transition-colors flex-shrink-0 disabled:opacity-40"
        >
          <Send size={16} className="text-white" />
        </button>
      </div>
    </div>
  );
}
