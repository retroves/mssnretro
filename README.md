# MSN Retro

A nostalgic MSN Messenger-inspired mobile chat UI built with React, TypeScript, Tailwind CSS, and Vite.

## Features

- **Home Screen**: Contact list with groups (Friends, Family, School), status indicators, personal message, and now-playing music bar
- **Chat Screen**: Message bubbles, nudge (Dürt) feature, emoji picker, Spotify song sharing
- **Settings Screen**: Language selection (TR/EN), profile frame picker, Spotify connection status checker
- **Status Drawer**: Slide-out menu with profile, 2FA toggle, notifications, night mode
- **Spotify Integration**: Search songs, preview 30-second clips, set "now playing" status with album art

## Spotify Setup

To enable the song search feature, add these secrets to your Supabase project:

- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`

Get them from [spotify.com/dashboard](https://developer.spotify.com/dashboard).

## Tech Stack

- React 18 + TypeScript
- Tailwind CSS 3
- Vite 5
- Supabase (Edge Functions for Spotify API proxy)
- lucide-react (icons)

## Getting Started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
