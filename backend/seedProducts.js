require("dotenv").config();
const mongoose = require("mongoose");
const Product  = require("./models/Product");

const PRODUCTS = [
  { name:"Lakme 9 to 5 Weightless Mousse Foundation", category:"Cosmetics",          mrp:625,  discountedPrice:499 },
  { name:"Himalaya Purifying Neem Face Wash 150ml",   category:"Cosmetics",          mrp:175,  discountedPrice:139 },
  { name:"Nivea Soft Light Moisturiser 200ml",        category:"Cosmetics",          mrp:280,  discountedPrice:219 },
  { name:"Paracetamol 500mg Strip (10 Tabs)",         category:"Generic Medicines",  mrp:20,   discountedPrice:14  },
  { name:"Amoxicillin 250mg Capsules (10 Caps)",      category:"Generic Medicines",  mrp:85,   discountedPrice:65  },
  { name:"Cetirizine 10mg Strip (10 Tabs)",           category:"Generic Medicines",  mrp:22,   discountedPrice:16  },
  { name:"Crocin Advance 500mg (15 Tabs)",            category:"Tablets",            mrp:35,   discountedPrice:28  },
  { name:"Vitamin C 1000mg Effervescent (10 Tabs)",   category:"Tablets",            mrp:299,  discountedPrice:239 },
  { name:"D3 Must Vitamin D3 60000 IU (4 Caps)",      category:"Tablets",            mrp:165,  discountedPrice:129 },
  { name:"Benadryl Cough Syrup 100ml",                category:"Syrups",             mrp:115,  discountedPrice:89  },
  { name:"Pudin Hara Lemon 6ml × 10 sachets",        category:"Syrups",             mrp:60,   discountedPrice:48  },
  { name:"Pampers Active Baby Diapers Small 22 Count",category:"Diapers",            mrp:499,  discountedPrice:399 },
  { name:"Huggies Wonder Pants Medium 42 Count",      category:"Diapers",            mrp:649,  discountedPrice:519 },
  { name:"Betadine Antiseptic Cream 20g",             category:"Creams",             mrp:95,   discountedPrice:75  },
  { name:"Boro Plus Antiseptic Cream 80ml",           category:"Creams",             mrp:72,   discountedPrice:59  },
  { name:"Band-Aid Flexible Fabric Strips (100 ct)", category:"First Aid",          mrp:250,  discountedPrice:199 },
  { name:"Dettol Antiseptic Liquid 500ml",            category:"First Aid",          mrp:220,  discountedPrice:179 },
  { name:"Himalaya Ashwagandha General Wellness",     category:"Wellness",           mrp:250,  discountedPrice:199 },
  { name:"Dabur Honey 250g",                          category:"Wellness",           mrp:165,  discountedPrice:135 },
  { name:"Pulse Oximeter Finger Clip (SpO2)",         category:"Wellness",           mrp:999,  discountedPrice:799 },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");
  await Product.deleteMany({});
  await Product.insertMany(PRODUCTS);
  console.log(`✅ ${PRODUCTS.length} products added to database`);
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });