import { Contact, Group, Message } from './types';


export const currentUser = {
  name: '[vinθηth]',
  email: 'selindmrcii5@gmail.com',
  displayName: 'Selin dmrcii',
  personalMessage: '★ keepin\' it retro ★',
  avatar: 'S',
  avatarColor: 'from-purple-500 to-indigo-600',
};

export const contacts: Contact[] = [
  {
    id: '1',
    name: 'sarah',
    displayName: '♥ Sarah ♥',
    status: 'online',
    statusText: 'lovin\' life',
    nowPlaying: 'Star by Madonna',
    avatar: 'S',
    avatarColor: 'bg-red-600',
  },
  {
    id: '2',
    name: 'steve',
    displayName: '★ Steve ★',
    status: 'away',
    statusText: 'Uzakta',
    nowPlaying: 'Fallin\' by Alicia K...',
    avatar: '😎',
    avatarColor: 'bg-blue-500',
  },
  {
    id: '3',
    name: 'mike',
    displayName: 'xX_mike_Xx',
    status: 'online',
    statusText: 'at the mall',
    avatar: 'M',
    avatarColor: 'bg-green-500',
  },
  {
    id: '4',
    name: 'jessica',
    displayName: 'jessica ~*~',
    status: 'offline',
    statusText: 'offline',
    avatar: 'J',
    avatarColor: 'bg-pink-500',
  },
  {
    id: '5',
    name: 'mom',
    displayName: 'Mom',
    status: 'online',
    statusText: 'home',
    avatar: 'M',
    avatarColor: 'bg-orange-400',
  },
  {
    id: '6',
    name: 'dad',
    displayName: 'Dad',
    status: 'offline',
    statusText: 'offline',
    avatar: 'D',
    avatarColor: 'bg-teal-600',
  },
  {
    id: '7',
    name: 'alex',
    displayName: 'alex_school',
    status: 'away',
    statusText: 'studying',
    avatar: 'A',
    avatarColor: 'bg-yellow-500',
  },
  {
    id: '8',
    name: 'emma',
    displayName: 'emma 💫',
    status: 'offline',
    statusText: 'offline',
    avatar: 'E',
    avatarColor: 'bg-violet-500',
  },
  {
    id: '9',
    name: 'tom',
    displayName: 'tomthecat',
    status: 'offline',
    statusText: 'offline',
    avatar: 'T',
    avatarColor: 'bg-gray-500',
  },
  {
    id: '10',
    name: 'lisa',
    displayName: 'lisa :)',
    status: 'offline',
    statusText: 'offline',
    avatar: 'L',
    avatarColor: 'bg-rose-400',
  },
];

export const groups: Group[] = [
  {
    id: 'friends',
    name: 'FRIENDS',
    online: 2,
    total: 4,
    expanded: false,
    contacts: [contacts[0], contacts[1], contacts[2], contacts[3]],
  },
  {
    id: 'family',
    name: 'FAMILY',
    online: 1,
    total: 2,
    expanded: false,
    contacts: [contacts[4], contacts[5]],
  },
  {
    id: 'school',
    name: 'SCHOOL',
    online: 1,
    total: 4,
    expanded: false,
    contacts: [contacts[6], contacts[7], contacts[8], contacts[9]],
  },
];

export const recentChats: Contact[] = [contacts[0], contacts[1], contacts[6]];

export const initialMessages: Message[] = [
  {
    id: '1',
    text: 'Deneme',
    fromMe: true,
    type: 'text',
    timestamp: new Date(),
  },
  {
    id: '2',
    text: '♪ listening to some tunes',
    fromMe: false,
    type: 'text',
    timestamp: new Date(),
  },
  {
    id: 'nudge1',
    text: '💥 Dürt gönderdin!',
    fromMe: true,
    type: 'nudge',
    timestamp: new Date(),
  },
  {
    id: '3',
    text: 'hey stop nudging me! 😄',
    fromMe: false,
    type: 'text',
    timestamp: new Date(),
  },
];
