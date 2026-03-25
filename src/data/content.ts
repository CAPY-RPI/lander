export type NavItem = {
  label: string;
  href: string;
};

export type FeatureCardModel = {
  title: string;
  body: string;
  className?: string;
};

export const assets = {
  logo: "/assets/brand/capy-full-white.svg",
  campusArt: "/assets/illustrations/campus-art.svg",
  ctaSecondary: "/assets/ui/cta-secondary.svg",
  emailPill: "/assets/ui/email-pill.svg",
  navPill: "/assets/ui/nav-pill.svg",
  capyVerticalMark: "/assets/brand/capy-full-primary.svg",
  x: "/assets/social/x.svg",
  instagram: "/assets/social/instagram.svg",
  facebook: "/assets/social/facebook.svg",
  github: "/assets/social/github.svg",
  tiktok: "/assets/social/tiktok.svg",
  youtube: "/assets/social/youtube.svg",
};

export const navItems: NavItem[] = [
  { label: "home", href: "#launch" },
  { label: "features", href: "#features" },
  { label: "interface", href: "#interface" },
  { label: "contact", href: "#contact" },
];

export const primaryCards: FeatureCardModel[] = [
  {
    title: "join clubs that speak out to your tastes (literally)",
    body: "connect with clubs at your fingertips. we help you join organizations faster than you scrolling to the next reel",
    className: "cardTall",
  },
  {
    title: "sync and swim",
    body: "no more manual roles and \"who are you?\" pings. we handle your club entry, permissions, and onboarding before you even check your mentions.",
    className: "cardWide",
  },
  {
    title: "data, minus the entry",
    body: "see how your organization is actually growing. real-time engagement stats and member insights without the spreadsheet headache.",
    className: "cardWide",
  },
  {
    title: "find events you want to go to",
    body: "whether you are motivated by friends, food, or both, we have a directory for you to find the next move in your sleep",
    className: "cardShort",
  },
  {
    title: "we are your campus passport",
    body: "one profile to rule them all. from discord badges to club leadership roles, we tally your impact so you can prove your grind to the world.",
    className: "cardWideBottom",
  },
];
