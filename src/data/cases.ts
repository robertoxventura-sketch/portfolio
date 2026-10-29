export type CaseStudy = {
  id: string;
  title: string;
  desc: string;
  client: string;
  metrics: { value: string; label: string }[];
  image: string;
  cover?: string;
  hero?: string;
  hoverSummary?: string;
  hoverTags?: string[];
  status?: { label: string; tone: "live" | "concept" | "delivered" };
};

export const cases: CaseStudy[] = [
  {
    id: "table-redesign",
    client: "PadPal",
    title: "Redesigning the Roommate Matching Experience.",
    desc: "PadPal is a 0→1 roommate-matching platform designed to make finding compatible roommates safer and more efficient. A preference survey filters candidates by essential criteria and uses weighted responses to rank compatible matches, while identity verification compares a live selfie with a submitted ID to confirm users’ identities before they can access the matching experience. Currently, the product is live and publicly accessible.",
    metrics: [{ value: "11→1", label: "tables unified" }],
    image: "/padpal.webp?v=2",
    cover: "/padpal-cover.mp4?v=2",
    hero: "/padpal-demo.mp4",
    hoverSummary:
      "A live roommate-matching web app that ranks compatible matches from a preference survey and verifies identity before people can connect.",
    hoverTags: ["Responsive Web Application"],
    status: { label: "Live", tone: "live" },
  },
  {
    id: "tokyo-afterfall",
    client: "Tokyo Afterfall",
    title: "Accessibility features for visually impaired players in handheld video games.",
    desc: "Tokyo Afterfall is a handheld video game concept that incorporates a high-contrast mode, heads-up display enlargement, and audio cues to assist visually impaired players through an interactive menu system.",
    metrics: [],
    image: "/case-tokyo-main.webp",
    cover: "/tokyo-afterfall-title.mp4",
    hoverSummary:
      "A handheld video game concept with a high-contrast mode, a larger heads-up display, and audio cues for visually impaired players.",
    hoverTags: ["Accessible Handheld Game"],
    status: { label: "Concept", tone: "concept" },
  },
  {
    id: "framer-components",
    client: "KinFinity",
    title: "A website for planning reunions and preserving family stories.",
    desc: "KinFinity is a website that helps families plan reunions, share updates, and preserve memories across generations.",
    metrics: [],
    image: "/kinfinity-cover.webp",
    cover: "/kinfinity-cover.mp4?v=2",
    hoverSummary:
      "KinFinity is a website that helps families plan reunions, share updates, and preserve memories across generations.",
    hoverTags: ["Website Design", "Reunion Planning"],
    status: { label: "Delivered", tone: "delivered" },
  },
  {
    id: "one-care",
    client: "One Care",
    title: "A reimagined urgent care check-in experience.",
    desc: "One Care is a reimagined urgent care experience hosted in a patient portal. It gives patients a remote check-in, a stage-by-stage estimate of the visit, and a waiting-room health score so they can arrive informed and spend less time in the lobby.",
    metrics: [],
    image: "/one-care-cover.webp",
    hoverSummary:
      "A patient portal concept for remote urgent-care check-in, a stage-by-stage wait estimate, and a waiting-room health score.",
    hoverTags: ["Patient Portal App"],
    status: { label: "Concept", tone: "concept" },
  },
];
