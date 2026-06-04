import type { EPK } from '../../../../packages/schema'

export const createStarterEPK = (): EPK => ({
  slug: 'site',
  artistName: 'New Artist',
  pageTitle: 'New Artist | Official EPK',
  metadata: {
    title: 'New Artist | Official EPK',
    description: 'Official EPK for New Artist.',
  },
  branding: {
    logoText: 'New Artist',
    fontStyle: 'sans',
  },
  nav: ['home', 'music', 'videos', 'tour', 'about', 'contact'],
  home: {
    featuredRelease: {
      title: 'New Release',
      subtitle: 'Out now',
      coverImage: '/uploads/site/assets/release-cover.jpg',
    },
    showTourDatesOnHome: true,
    sectionsOnHome: ['music', 'videos', 'tour', 'about'],
  },
  music: {
    releases: [],
    gridColumns: '2',
  },
  videos: [],
  tour: {
    dates: [],
    dateDisplayFormat: 'long_month_day_year',
  },
  about: {
    shortBio: 'Add a short artist bio.',
    longBio: 'Add the full artist biography.',
    genres: [],
    awards: [],
    pressQuotes: [],
    pressPhotos: [],
  },
  footer: {
    socials: {},
    copyrightName: 'New Artist',
  },
  contact: {
    bookingEmail: 'booking@example.com',
  },
})
