import { useState } from 'react';
import { X, Camera, Image as ImageIcon, Bell, Moon, Globe, HelpCircle, LogOut, ChevronRight } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function StatusDrawer({ open, onClose }: Props) {
  const [twoFactor, setTwoFactor] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [nightMode, setNightMode] = useState(false);

  const menuItems = [
    { icon: Globe, label: 'Dil', value: 'Türkçe' },
    { icon: Bell, label: 'Bildirimler', toggle: notifications, onToggle: () => setNotifications(!notifications) },
    { icon: Moon, label: 'Gece Modu', toggle: nightMode, onToggle: () => setNightMode(!nightMode) },
    { icon: HelpCircle, label: 'Yardım' },
    { icon: LogOut, label: 'Çıkış Yap', danger: true },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`absolute right-0 top-0 bottom-0 w-72 bg-white z-50 shadow-2xl transition-transform duration-300 flex flex-col ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-b from-sky-400 to-sky-300 p-4 pt-5">
          <div className="flex justify-end mb-3">
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
            >
              <X size={20} className="text-white" />
            </button>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mb-2">
              <span className="text-white font-bold text-3xl">S</span>
            </div>
            <p className="text-white font-bold text-base">Selin dmrcii</p>
            <p className="text-sky-100 text-xs">selindmrcii5@gmail.com</p>
          </div>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto py-2">
          {menuItems.map((item, i) => (
            <button
              key={i}
              onClick={item.onToggle}
              className="w-full px-4 py-3.5 flex items-center gap-3 hover:bg-gray-50 transition-colors"
            >
              <item.icon size={20} className="text-sky-500 flex-shrink-0" />
              <span className={`flex-1 text-left text-sm font-medium ${item.danger ? 'text-red-500' : 'text-gray-700'}`}>
                {item.label}
              </span>
              {item.toggle !== undefined ? (
                <div
                  className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 flex-shrink-0 ${
                    item.toggle ? 'bg-sky-500' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                      item.toggle ? 'translate-x-5' : ''
                    }`}
                  />
                </div>
              ) : item.value ? (
                <span className="text-gray-400 text-sm">{item.value}</span>
              ) : !item.danger ? (
                <ChevronRight size={18} className="text-gray-300 flex-shrink-0" />
              ) : null}
            </button>
          ))}

          {/* 2FA Toggle */}
          <div className="px-4 py-3.5 flex items-center gap-3 hover:bg-gray-50 transition-colors">
            <Bell size={20} className="text-sky-500 flex-shrink-0" />
            <span className="flex-1 text-left text-sm font-medium text-gray-700">İki Faktörlü Doğrulama</span>
            <div
              onClick={() => setTwoFactor(!twoFactor)}
              className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 cursor-pointer ${
                twoFactor ? 'bg-sky-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                  twoFactor ? 'translate-x-5' : ''
                }`}
              />
            </div>
          </div>

          <div className="border-t border-gray-100 my-2" />

          <button className="w-full px-4 py-3.5 flex items-center gap-3 hover:bg-gray-50 transition-colors">
            <Camera size={20} className="text-sky-500 flex-shrink-0" />
            <span className="flex-1 text-left text-sm font-medium text-gray-700">Fotoğraf Çek</span>
          </button>
          <button className="w-full px-4 py-3.5 flex items-center gap-3 hover:bg-gray-50 transition-colors">
            <ImageIcon size={20} className="text-sky-500 flex-shrink-0" />
            <span className="flex-1 text-left text-sm font-medium text-gray-700">Galeriden Seç</span>
          </button>
        </div>
      </div>
    </>
  );
}
