import type { SVGProps } from "react";

export type IconName =
  | "search" | "pin" | "bed" | "bath" | "sqm" | "heart" | "bell" | "chat" | "user"
  | "grid" | "map" | "sliders" | "plus" | "chevR" | "chevL" | "chevD" | "chevU"
  | "arrR" | "arrUR" | "check" | "x" | "upload" | "doc" | "home" | "key" | "settings"
  | "star" | "eye" | "calendar" | "cash" | "trend" | "inbox" | "users" | "logout"
  | "burger" | "list" | "filter" | "info" | "shield" | "sparkle" | "paper" | "park"
  | "pet" | "wifi" | "flame" | "edit" | "download" | "clock" | "bolt" | "trash"
  | "moon" | "sun";

const PATHS: Record<IconName, JSX.Element> = {
  search: <><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></>,
  pin: <><path d="M12 21s-7-7.5-7-12a7 7 0 1114 0c0 4.5-7 12-7 12z" /><circle cx="12" cy="9" r="2.5" /></>,
  bed: <><path d="M3 18V8m18 10v-4a3 3 0 00-3-3H3" /><path d="M3 14h18" /><circle cx="7.5" cy="11" r="1.5" /></>,
  bath: <><path d="M4 12h16v3a4 4 0 01-4 4H8a4 4 0 01-4-4v-3z" /><path d="M6 12V6a2 2 0 014 0" /><path d="M3 19l1 2m17-2l-1 2" /></>,
  sqm: <><rect x="4" y="4" width="16" height="16" rx="1" /><path d="M9 4v3M4 9h3M15 17h3M17 15v3" /></>,
  heart: <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 00-7.8 7.8l1 1.1L12 21.2l7.8-7.7 1-1.1a5.5 5.5 0 000-7.8z" />,
  bell: <><path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 01-3.5 0" /></>,
  chat: <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0116 0" /></>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  map: <><path d="M9 4l-6 2v14l6-2 6 2 6-2V4l-6 2z" /><path d="M9 4v14M15 6v14" /></>,
  sliders: <><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" /><circle cx="9" cy="6" r="2" fill="var(--paper)" /><circle cx="15" cy="12" r="2" fill="var(--paper)" /><circle cx="7" cy="18" r="2" fill="var(--paper)" /></>,
  plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
  chevR: <polyline points="9 6 15 12 9 18" />,
  chevL: <polyline points="15 6 9 12 15 18" />,
  chevD: <polyline points="6 9 12 15 18 9" />,
  chevU: <polyline points="6 15 12 9 18 15" />,
  arrR: <><line x1="5" y1="12" x2="19" y2="12" /><polyline points="13 6 19 12 13 18" /></>,
  arrUR: <><line x1="7" y1="17" x2="17" y2="7" /><polyline points="9 7 17 7 17 15" /></>,
  check: <polyline points="4 12 10 18 20 6" />,
  x: <><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></>,
  upload: <><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 5 17 10" /><line x1="12" y1="5" x2="12" y2="17" /></>,
  doc: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></>,
  home: <><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" /><path d="M9 21V12h6v9" /></>,
  key: <><circle cx="8" cy="15" r="4" /><path d="M11 12l9-9 2 2-2 2 2 2-3 3-2-2-3 3" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1A1.7 1.7 0 009 19.4a1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1A1.7 1.7 0 004.6 9a1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" /></>,
  star: <polygon points="12 2 15 9 22 10 17 15 18 22 12 18.5 6 22 7 15 2 10 9 9" />,
  eye: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><line x1="3" y1="10" x2="21" y2="10" /><line x1="8" y1="3" x2="8" y2="7" /><line x1="16" y1="3" x2="16" y2="7" /></>,
  cash: <><rect x="2" y="6" width="20" height="12" rx="1" /><circle cx="12" cy="12" r="3" /></>,
  trend: <><polyline points="3 17 9 11 13 15 21 7" /><polyline points="15 7 21 7 21 13" /></>,
  inbox: <><path d="M3 13l3-8h12l3 8" /><path d="M3 13v6a1 1 0 001 1h16a1 1 0 001-1v-6h-6l-2 2h-4l-2-2H3z" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M3 20a6 6 0 0112 0" /><circle cx="17" cy="9" r="2.5" /><path d="M14 16a4 4 0 017 2.7" /></>,
  logout: <><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>,
  burger: <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>,
  list: <><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><circle cx="4" cy="6" r="1" /><circle cx="4" cy="12" r="1" /><circle cx="4" cy="18" r="1" /></>,
  filter: <polygon points="22 3 2 3 10 12.5 10 19 14 21 14 12.5 22 3" />,
  info: <><circle cx="12" cy="12" r="9" /><line x1="12" y1="11" x2="12" y2="16" /><circle cx="12" cy="8" r="0.8" fill="currentColor" /></>,
  shield: <><path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z" /><polyline points="9 12 11 14 15 10" /></>,
  sparkle: <><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" /><path d="M19 17l.7 1.8L21.5 19.5l-1.8.7L19 22l-.7-1.8L16.5 19.5l1.8-.7z" /></>,
  paper: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="13" y2="17" /></>,
  park: <><circle cx="6" cy="17" r="2" /><circle cx="18" cy="17" r="2" /><path d="M3 17h2m4 0h6m4 0h2v-4l-2-3h-3V8H6l-3 4z" /></>,
  pet: <><circle cx="5" cy="11" r="1.7" /><circle cx="9" cy="6" r="1.7" /><circle cx="15" cy="6" r="1.7" /><circle cx="19" cy="11" r="1.7" /><path d="M8 19c-2 0-3-1.6-3-3 0-2 3-3 3-5h8c0 2 3 3 3 5 0 1.4-1 3-3 3-1.5 0-2-1-4-1s-2.5 1-4 1z" /></>,
  wifi: <><path d="M2 9a16 16 0 0120 0M5 13a11 11 0 0114 0M8.5 16.5a6 6 0 017 0" /><circle cx="12" cy="20" r="1" fill="currentColor" /></>,
  flame: <path d="M12 22a7 7 0 007-7c0-3-2-5-3-7 0 2-1 3-2 3s-1.5-1-1-3c-2 1-4 4-4 7a3 3 0 003 3 3 3 0 01-3-3 7 7 0 003 7z" />,
  edit: <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 113 3L7 19l-4 1 1-4z" /></>,
  download: <><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="3" x2="12" y2="15" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 14" /></>,
  bolt: <polygon points="13 2 4 14 11 14 11 22 20 10 13 10 13 2" />,
  trash: <><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /><path d="M10 11v6M14 11v6" /></>,
  moon: <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />,
  sun: <><circle cx="12" cy="12" r="4" /><line x1="12" y1="2" x2="12" y2="4" /><line x1="12" y1="20" x2="12" y2="22" /><line x1="4.9" y1="4.9" x2="6.3" y2="6.3" /><line x1="17.7" y1="17.7" x2="19.1" y2="19.1" /><line x1="2" y1="12" x2="4" y2="12" /><line x1="20" y1="12" x2="22" y2="12" /><line x1="4.9" y1="19.1" x2="6.3" y2="17.7" /><line x1="17.7" y1="6.3" x2="19.1" y2="4.9" /></>,
};

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  size?: number;
}

export default function Icon({ name, size = 18, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}
