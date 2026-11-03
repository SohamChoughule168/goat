export const site = {
  name: "ImaginarsClub Services",
  legalName: "ImaginarsClub Services",
  shortName: "ImaginarsClub",
  tagline: "Websites and applications for institutes that mean business",
  description:
    "Websites, student portals and admissions systems for coaching institutes, schools and edtech teams — built in Mumbai.",
  url: "https://www.imaginarsclubservices.com",
  founded: 2024,
  city: "Mumbai",
  email: "imaginarsclubs@gmail.com",
  phone: "+91 93728 09022",
  phoneHref: "+919372809022",
  whatsapp: "https://wa.me/919372809022",
  address: {
    line1: "3, Vikrant Residency",
    line2: "Near Station Road, Kanjur Marg East",
    city: "Mumbai",
    postalCode: "400042",
    country: "IN",
  },
  hours: {
    days: "Monday – Saturday",
    time: "9:00 AM – 7:00 PM IST",
    responseNote: "We reply to every enquiry within one business day.",
  } as const,
  geo: { lat: 19.1418, lng: 72.9365 },
  socials: [
    { label: "LinkedIn", href: "https://in.linkedin.com/company/imaginarsclubservices" },
  ],
  nav: [
    { label: "Services", href: "/services" },
    { label: "Work", href: "/work" },
    { label: "Pricing", href: "/pricing" },
    { label: "Insights", href: "/insights" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
} as const;

export type SiteConfig = typeof site;
