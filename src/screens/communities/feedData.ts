export type PostTag = "Tip" | "Question" | "Looking" | "Sublet" | "Heads-up" | "Classifieds" | "Review";

export const POST_TAGS: PostTag[] = [
  "Tip", "Question", "Looking", "Sublet", "Heads-up", "Classifieds", "Review",
];

export const TAG_TONE: Record<PostTag, "neutral" | "accent" | "success" | "warn" | "danger"> = {
  "Tip": "success",
  "Question": "accent",
  "Looking": "accent",
  "Sublet": "neutral",
  "Heads-up": "warn",
  "Classifieds": "neutral",
  "Review": "neutral",
};

export type UserRole = "tenant" | "landlord" | "agent" | "admin";

export interface FeedUser {
  id: string;
  name: string;
  initials: string;
  role: UserRole;
  area: string;
  verified?: boolean;
  bio?: string;
  followers: number;
  following: number;
}

export interface FeedPost {
  id: string;
  authorId: string;
  tag: PostTag;
  area: string;
  body: string;
  photoLabel?: string;
  time: string;
  likes: number;
  comments: number;
  reposts: number;
  /** Whether the current user is following the author. */
  authorFollowed?: boolean;
}

export const USERS: FeedUser[] = [
  { id: "u-sipho",  name: "Sipho Dlamini",  initials: "SD", role: "tenant",   area: "Brixton",      verified: true,  followers: 312, following: 188, bio: "Software engineer · into kasi food + good landlords." },
  { id: "u-naledi", name: "Naledi Khumalo", initials: "NK", role: "tenant",   area: "Melville",     verified: true,  followers: 421, following: 220, bio: "Postgrad at Wits. Garden cottage hunter." },
  { id: "u-thandi", name: "Thandi Mokoena", initials: "TM", role: "landlord", area: "Brixton",      verified: true,  followers: 188, following: 64,  bio: "Owns three cottages in Brixton. Will fix the geyser before you ask." },
  { id: "u-lerato", name: "Lerato Pretorius", initials: "LP", role: "tenant", area: "Yeoville",     verified: false, followers: 56,  following: 142, bio: "Designer. Plant collector. Anti-deposit-fraud crusader." },
  { id: "u-pieter", name: "Pieter Kruger",  initials: "PK", role: "landlord", area: "Westdene",     verified: true,  followers: 78,  following: 22,  bio: "Garden cottages · Westdene. Pet-friendly always." },
  { id: "u-mxolisi", name: "Mxolisi Ndlovu", initials: "MN", role: "tenant",  area: "Pimville",     verified: false, followers: 33,  following: 80,  bio: "Backroom rentier. Loadshedding survivor." },
  { id: "u-naledi-agent", name: "Naledi M.", initials: "NM", role: "agent",   area: "Orlando West", verified: true,  followers: 542, following: 30,  bio: "Vilakazi Property Co. — 11 placements YTD." },
  { id: "u-aisha",  name: "Aisha Moosa",    initials: "AM", role: "tenant",   area: "Auckland Park", verified: true, followers: 198, following: 220, bio: "Wits postgrad. Cycling commuter. Looking for a 1-bed with parking." },
  { id: "u-kabelo", name: "Kabelo Dlamini", initials: "KD", role: "tenant",   area: "Greenside",    verified: true,  followers: 87,  following: 91,  bio: "Marketing lead. Pet dad." },
  { id: "u-ravi",   name: "Ravi Singh",     initials: "RS", role: "landlord", area: "Maboneng",     verified: true,  followers: 132, following: 18,  bio: "Lofts in Maboneng. Slow on email, fast on plumbers." },
];

export const POSTS: FeedPost[] = [
  {
    id: "p1", authorId: "u-sipho", tag: "Tip", area: "Brixton",
    body: "Plumber rec for Brixton: Sello on 071 322 0918. Replaced our geyser element same day, R 650 incl. callout. Send him my way if you're in the area.",
    time: "14m", likes: 24, comments: 6, reposts: 3, authorFollowed: true,
  },
  {
    id: "p2", authorId: "u-naledi", tag: "Looking", area: "Melville",
    body: "Looking for a 1-bed cottage / flatlet around Melville or Westdene. Budget R 6–7k. Move-in 1 Jun. Fibre + 1 parking bay. Quiet area preferred.",
    time: "47m", likes: 12, comments: 9, reposts: 4, authorFollowed: false,
  },
  {
    id: "p3", authorId: "u-mxolisi", tag: "Heads-up", area: "Pimville",
    body: "Eskom rolling stage 4 from 18:00 in zone 11 (Pimville). Charge your stuff. Generator-friendly hood watch meet on Sat 09:00, Kliptown Hall.",
    time: "1h", likes: 41, comments: 14, reposts: 22, authorFollowed: false,
  },
  {
    id: "p4", authorId: "u-thandi", tag: "Tip", area: "Brixton",
    body: "Reminder to my tenants: switch off geyser before holiday. Saved one of my places R 480 in standing electricity bill in April. Set the timer 04:00–06:00 + 17:00–20:00, it's enough.",
    photoLabel: "geyser timer schedule",
    time: "2h", likes: 56, comments: 8, reposts: 11, authorFollowed: true,
  },
  {
    id: "p5", authorId: "u-lerato", tag: "Classifieds", area: "Yeoville",
    body: "Selling: fridge (Defy 200L, two years old, works perfectly), 4-seater couch (faux leather, has one cat scratch), bar stool x2. R 3,200 the lot or split. Yeoville pickup only.",
    photoLabel: "fridge couch bar stool",
    time: "3h", likes: 18, comments: 22, reposts: 5, authorFollowed: false,
  },
  {
    id: "p6", authorId: "u-aisha", tag: "Question", area: "Auckland Park",
    body: "Landlord wants to keep R 1,200 of my deposit for 'general wear and tear' on a wall I never touched. RHA says wear & tear can't be deducted — anyone have a template letter that's worked?",
    time: "5h", likes: 87, comments: 41, reposts: 9, authorFollowed: false,
  },
  {
    id: "p7", authorId: "u-pieter", tag: "Review", area: "Westdene",
    body: "Five stars to Habitat's FICA flow. Onboarded a new tenant in 38 minutes flat — from application to signed lease. Used to take a week with PDFs and emails.",
    time: "Yesterday", likes: 33, comments: 4, reposts: 6, authorFollowed: true,
  },
  {
    id: "p8", authorId: "u-naledi-agent", tag: "Looking", area: "Orlando West",
    body: "I've got two tenant briefs open for Vilakazi / Mofolo — R 3–4k bracket, working professionals, both FICA'd. If you're an owner with a backroom sitting empty, ping me.",
    time: "Yesterday", likes: 12, comments: 7, reposts: 2, authorFollowed: false,
  },
  {
    id: "p9", authorId: "u-kabelo", tag: "Sublet", area: "Greenside",
    body: "Subletting my parking bay (covered, 24h secure access) Jun–Aug while I'm overseas. R 600/mo. Greenside Heights, near 7th Ave. DM if keen.",
    time: "Yesterday", likes: 8, comments: 3, reposts: 1, authorFollowed: false,
  },
  {
    id: "p10", authorId: "u-ravi", tag: "Tip", area: "Maboneng",
    body: "If you're a landlord and not using TPN consent at lease-start, you're leaving money on the table. Took me one bad tenant to learn — now every applicant gets pre-screened, no exceptions.",
    time: "2d", likes: 64, comments: 11, reposts: 18, authorFollowed: false,
  },
];

export function userById(id: string): FeedUser | undefined {
  return USERS.find((u) => u.id === id);
}
