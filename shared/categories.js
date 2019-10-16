// categories were a type of precursor to collections
// we have since replaced categories with collections,
// this ensures that old routes to categories point to new collections
// and shows particular custom names/illustrations for them
// We currently use these categories on the search page, on the onboarding banner, and on the create page

module.exports = [
  {
    url: 'hello-worlds',
    name: 'Hello Worlds',
    collectionName: 'hello-worlds',
    icon: `/us-east-1%3Acba180f4-ee65-4dfc-8dd5-f143280d3c10%2Fcomputer.svg`,
    color: '#FCF3AF',
    id: 'hello-worlds',
  },
  {
    url: 'games',
    collectionName: 'games',
    icon: `/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Ftetris.svg`,
    name: 'Games',
    color: '#FBA058',
    id: 'games',
  },
  {
    url: 'building-blocks',
    collectionName: 'building-blocks',
    name: 'Building Blocks',
    color: '#65cad2',
    icon: `/0fe043a8-1c51-4b42-ac88-f11facc21980%2Fbuilding-blocks.svg?v=15711672`,
    id: 'building-blocks',
  },
  {
    url: 'learn-to-code',
    collectionName: 'learn-to-code',
    name: 'Learn to Code',
    color: '#f8d3c8',
    icon: `/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Flearn.svg`,
    id: 'learn-to-code',
  },
  {
    url: 'tools-for-work',
    collectionName: 'tools-for-work',
    name: 'Productivity',
    color: '#7aa4d3',
    icon: `/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fwork.svg`,
    id: 'tools-for-work',
  },
  {
    url: 'community-picks',
    name: 'Community Picks',
    collectionName: 'community-picks',
    icon: `/us-east-1%3Acba180f4-ee65-4dfc-8dd5-f143280d3c10%2Fdiamond.svg`,
    color: '#9DE0FC',
    id: 'community-picks',
  },
  {
    url: 'handy-bots',
    collectionName: 'bots',
    name: 'Bots',
    color: '#c7bff0',
    icon: `/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fbot.svg`,
    id: 'handy-bots',
  },
  {
    url: 'hardware',
    collectionName: 'hardware',
    name: 'Hardware',
    color: '#6cd8a9',
    icon: `/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fhardware.svg`,
    id: 'hardware',
  },
  {
    url: 'art',
    collectionName: 'art',
    color: '#f2a7bb',
    name: 'Art',
    icon: `/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fart.svg`,
    id: 'art',
  },
  {
    url: 'music',
    collectionName: 'music',
    color: '#a9c4f7',
    name: 'Music',
    icon: `/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fmusic.svg`,
    id: 'music',
  },
];
