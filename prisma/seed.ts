import { randomBytes, scryptSync } from "crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

const products = [
  {
    slug: "aurum-royal-oakmont",
    name: "Royal Oakmont",
    brand: "Aurum",
    description:
      "The pinnacle of the Aurum collection. An 18k yellow gold case frames a lacquered onyx dial with applied gold indices, powered by an in-house automatic calibre with 72-hour power reserve. Hand-stitched alligator strap, Breguet-style hands. A statement of quiet, absolute power.",
    price: 1290000,
    image: "/watches/watch-01.png",
    category: "men",
    style: "dress",
    movement: "automatic",
    caseMaterial: "18k Yellow Gold",
    caseSize: "40mm",
    waterRes: "50m",
    strap: "Alligator Leather",
    stock: 6,
    rating: 4.9,
    reviewCount: 124,
    featured: true,
  },
  {
    slug: "vantage-chrono-s2",
    name: "Chrono S2",
    brand: "Vantage",
    description:
      "A racing chronograph built for precision. The S2 pairs a brushed stainless steel case and integrated bracelet with a triple-register dial and column-wheel chronograph movement. Tachymeter bezel, 100m water resistance, and luminous sword hands for the fast lane.",
    price: 345000,
    image: "/watches/watch-02.png",
    category: "men",
    style: "sport",
    movement: "automatic",
    caseMaterial: "Stainless Steel",
    caseSize: "42mm",
    waterRes: "100m",
    strap: "Steel Bracelet",
    stock: 14,
    rating: 4.8,
    reviewCount: 208,
    featured: true,
  },
  {
    slug: "nocturne-abyss-300",
    name: "Abyss 300",
    brand: "Nocturne",
    description:
      "A professional-grade diver rated to 300 metres. Matte black ceramic bezel, ultra-legible luminous markers, and a helium escape valve. The Abyss 300's automatic movement is certified chronometer-grade — engineered for the deep and styled for the surface.",
    price: 189000,
    image: "/watches/watch-03.png",
    category: "unisex",
    style: "dive",
    movement: "automatic",
    caseMaterial: "Steel & Ceramic",
    caseSize: "43mm",
    waterRes: "300m",
    strap: "FKM Rubber",
    stock: 21,
    rating: 4.7,
    reviewCount: 312,
    featured: true,
  },
  {
    slug: "eclat-rose-pearl",
    name: "Rosé Pearl",
    brand: "Éclat",
    description:
      "Femininity in its most enduring form. A slim rose gold case cradles a mother-of-pearl dial that shifts with the light, finished with a diamond-set index at twelve. Quartz precision inside a Milanese mesh bracelet that drapes like silk on the wrist.",
    price: 215000,
    image: "/watches/watch-04.png",
    category: "women",
    style: "dress",
    movement: "quartz",
    caseMaterial: "Rose Gold PVD",
    caseSize: "32mm",
    waterRes: "30m",
    strap: "Milanese Mesh",
    stock: 11,
    rating: 4.8,
    reviewCount: 176,
    featured: true,
  },
  {
    slug: "meridian-heritage-classic",
    name: "Heritage Classic",
    brand: "Meridian",
    description:
      "Timeless by design. A cream dial with painted Roman numerals sits beneath a domed sapphire crystal, housed in a polished 39mm steel case. The brown calf leather strap develops a rich patina over years of wear — a watch that grows with you.",
    price: 98000,
    image: "/watches/watch-05.png",
    category: "men",
    style: "dress",
    movement: "automatic",
    caseMaterial: "Polished Steel",
    caseSize: "39mm",
    waterRes: "50m",
    strap: "Calf Leather",
    stock: 25,
    rating: 4.6,
    reviewCount: 421,
    featured: false,
  },
  {
    slug: "nord-pur-white",
    name: "Pur White",
    brand: "Nord",
    description:
      "Scandinavian restraint distilled into 36mm. No numerals, no clutter — just two leaf hands over an ivory-white dial and a soft grey suede strap. Quartz accuracy with an eight-year battery. The quiet one in the room that everyone notices.",
    price: 42000,
    image: "/watches/watch-06.png",
    category: "unisex",
    style: "minimal",
    movement: "quartz",
    caseMaterial: "Brushed Steel",
    caseSize: "36mm",
    waterRes: "30m",
    strap: "Suede",
    stock: 38,
    rating: 4.5,
    reviewCount: 530,
    featured: false,
  },
  {
    slug: "aviator-altitude-1940",
    name: "Altitude 1940",
    brand: "Aviator",
    description:
      "A tribute to the golden age of flight. Oversized Arabic numerals filled with Super-LumiNova, an extra-large crown for gloved hands, and a soft-iron inner case shielding the automatic movement from magnetism. Vintage oiled leather strap included.",
    price: 165000,
    image: "/watches/watch-07.png",
    category: "men",
    style: "pilot",
    movement: "automatic",
    caseMaterial: "Brushed Steel",
    caseSize: "44mm",
    waterRes: "60m",
    strap: "Vintage Leather",
    stock: 9,
    rating: 4.7,
    reviewCount: 189,
    featured: false,
  },
  {
    slug: "obsidian-squelette-noir",
    name: "Squelette Noir",
    brand: "Obsidian",
    description:
      "Nothing hidden, everything earned. The openworked skeleton dial reveals 212 hand-finished components of a manual-wind calibre, suspended in a rose gold case. Black alligator strap, sapphire caseback, and a heart you can watch beat.",
    price: 875000,
    image: "/watches/watch-08.png",
    category: "men",
    style: "skeleton",
    movement: "manual",
    caseMaterial: "Rose Gold",
    caseSize: "41mm",
    waterRes: "30m",
    strap: "Alligator Leather",
    stock: 4,
    rating: 4.9,
    reviewCount: 87,
    featured: true,
  },
  {
    slug: "pulse-titan-one",
    name: "Titan One",
    brand: "Pulse",
    description:
      "Intelligence on your wrist in a 45mm titanium case. AMOLED always-on display, dual-band GPS, 14-day battery, and 100m water resistance with an aerospace-grade fluoroelastomer band. Health, sleep and performance — measured beautifully.",
    price: 69000,
    image: "/watches/watch-09.png",
    category: "unisex",
    style: "smart",
    movement: "digital",
    caseMaterial: "Titanium",
    caseSize: "45mm",
    waterRes: "100m",
    strap: "Fluoroelastomer",
    stock: 42,
    rating: 4.4,
    reviewCount: 764,
    featured: false,
  },
  {
    slug: "solis-jubile-champagne",
    name: "Jubilé Champagne",
    brand: "Solis",
    description:
      "The two-tone icon, reimagined. A champagne sunburst dial with a fluted bezel, mounted on a jubilee bracelet that interweaves gold and steel. Automatic movement with date at three o'clock. Celebration, every single day.",
    price: 520000,
    image: "/watches/watch-10.png",
    category: "women",
    style: "dress",
    movement: "automatic",
    caseMaterial: "Two-tone Steel & Gold",
    caseSize: "34mm",
    waterRes: "50m",
    strap: "Jubilee Bracelet",
    stock: 8,
    rating: 4.8,
    reviewCount: 143,
    featured: true,
  },
];

async function main() {
  console.log("Seeding watches + demo user...");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.user.deleteMany();
  await prisma.product.deleteMany();

  for (const p of products) {
    await prisma.product.create({ data: p });
  }

  await prisma.user.create({
    data: {
      name: "Demo Collector",
      email: "demo@chronos.watch",
      passwordHash: hashPassword("chronos123"),
    },
  });

  console.log(`Seeded ${products.length} products and 1 demo user.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
