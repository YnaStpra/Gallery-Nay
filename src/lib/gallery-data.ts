export type GalleryPhoto = {
  id: string;
  title: string;
  story: string;
  imageUrl: string;
  alt: string;
  location: string;
  country: string;
  takenAt: string;
  collection: string;
  camera: string;
  lens: string;
  focalLength: string;
  aperture: string;
  shutterSpeed: string;
  iso: number;
  dimensions: string;
  fileType: string;
  colorProfile: string;
  dominantColor: string;
  copyright: string;
};

export const galleryPhotos: GalleryPhoto[] = [
  {
    id: "sanur-morning-tide",
    title: "Morning Tide at Sanur",
    story: "Soft tide lines and early boats before the beach gets loud.",
    imageUrl:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=88",
    alt: "Calm tropical shoreline with blue water and a pale morning sky.",
    location: "Sanur, Bali",
    country: "Indonesia",
    takenAt: "12 Aug 2025",
    collection: "Coastline Notes",
    camera: "Sony A7 IV",
    lens: "FE 24-70mm f/2.8 GM II",
    focalLength: "35mm",
    aperture: "f/5.6",
    shutterSpeed: "1/640",
    iso: 100,
    dimensions: "6000 x 4000",
    fileType: "WEBP display copy",
    colorProfile: "Display P3",
    dominantColor: "#6fb6c9",
    copyright: "(c) Yan Saputra",
  },
  {
    id: "rinjani-ridge-light",
    title: "Rinjani Ridge Light",
    story: "A thin strip of warm light crossing the ridge after sunrise.",
    imageUrl:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=86",
    alt: "Layered mountain valley with warm sunlight and blue haze.",
    location: "Mount Rinjani, Lombok",
    country: "Indonesia",
    takenAt: "03 Sep 2025",
    collection: "Highland Routes",
    camera: "Sony A7 IV",
    lens: "FE 70-200mm f/4 G OSS II",
    focalLength: "112mm",
    aperture: "f/8",
    shutterSpeed: "1/320",
    iso: 160,
    dimensions: "6000 x 4000",
    fileType: "WEBP display copy",
    colorProfile: "sRGB",
    dominantColor: "#8c9a76",
    copyright: "(c) Yan Saputra",
  },
  {
    id: "toraja-mist",
    title: "Toraja Mist",
    story: "Morning fog lifting from a valley of timber houses and rice fields.",
    imageUrl:
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1400&q=86",
    alt: "Green forest valley covered in low morning mist.",
    location: "Tana Toraja, South Sulawesi",
    country: "Indonesia",
    takenAt: "19 Oct 2025",
    collection: "Sulawesi Field Notes",
    camera: "Fujifilm X-T5",
    lens: "XF 16-55mm f/2.8",
    focalLength: "24mm",
    aperture: "f/4",
    shutterSpeed: "1/250",
    iso: 320,
    dimensions: "7728 x 5152",
    fileType: "WEBP display copy",
    colorProfile: "sRGB",
    dominantColor: "#4f6f46",
    copyright: "(c) Yan Saputra",
  },
  {
    id: "karst-passage",
    title: "Karst Passage",
    story: "River light reflecting under limestone cliffs outside Makassar.",
    imageUrl:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1400&q=86",
    alt: "A quiet lake surrounded by mountains and trees.",
    location: "Rammang-Rammang, Maros",
    country: "Indonesia",
    takenAt: "06 Nov 2025",
    collection: "Sulawesi Field Notes",
    camera: "Sony A7 IV",
    lens: "FE 16-35mm f/2.8 GM II",
    focalLength: "22mm",
    aperture: "f/7.1",
    shutterSpeed: "1/500",
    iso: 100,
    dimensions: "6000 x 4000",
    fileType: "WEBP display copy",
    colorProfile: "Display P3",
    dominantColor: "#2f7f7b",
    copyright: "(c) Yan Saputra",
  },
  {
    id: "sumba-grassland",
    title: "Sumba Grassland",
    story: "Dry-season grass moving in rows across an open hill.",
    imageUrl:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=86",
    alt: "Wide desert road and warm hills under a clear sky.",
    location: "Wairinding Hill, Sumba",
    country: "Indonesia",
    takenAt: "22 Jul 2025",
    collection: "Open Roads",
    camera: "Fujifilm X-T5",
    lens: "XF 23mm f/1.4",
    focalLength: "23mm",
    aperture: "f/2.8",
    shutterSpeed: "1/1000",
    iso: 125,
    dimensions: "7728 x 5152",
    fileType: "WEBP display copy",
    colorProfile: "sRGB",
    dominantColor: "#b58b4c",
    copyright: "(c) Yan Saputra",
  },
  {
    id: "komodo-pink-shore",
    title: "Komodo Pink Shore",
    story: "Clear water and coral sand after the afternoon boats leave.",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=86",
    alt: "Open landscape with water, trees, and warm sunlight.",
    location: "Labuan Bajo, Flores",
    country: "Indonesia",
    takenAt: "14 May 2025",
    collection: "Coastline Notes",
    camera: "Sony A7 IV",
    lens: "FE 24-70mm f/2.8 GM II",
    focalLength: "50mm",
    aperture: "f/6.3",
    shutterSpeed: "1/800",
    iso: 100,
    dimensions: "6000 x 4000",
    fileType: "WEBP display copy",
    colorProfile: "Display P3",
    dominantColor: "#c79882",
    copyright: "(c) Yan Saputra",
  },
  {
    id: "city-rain-study",
    title: "City Rain Study",
    story: "Reflections, umbrellas, and neon fragments during a late walk.",
    imageUrl:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=86",
    alt: "Dark blue mountain scene under a starry night sky.",
    location: "Singapore",
    country: "Singapore",
    takenAt: "02 Jan 2026",
    collection: "Night Walks",
    camera: "Ricoh GR III",
    lens: "18.3mm f/2.8",
    focalLength: "28mm eq.",
    aperture: "f/2.8",
    shutterSpeed: "1/125",
    iso: 800,
    dimensions: "6000 x 4000",
    fileType: "WEBP display copy",
    colorProfile: "sRGB",
    dominantColor: "#273c75",
    copyright: "(c) Yan Saputra",
  },
  {
    id: "valley-after-rain",
    title: "Valley After Rain",
    story: "Clouds breaking open over a wet valley trail.",
    imageUrl:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=86",
    alt: "Green valley and river with mountains under dramatic clouds.",
    location: "Kintamani, Bali",
    country: "Indonesia",
    takenAt: "27 Dec 2025",
    collection: "Highland Routes",
    camera: "Sony A7 IV",
    lens: "FE 24-70mm f/2.8 GM II",
    focalLength: "28mm",
    aperture: "f/9",
    shutterSpeed: "1/200",
    iso: 200,
    dimensions: "6000 x 4000",
    fileType: "WEBP display copy",
    colorProfile: "Display P3",
    dominantColor: "#5c744f",
    copyright: "(c) Yan Saputra",
  },
];
