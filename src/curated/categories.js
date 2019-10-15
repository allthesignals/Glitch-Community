import { CDN_URL } from 'Utils/constants';

// categories were a type of precursor to collections
// we have since replaced categories with collections,
// this ensures that old routes to categories point to new collections
// and shows particular custom names/illustrations for them
export default [
  { // not actively linked to just supporting old routes
    url: 'hello-worlds',
    collectionName: 'hello-worlds',
    icon: `${CDN_URL}/us-east-1%3Acba180f4-ee65-4dfc-8dd5-f143280d3c10%2Fcomputer.svg`,
    color: '#FCF3AF',
  },
  {
    url: 'games',
    collectionName: 'games',
    icon: `${CDN_URL}/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Ftetris.svg`,
    name: 'Games',
    color: '#fae3d1',
  },
  {
    url: 'building-blocks',
    collectionName: 'building-blocks',
    name: 'Building Blocks',
    color: '#65cad2',
    icon: `${CDN_URL}/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fbuilding-blocks.svg`,
  },
  {
    url: 'learn-to-code',
    collectionName: 'learn-to-code',
    name: 'Learn to Code',
    color: '#f8d3c8',
    icon: `${CDN_URL}/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Flearn.svg`,
  },
  {
    url: 'tools-for-work',
    collectionName: 'tools-for-work',
    name: 'Productivity',
    color: '#7aa4d3',
    icon: `${CDN_URL}/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fwork.svg`,
  },
  { // not actively linked to just supporting old routes
    url: 'community-picks',
    collectionName: 'community-picks',
    icon: `${CDN_URL}/us-east-1%3Acba180f4-ee65-4dfc-8dd5-f143280d3c10%2Fdiamond.svg`,
    color: '#9DE0FC',
  },
  {
    url: 'handy-bots',
    collectionName: 'bots',
    name: 'Bots',
    color: '#c7bff0',
    icon: `${CDN_URL}/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fbot.svg`,
  },
  {
    url: 'hardware',
    collectionName: 'hardware',
    name: 'Hardware',
    color: '#6cd8a9',
    icon: `${CDN_URL}/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fhardware.svg`,
  },
  {
    url: 'art',
    collectionName: 'art',
    color: '#f2a7bb',
    name: 'Art',
    icon: `${CDN_URL}/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fart.svg`,
  },
  {
    url: 'music',
    collectionName: 'music',
    color: '#a9c4f7',
    name: 'Music',
    icon: `${CDN_URL}/50f784d9-9995-4fa4-a185-b4b1ea6e77c0%2Fmusic.svg`,
  },
];
