const fs = require('fs');
const path = require('path');

const categories = [
  "Necklaces",
  "Earrings",
  "Bracelets",
  "Keychains",
  "Hair Accessories",
  "Fancy Items",
  "Customized Gifts",
  "Beauty Products",
  "Boutique Products",
  "Home Decor Gifts",
  "Resin Products",
  "Premium Accessories"
];

const adjectives = ["Rose Gold", "Diamond", "Pearl", "Crystal", "Sapphire", "Emerald", "Platinum", "Ruby", "Silver", "Gold", "Vintage", "Classic", "Modern", "Elegant", "Luxury", "Handcrafted", "Personalized", "Velvet"];
const nouns = {
  "Necklaces": ["Pendant", "Choker", "Chain", "Locket", "Collar"],
  "Earrings": ["Studs", "Hoops", "Drops", "Dangles", "Chandeliers"],
  "Bracelets": ["Bangle", "Cuff", "Chain", "Charm", "Tennis Bracelet"],
  "Keychains": ["Monogram Keychain", "Tassel Keychain", "Resin Keychain", "Charm Keychain", "Leather Keychain"],
  "Hair Accessories": ["Hairpin", "Scrunchie", "Headband", "Barrette", "Hair Clip"],
  "Fancy Items": ["Trinket Box", "Compact Mirror", "Perfume Bottle", "Jewelry Tray", "Music Box"],
  "Customized Gifts": ["Name Plate", "Engraved Pen", "Photo Frame", "Custom Mug", "Journal"],
  "Beauty Products": ["Lip Gloss", "Highlighter", "Blush", "Makeup Brushes", "Silk Sleep Mask"],
  "Boutique Products": ["Tote Bag", "Silk Scarf", "Sunglasses", "Cardholder", "Belt"],
  "Home Decor Gifts": ["Candle", "Vase", "Coasters", "Wall Art", "Decorative Bowl"],
  "Resin Products": ["Resin Coaster", "Resin Tray", "Resin Art", "Resin Ring", "Resin Bookmark"],
  "Premium Accessories": ["Watch", "Brooch", "Tie Clip", "Cufflinks", "Gloves"]
};

// Generate an abstract placeholder URL from unsplash or placehold.co to mimic a soft aesthetic
const getRandomImage = (category, index) => {
  // Using placehold.co for reliable soft-colored placeholders
  const softColors = [
    "f6f5f3", "f0eee9", "e8d8ce", "eaeaea", "d1d1d1", "f5f0f0", "eef0eb", "f2ece9"
  ];
  const textColors = ["5c5c5c", "8c8c8c", "2a2a2a", "1a1a1a"];
  const bg = softColors[index % softColors.length];
  const color = textColors[index % textColors.length];
  return `https://placehold.co/600x800/${bg}/${color}?text=${encodeURIComponent(category)}\nPlaceholder`;
};

const products = [];
let idCounter = 1;

categories.forEach((category) => {
  // Generate 12-18 products per category to reach ~150-200 total
  const numProducts = Math.floor(Math.random() * 7) + 12; 
  
  for (let i = 0; i < numProducts; i++) {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const nounArr = nouns[category];
    const noun = nounArr[Math.floor(Math.random() * nounArr.length)];
    
    // Generate realistic pricing (in ₹)
    const basePrice = Math.floor(Math.random() * 4000) + 500; // 500 to 4500
    // 70% chance of being on sale
    const isOnSale = Math.random() > 0.3;
    const price = isOnSale ? Math.floor(basePrice * (Math.random() * 0.3 + 0.6)) : basePrice; // 60% to 90% of base
    const originalPrice = isOnSale ? basePrice : null;
    
    const rating = (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1);
    const reviews = Math.floor(Math.random() * 300) + 15;

    products.push({
      id: idCounter++,
      name: `${adj} ${noun}`,
      category: category,
      price: price,
      originalPrice: originalPrice,
      rating: parseFloat(rating),
      reviews: reviews,
      image: getRandomImage(category, idCounter),
      isNew: Math.random() > 0.8,
      isBestSeller: Math.random() > 0.8,
      isTrending: Math.random() > 0.8
    });
  }
});

const outputDir = path.join(__dirname, 'src', 'data');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(path.join(outputDir, 'products.json'), JSON.stringify(products, null, 2));

console.log(`Successfully generated ${products.length} products!`);
