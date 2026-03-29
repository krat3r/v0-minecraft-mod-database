// =====================================================
// MINECRAFT MODS DATABASE
// =====================================================
// To add a new mod, simply add a new object to the array below
// To change a mod's logo, update the 'logo' field with your image URL
// =====================================================

export interface Mod {
  id: string
  name: string
  description: string
  version: string
  category: string
  logo: string // URL to the mod's logo image
  downloadUrl: string // MediaFire download link
  author: string
  minecraftVersions: string[]
  downloads?: number
}

export const mods: Mod[] = [
  {
    id: "optifine",
    name: "OptiFine",
    description: "OptiFine is a Minecraft optimization mod that allows Minecraft to run faster and look better with full support for HD textures and many configuration options.",
    version: "1.20.4",
    category: "Performance",
    logo: "https://images.unsplash.com/photo-1633957897986-70e83293f3ff?w=128&h=128&fit=crop",
    downloadUrl: "https://www.mediafire.com/file/example1", // Replace with your MediaFire link
    author: "sp614x",
    minecraftVersions: ["1.20.4", "1.20.1", "1.19.4"],
    downloads: 150000000,
  },
  {
    id: "sodium",
    name: "Sodium",
    description: "Sodium is a free and open-source rendering engine replacement for Minecraft which greatly improves frame rates and reduces micro-stutter.",
    version: "0.5.8",
    category: "Performance",
    logo: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=128&h=128&fit=crop",
    downloadUrl: "https://www.mediafire.com/file/example2", // Replace with your MediaFire link
    author: "CaffeineMC",
    minecraftVersions: ["1.20.4", "1.20.1", "1.19.4"],
    downloads: 50000000,
  },
  {
    id: "jei",
    name: "Just Enough Items (JEI)",
    description: "JEI is an item and recipe viewing mod for Minecraft, built from the ground up for stability and performance.",
    version: "15.2.0",
    category: "Utility",
    logo: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=128&h=128&fit=crop",
    downloadUrl: "https://www.mediafire.com/file/example3", // Replace with your MediaFire link
    author: "mezz",
    minecraftVersions: ["1.20.4", "1.20.1", "1.19.4"],
    downloads: 200000000,
  },
  {
    id: "create",
    name: "Create",
    description: "Create is a mod offering a variety of tools and blocks for building, decoration and aesthetic automation.",
    version: "0.5.1f",
    category: "Technology",
    logo: "https://images.unsplash.com/photo-1580894894513-541e068a3e2b?w=128&h=128&fit=crop",
    downloadUrl: "https://www.mediafire.com/file/example4", // Replace with your MediaFire link
    author: "simibubi",
    minecraftVersions: ["1.20.1", "1.19.2", "1.18.2"],
    downloads: 75000000,
  },
  {
    id: "biomes-o-plenty",
    name: "Biomes O' Plenty",
    description: "An expansive biome mod that adds a large amount of new, vibrant biomes to explore, with rich content and many adventure opportunities.",
    version: "18.0.0",
    category: "World Gen",
    logo: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=128&h=128&fit=crop",
    downloadUrl: "https://www.mediafire.com/file/example5", // Replace with your MediaFire link
    author: "Forstride",
    minecraftVersions: ["1.20.4", "1.20.1", "1.19.4"],
    downloads: 100000000,
  },
  {
    id: "twilight-forest",
    name: "The Twilight Forest",
    description: "An adventure and exploration mod focused around a mysterious forest dimension full of new creatures, dungeons, and bosses.",
    version: "4.3.2145",
    category: "Adventure",
    logo: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=128&h=128&fit=crop",
    downloadUrl: "https://www.mediafire.com/file/example6", // Replace with your MediaFire link
    author: "TeamTwilight",
    minecraftVersions: ["1.20.1", "1.19.4", "1.18.2"],
    downloads: 85000000,
  },
  {
    id: "iris-shaders",
    name: "Iris Shaders",
    description: "A modern shaders mod for Minecraft intended to be compatible with existing OptiFine shader packs.",
    version: "1.6.17",
    category: "Graphics",
    logo: "https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=128&h=128&fit=crop",
    downloadUrl: "https://www.mediafire.com/file/example7", // Replace with your MediaFire link
    author: "coderbot",
    minecraftVersions: ["1.20.4", "1.20.1", "1.19.4"],
    downloads: 40000000,
  },
  {
    id: "applied-energistics",
    name: "Applied Energistics 2",
    description: "A Minecraft mod about Matter, Energy and using them to conquer the world. Storage systems, automation, and more.",
    version: "15.0.23",
    category: "Technology",
    logo: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=128&h=128&fit=crop",
    downloadUrl: "https://www.mediafire.com/file/example8", // Replace with your MediaFire link
    author: "AlgorithmX2",
    minecraftVersions: ["1.20.4", "1.20.1", "1.19.4"],
    downloads: 60000000,
  },
]

// Available categories for filtering
export const categories = [
  "All",
  "Performance",
  "Utility",
  "Technology",
  "World Gen",
  "Adventure",
  "Graphics",
]
