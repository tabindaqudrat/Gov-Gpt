export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Numainda",
  description:
    "A chatbot that answers questions about Pakistan's constitution, elections act, and parliamentary proceedings.",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Chat",
      href: "/chat",
    },
    {
      title: "About",
      href: "/about",
    },
    {
      title: "Proceedings",
      href: "/proceedings",
    },
    {
      title: "Bills",
      href: "/bills",
    },
  ],
  links: {
    twitter: "https://twitter.com/codeforpakistan",
    github: "https://github.com/codeforpakistan/numainda-next",
  },
}
