import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Build Log',
      href: getBlogPermalink(),
    },
    {
      text: 'About',
      href: getPermalink('/about'),
    },
    {
      text: 'Get Involved',
      href: getPermalink('/get-involved'),
    },
  ],
  actions: [{ text: 'Contact', href: 'mailto:hello@davidtheproduct.com', target: '_blank' }],
};

export const footerData = {
  links: [
    {
      title: 'Navigate',
      links: [
        { text: 'Build Log', href: getBlogPermalink() },
        { text: 'About', href: getPermalink('/about') },
        { text: 'Get Involved', href: getPermalink('/get-involved') },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Contact', href: 'mailto:hello@davidtheproduct.com' },
  ],
  socialLinks: [
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
    { ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/davidtheproduct/howibuild' },
  ],
  footNote: `
    Build logs from the trenches · <a class="text-cyan-400 underline dark:text-cyan-400" href="mailto:hello@davidtheproduct.com">hello@davidtheproduct.com</a>
  `,
};
