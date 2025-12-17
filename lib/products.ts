export type Product = {
  id: string;
  slug: string;
  name: string;
  category: 'Cotton' | 'Wash & Wear' | 'Other';
  shortDescription: string;
  description: string;
  price: number;
  tags: string[];
  fabric: string;
  gsm: number;
  isNew: boolean;
  heroImage: string;
  gallery: string[];
  fitNotes: string;
  care: string;
  sizes: string[];
};

// NOTE: Image URLs are placeholders – replace with your own Cloudinary links.
export const PRODUCTS: Product[] = [
  {
    id: 'p-cotton-white-value',
    slug: 'white-cotton-everyday',
    name: 'White Cotton – Everyday (Unstitched 4M)',
    category: 'Cotton',
    shortDescription:
      'Everyday white cotton for daily shalwar kameez – lighter feel, easy on budget.',
    description:
      'Unstitched white cotton roll for regular use. Slightly lighter weave so it stays breathable in heat and still presses crisp after ironing. Perfect when you want neat white kapra without spending premium money.',
    price: 2800,
    tags: ['Cotton', 'Everyday wear', 'Budget friendly'],
    fabric: '100% cotton, lighter weave',
    gsm: 130,
    isNew: true,
    heroImage: '/WhiteAura.jpg',
    gallery: ['/WhiteAura.jpg'],
    fitNotes:
      'Ideal for straight shalwar kameez or kurta pyjama. 4 metres is enough for most sizes; taller builds may prefer 4.5m.',
    care: 'Machine wash cold, wash whites separately, warm iron on reverse.',
    sizes: ['4m', '4.5m']
  },
  {
    id: 'p-cotton-white-premium',
    slug: 'white-cotton-premium',
    name: 'White Cotton – Premium (Unstitched 4.5M)',
    category: 'Cotton',
    shortDescription:
      'High-thread-count white cotton with cleaner finish for juma and events.',
    description:
      'Premium unstitched white cotton roll with tighter weave and smoother hand feel. Looks sharp under daylight and mehndi lights, holds structure better and feels soft on skin – ideal for when you want your white suit to look a level above regular cotton.',
    price: 3800,
    tags: ['Cotton', 'Premium', 'Occasion wear'],
    fabric: '100% cotton, tighter weave',
    gsm: 145,
    isNew: true,
    heroImage: '/WhiteAura.jpg',
    gallery: ['/WhiteAura.jpg'],
    fitNotes:
      'Great for shalwar kameez you wear to office, juma and dawats. 4.5 metres gives a little extra ease for broader shoulders and longer kameez.',
    care: 'Machine wash cold, wash whites separately, warm iron on reverse.',
    sizes: ['4m', '4.5m']
  },
  {
    id: 'p-washwear-black-value',
    slug: 'black-wash-wear-everyday',
    name: 'Black Wash & Wear – Everyday (Unstitched 4M)',
    category: 'Wash & Wear',
    shortDescription:
      'Everyday black wash & wear for office and daily use – easy to manage.',
    description:
      'Unstitched black wash & wear cloth that resists heavy creasing and is simple to maintain. Good option when you want a clean black suit that does not show every little wrinkle.',
    price: 3500,
    tags: ['Wash & wear', 'Black', 'Everyday'],
    fabric: 'Wash & wear blend',
    gsm: 150,
    isNew: true,
    heroImage: '/BlackAura.jpg',
    gallery: ['/BlackAura.jpg'],
    fitNotes:
      'Best for office and casual shalwar kameez in black. 4 metres works for most builds; order 4.5m if you prefer extra flare or length.',
    care: 'Machine wash cold, wash darks separately, light steam or iron.',
    sizes: ['4m', '4.5m']
  },
  {
    id: 'p-washwear-black-premium',
    slug: 'black-wash-wear-premium',
    name: 'Black Wash & Wear – Premium (Unstitched 4.5M)',
    category: 'Wash & Wear',
    shortDescription:
      'Richer black wash & wear with smoother finish for events and Fridays.',
    description:
      'Higher-grade black wash & wear cloth with smoother touch and slightly heavier fall. Designed for when you want your black suit to look deep, clean and a bit more dressed up.',
    price: 4800,
    tags: ['Wash & wear', 'Black', 'Premium'],
    fabric: 'Fine wash & wear blend',
    gsm: 165,
    isNew: true,
    heroImage: '/BlackAura.jpg',
    gallery: ['/BlackAura.jpg'],
    fitNotes:
      'Great for juma, dawats and events in black. 4.5 metres suits most Pakistani tailoring styles with a little extra comfort.',
    care: 'Machine wash cold inside out, hang to dry, low iron if needed.',
    sizes: ['4m', '4.5m']
  }
];

export function getAllProducts(): Product[] {
  return PRODUCTS;
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return PRODUCTS.slice(0, 3);
}

export function getNewArrivalProducts(): Product[] {
  return PRODUCTS.filter((p) => p.isNew);
}
