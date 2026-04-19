/* ═══════════════════════════════════════════════
   OLIVES RESTAURANT & BAR — menu.js
   ═══════════════════════════════════════════════ */

(function() {
  'use strict';

  /* ──────────────────────────────────────────────
     1. DISH DATA
     ────────────────────────────────────────────── */
  const DISHES = [
    {
      id: 1, cat: "Appetizers",
      name: "Shrimp Tempura",
      tag: "Bestseller", rating: 4.8, price: 35000,
      shortDesc: "Lightly battered prawns fried to golden perfection",
      fullDesc: "Fresh prawns dipped in a light, airy tempura batter and deep-fried until perfectly crisp and golden. Served with a traditional soy-ginger dipping sauce and a side of crisp Asian slaw.",
      ingredients: ["Prawns", "Tempura batter", "Soy-ginger sauce", "Asian slaw"],
      nutrition: { cal: "380 kcal", protein: "24g", carbs: "30g", fat: "16g" },
      image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&h=1000&fit=crop&q=85"
    },
    {
      id: 2, cat: "Appetizers",
      name: "Crispy Chicken Legs (3 Pcs)",
      tag: "Crowd Favorite", rating: 4.6, price: 35000,
      shortDesc: "Golden-fried, seasoned crispy chicken drumsticks",
      fullDesc: "Three large, juicy chicken drumsticks marinated in our secret blend of spices, coated in a seasoned crispy breading, and fried until golden brown. Served with a side of house garlic mayo.",
      ingredients: ["Chicken drumsticks", "Seasoned flour", "House spices", "Garlic mayo"],
      nutrition: { cal: "650 kcal", protein: "45g", carbs: "20g", fat: "40g" },
      image: "https://images.unsplash.com/photo-1626082929543-690226c6d042?w=800&h=1000&fit=crop&q=85"
    },
    {
      id: 3, cat: "Appetizers",
      name: "Teriyaki Wings (10 Pcs)",
      tag: "Sweet & Savory", rating: 4.7, price: 30000,
      shortDesc: "10 wings glazed in a rich, sticky teriyaki sauce",
      fullDesc: "Ten crispy chicken wings tossed in our house-made sticky, sweet, and savory teriyaki sauce. Finished with a sprinkle of toasted sesame seeds and fresh scallions.",
      ingredients: ["Chicken wings", "Teriyaki glaze", "Sesame seeds", "Scallions"],
      nutrition: { cal: "580 kcal", protein: "40g", carbs: "35g", fat: "28g" },
      image: "https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?w=800&h=1000&fit=crop&q=85"
    },
    {
      id: 4, cat: "Appetizers",
      name: "Chilli Garlic Wings (10 Pcs)",
      tag: "Spicy", rating: 4.8, price: 30000,
      shortDesc: "10 wings tossed in a fiery chilli and minced garlic sauce",
      fullDesc: "For the spice lovers! Ten perfectly fried wings tossed in a bold, aromatic sauce made from fresh bird's eye chillies, toasted garlic, and a hint of soy. Guaranteed to bring the heat.",
      ingredients: ["Chicken wings", "Fresh chillies", "Garlic", "Soy sauce", "Cilantro"],
      nutrition: { cal: "560 kcal", protein: "40g", carbs: "12g", fat: "32g" },
      image: "https://images.unsplash.com/photo-1524114664604-cd8133cd67ad?w=800&h=1000&fit=crop&q=85"
    },
    {
      id: 5, cat: "Appetizers",
      name: "Chicken Lollipop (8 Pcs)",
      tag: "Kid Friendly", rating: 4.5, price: 30000,
      shortDesc: "Frenched chicken winglets, spiced and deep-fried",
      fullDesc: "Eight frenched chicken winglets, marinated in a vibrant red spice blend, and deep-fried until the meat pulls easily from the bone. Served with a cool mint yogurt dip.",
      ingredients: ["Chicken winglets", "Tandoori spices", "Mint yogurt", "Lemon"],
      nutrition: { cal: "490 kcal", protein: "38g", carbs: "10g", fat: "26g" },
      image: "https://images.unsplash.com/photo-1569058242253-1df250d43f07?w=800&h=1000&fit=crop&q=85"
    },
    {
      id: 6, cat: "Appetizers",
      name: "Beef Cheese Balls (5 Pcs)",
      tag: "Signature", rating: 4.9, price: 30000,
      shortDesc: "Juicy beef bites stuffed with creamy cheese",
      fullDesc: "Five hand-rolled spiced minced beef meatballs, each hiding a molten core of premium mozzarella and cheddar. Breaded and fried to a golden crisp. Served with a side of spicy marinara dip.",
      ingredients: ["Minced beef", "Mozzarella", "Cheddar", "Breadcrumbs", "Spicy marinara"],
      nutrition: { cal: "550 kcal", protein: "35g", carbs: "15g", fat: "38g" },
      image: "https://images.unsplash.com/photo-1529042419816-ce8b159c146d?w=800&h=1000&fit=crop&q=85"
    },
    {
      id: 7, cat: "Appetizers",
      name: "Chicken Cheese Balls (5 Pcs)",
      tag: "Cheesy", rating: 4.7, price: 28000,
      shortDesc: "Crispy minced chicken balls with a molten cheese center",
      fullDesc: "Five delicious minced chicken balls seasoned with herbs, stuffed with a blend of melting cheeses, coated in breadcrumbs and fried. Served with our house garlic aioli.",
      ingredients: ["Minced chicken", "Mixed cheese", "Herbs", "Breadcrumbs", "Garlic aioli"],
      nutrition: { cal: "480 kcal", protein: "32g", carbs: "18g", fat: "30g" },
      image: "https://images.unsplash.com/photo-1615486171448-4fdcb3282255?w=800&h=1000&fit=crop&q=85"
    },
    {
      id: 8, cat: "Appetizers",
      name: "Tandoori Wings (8 Pcs)",
      tag: "Smoky", rating: 4.6, price: 25000,
      shortDesc: "8 wings marinated in yogurt and Indian spices, grilled",
      fullDesc: "Eight plump chicken wings marinated overnight in thick yogurt, Kashmiri chilli, cumin, and garam masala. Char-grilled in the tandoor for that authentic smoky flavor. Served with coriander chutney.",
      ingredients: ["Chicken wings", "Yogurt", "Tandoori spices", "Lemon", "Coriander chutney"],
      nutrition: { cal: "450 kcal", protein: "38g", carbs: "8g", fat: "25g" },
      image: "https://images.unsplash.com/photo-1608039755401-74207ebf051c?w=800&h=1000&fit=crop&q=85"
    },
    {
      id: 9, cat: "Appetizers",
      name: "Olives Chicken Fingers (5 Pcs)",
      tag: "Classic", rating: 4.8, price: 25000,
      shortDesc: "Crispy breaded chicken breast strips with dipping sauce",
      fullDesc: "Five tender strips of chicken breast, coated in our signature seasoned panko breading and fried until perfectly crisp. Served with honey mustard or BBQ sauce.",
      ingredients: ["Chicken breast", "Panko breadcrumbs", "House seasoning", "Honey mustard"],
      nutrition: { cal: "420 kcal", protein: "35g", carbs: "28g", fat: "18g" },
      image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=800&h=1000&fit=crop&q=85"
    },
    {
      id: 10, cat: "Appetizers",
      name: "Thai Chicken Satay",
      tag: "Popular", rating: 4.7, price: 25000,
      shortDesc: "Grilled chicken skewers with sweet & spicy peanut sauce",
      fullDesc: "Tender strips of chicken marinated in coconut milk, turmeric, and lemongrass, threaded onto skewers and grilled. Served alongside a rich, sweet, and mildly spicy peanut dipping sauce.",
      ingredients: ["Chicken breast", "Coconut milk", "Lemongrass", "Turmeric", "Peanut sauce"],
      nutrition: { cal: "380 kcal", protein: "34g", carbs: "12g", fat: "20g" },
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=1000&fit=crop&q=85"
    },
    {
      id: 11, cat: "Appetizers",
      name: "Paneer Tikka Cubes / Chilli Paneer",
      tag: "Vegetarian", rating: 4.6, price: 25000,
      shortDesc: "Spiced, grilled cottage cheese or sweet chilli tossed",
      fullDesc: "Your choice of classic Paneer Tikka marinated in yogurt and spices and charred in the tandoor, or Indo-Chinese Chilli Paneer tossed with bell peppers, onions, and a spicy soy-chilli glaze.",
      ingredients: ["Paneer (Cottage cheese)", "Bell peppers", "Onions", "Spices or Chilli sauce"],
      nutrition: { cal: "410 kcal", protein: "18g", carbs: "15g", fat: "30g" },
      image: "https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=800&h=1000&fit=crop&q=85"
    },
    {
      id: 12, cat: "Appetizers",
      name: "Thai Vegetarian Spring Rolls (4 Pcs)",
      tag: "Vegan", rating: 4.5, price: 22000,
      shortDesc: "Crispy pastry filled with glass noodles and crunchy veg",
      fullDesc: "Four golden, crispy spring rolls stuffed with a savory mixture of glass noodles, shredded cabbage, carrots, and wood ear mushrooms. Served with a sweet chilli plum dipping sauce.",
      ingredients: ["Spring roll pastry", "Glass noodles", "Cabbage", "Carrots", "Sweet chilli sauce"],
      nutrition: { cal: "280 kcal", protein: "6g", carbs: "42g", fat: "10g" },
      image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&h=1000&fit=crop&q=85"
    },
    {
      id: 13, cat: "Appetizers",
      name: "Meat Samosa",
      tag: "Classic", rating: 4.6, price: 15000,
      shortDesc: "Crispy triangular pastry filled with spiced minced meat",
      fullDesc: "Two large, perfectly fried samosas packed with a flavorful filling of spiced minced beef, onions, and fresh coriander. Served with a tangy tamarind chutney.",
      ingredients: ["Minced beef", "Onions", "Coriander", "Pastry shell", "Tamarind chutney"],
      nutrition: { cal: "320 kcal", protein: "14g", carbs: "26g", fat: "18g" },
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=1000&fit=crop&q=85"
    },
    {
      id: 14, cat: "Appetizers",
      name: "Vegetable Samosa",
      tag: "Vegetarian", rating: 4.5, price: 13000,
      shortDesc: "Crispy pastry filled with spiced potatoes and peas",
      fullDesc: "Two large, crispy samosas generously stuffed with a traditional mix of spiced mashed potatoes, green peas, and toasted cumin seeds. Served with mint coriander chutney.",
      ingredients: ["Potatoes", "Green peas", "Cumin", "Pastry shell", "Mint chutney"],
      nutrition: { cal: "280 kcal", protein: "6g", carbs: "38g", fat: "12g" },
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=1000&fit=crop&q=85"
    },
    {
      id: 15, cat: "Meats",
      name: "Grilled Beef Fillet",
      tag: "Signature", rating: 4.9, price: 40000,
      shortDesc: "Rosemary & black peppercorn fillet in balsamic brandy sauce",
      fullDesc: "A premium cut of beef fillet, generously crusted with rosemary and cracked black peppercorns, grilled to your liking. Served draped in a rich, reduction of balsamic vinegar and brandy.",
      ingredients: ["Beef fillet", "Rosemary", "Black peppercorns", "Balsamic vinegar", "Brandy"],
      nutrition: { cal: "620 kcal", protein: "55g", carbs: "12g", fat: "35g" },
      image: "https://images.unsplash.com/photo-1558030006-450675393462?w=800&h=1000&fit=crop&q=85"
    },
    {
      id: 16, cat: "Meats",
      name: "Beef Fillet Steak with Shallot",
      tag: "Classic", rating: 4.8, price: 40000,
      shortDesc: "Tender beef fillet topped with caramelized shallot jus",
      fullDesc: "A juicy, perfectly seared beef fillet steak rested and served with a deeply savory, slightly sweet caramelized shallot and red wine pan jus. Pairs perfectly with mashed potatoes or fries.",
      ingredients: ["Beef fillet", "Shallots", "Red wine", "Beef stock", "Butter"],
      nutrition: { cal: "600 kcal", protein: "54g", carbs: "10g", fat: "36g" },
      image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&h=1000&fit=crop&q=85"
    },
    {
      id: 17, cat: "Meats",
      name: "Half Barbeque Chicken",
      tag: "Hearty", rating: 4.7, price: 40000,
      shortDesc: "Slow-roasted half chicken glazed in smoky BBQ sauce",
      fullDesc: "A whole half-chicken, marinated overnight in dry rub spices, then slow-roasted and generously basted with our signature smoky and sweet house BBQ sauce until beautifully charred and tender.",
      ingredients: ["Half chicken", "House BBQ sauce", "Dry rub spices"],
      nutrition: { cal: "750 kcal", protein: "65g", carbs: "20g", fat: "42g" },
      image: "https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?w=800&h=1000&fit=crop&q=85"
    },
    {
      id: 18, cat: "Meats",
      name: "Honey Mustard Pork Chops",
      tag: "Sweet & Tangy", rating: 4.6, price: 38000,
      shortDesc: "Bone-in chops glazed with a sweet honey mustard sauce",
      fullDesc: "Two thick, bone-in pork chops, pan-seared to lock in the juices, then oven-roasted with a sticky, tangy, and sweet honey-mustard glaze. Perfectly balanced and deeply flavorful.",
      ingredients: ["Pork chops", "Honey", "Dijon mustard", "Garlic", "Thyme"],
      nutrition: { cal: "680 kcal", protein: "48g", carbs: "22g", fat: "42g" },
      image: "https://images.unsplash.com/photo-1628296213700-1110e5d8ecfe?w=800&h=1000&fit=crop&q=85"
    },
    {
      id: 19, cat: "Meats",
      name: "Grilled Pork Chops in Barbeque Sauce",
      tag: "Smoky", rating: 4.7, price: 38000,
      shortDesc: "Juicy grilled chops smothered in rich BBQ sauce",
      fullDesc: "Two premium pork chops, expertly grilled over an open flame to achieve a perfect char, and heavily basted in our thick, smoky house barbeque sauce.",
      ingredients: ["Pork chops", "House BBQ sauce", "Spices"],
      nutrition: { cal: "690 kcal", protein: "48g", carbs: "25g", fat: "40g" },
      image: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=800&h=1000&fit=crop&q=85"
    },
    {
      id: 20, cat: "Meats",
      name: "Grilled Hawaiian Pork Chops",
      tag: "Tropical", rating: 4.8, price: 38000,
      shortDesc: "Grilled chops served with a fresh, sweet pineapple salsa",
      fullDesc: "A tropical twist on a classic. Bone-in pork chops marinated in a light soy-ginger blend, grilled, and topped with a vibrant, refreshing salsa made from fresh pineapple, red onion, cilantro, and jalapeño.",
      ingredients: ["Pork chops", "Fresh pineapple", "Red onion", "Cilantro", "Soy-ginger marinade"],
      nutrition: { cal: "640 kcal", protein: "48g", carbs: "28g", fat: "35g" },
      image: "https://images.unsplash.com/photo-1610440042657-612c34d95e9f?w=800&h=1000&fit=crop&q=85"
    },
    {
      id: 21, cat: "Meats",
      name: "Grilled Lemon Chicken Breast",
      tag: "Healthy", rating: 4.7, price: 35000,
      shortDesc: "Served with a rich garlic cream herb sauce",
      fullDesc: "A lean, tender chicken breast marinated in fresh lemon juice and olive oil, grilled to perfection, and smothered in an indulgent, velvety garlic and mixed-herb cream sauce.",
      ingredients: ["Chicken breast", "Lemon", "Garlic", "Heavy cream", "Mixed herbs"],
      nutrition: { cal: "480 kcal", protein: "45g", carbs: "8g", fat: "28g" },
      image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&h=1000&fit=crop&q=85"
    },
    {
      id: 22, cat: "Meats",
      name: "Grilled Chicken Fillet",
      tag: "Classic", rating: 4.5, price: 35000,
      shortDesc: "Simple, tender, and perfectly seasoned grilled chicken",
      fullDesc: "A classic favorite. A butterflied chicken breast fillet, lightly seasoned with sea salt, black pepper, and paprika, then grilled to remain juicy and tender. Served with a side salad and lemon wedge.",
      ingredients: ["Chicken breast", "Sea salt", "Black pepper", "Paprika", "Olive oil"],
      nutrition: { cal: "350 kcal", protein: "46g", carbs: "2g", fat: "14g" },
      image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&h=1000&fit=crop&q=85"
    },
    {
      id: 23, cat: "Meats",
      name: "Poussin Chicken & Plain Chips",
      tag: "Bestseller", rating: 4.8, price: 35000,
      shortDesc: "Crispy fried spring chicken tossed in spicy poussin sauce",
      fullDesc: "A beloved East African classic! A whole spring chicken, deep-fried until incredibly crispy, then tossed in our addictive, buttery, garlic and chilli poussin sauce. Served with a generous portion of plain fries.",
      ingredients: ["Spring chicken", "Poussin sauce (butter, chilli, garlic)", "Potato fries"],
      nutrition: { cal: "850 kcal", protein: "42g", carbs: "65g", fat: "48g" },
      image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=800&h=1000&fit=crop&q=85"
    },
    {
      id: 24, cat: "Meats",
      name: "Sweet & Sour Stir-Fry Pork",
      tag: "Asian Fusion", rating: 4.6, price: 35000,
      shortDesc: "Cooked in a unique orange, rosemary, and tomato sauce",
      fullDesc: "Crispy strips of pork stir-fried with crunchy bell peppers and onions, tossed in our unique sweet and sour sauce featuring fresh orange juice, a hint of rosemary, and a rich tomato base. Served with steamed rice.",
      ingredients: ["Pork strips", "Orange juice", "Rosemary", "Tomato paste", "Bell peppers"],
      nutrition: { cal: "620 kcal", protein: "32g", carbs: "55g", fat: "28g" },
      image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&h=1000&fit=crop&q=85"
    },
    {
      id: 25, cat: "Meats",
      name: "Chicken Pasta",
      tag: "Comfort Food", rating: 4.8, price: 28000,
      shortDesc: "Penne in sun-dried tomato cream sauce with baby spinach",
      fullDesc: "Al dente penne pasta tossed with sliced grilled chicken breast in a luxurious, creamy sauce infused with sun-dried tomatoes, garlic, and white wine, finished with fresh baby spinach and parmesan.",
      ingredients: ["Penne pasta", "Chicken breast", "Sun-dried tomatoes", "Heavy cream", "Baby spinach", "Parmesan"],
      nutrition: { cal: "710 kcal", protein: "38g", carbs: "68g", fat: "32g" },
      image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&h=1000&fit=crop&q=85"
    },
    {
      id: 26, cat: "Seafood",
      name: "Grilled Salmon",
      tag: "Premium", rating: 4.9, price: 75000,
      shortDesc: "Fresh Atlantic salmon fillet, perfectly grilled",
      fullDesc: "A generous fillet of premium Atlantic salmon, grilled to achieve a crispy skin and a tender, flaky center. Served with a light dill sauce, asparagus, and a charred lemon half.",
      ingredients: ["Atlantic salmon", "Olive oil", "Dill", "Lemon", "Asparagus"],
      nutrition: { cal: "520 kcal", protein: "42g", carbs: "5g", fat: "35g" },
      image: "https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=800&h=1000&fit=crop&q=85"
    },
    {
      id: 27, cat: "Seafood",
      name: "Grilled King Prawns",
      tag: "Chef's Choice", rating: 4.8, price: 70000,
      shortDesc: "Jumbo prawns smothered in a garlic herb butter sauce",
      fullDesc: "Massive, succulent king prawns split and grilled over an open flame, basted generously with a rich, fragrant garlic, parsley, and white wine butter sauce. Served with crusty bread to soak up the juices.",
      ingredients: ["King prawns", "Butter", "Garlic", "Parsley", "White wine"],
      nutrition: { cal: "450 kcal", protein: "48g", carbs: "8g", fat: "24g" },
      image: "https://images.unsplash.com/photo-1559742811-822873691df8?w=800&h=1000&fit=crop&q=85"
    },
    {
      id: 28, cat: "Seafood",
      name: "Whole Fried Tilapia",
      tag: "Local Favorite", rating: 4.9, price: 50000,
      shortDesc: "Crispy whole tilapia served with chips and coleslaw",
      fullDesc: "A fresh, whole Lake Victoria tilapia, scored, seasoned, and deep-fried until perfectly crispy on the outside while remaining tender and flaky inside. Served with a generous portion of fries, fresh lemon, and a side of creamy coleslaw.",
      ingredients: ["Whole tilapia", "House seasoning", "Potato fries", "Coleslaw", "Lemon"],
      nutrition: { cal: "850 kcal", protein: "65g", carbs: "55g", fat: "40g" },
      image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&h=1000&fit=crop&q=85"
    },
    {
      id: 29, cat: "Seafood",
      name: "Garlic Prawns",
      tag: "Aromatic", rating: 4.7, price: 45000,
      shortDesc: "Cooked in white wine chilli garlic and parsley sauce",
      fullDesc: "A generous serving of peeled prawns sautéed to perfection in a vibrant, aromatic pan sauce made from white wine, toasted garlic slices, red chilli flakes, and fresh parsley.",
      ingredients: ["Prawns", "White wine", "Garlic", "Chilli flakes", "Parsley"],
      nutrition: { cal: "380 kcal", protein: "35g", carbs: "6g", fat: "22g" },
      image: "https://images.unsplash.com/photo-1625943555419-56a2cb596640?w=800&h=1000&fit=crop&q=85"
    },
    {
      id: 30, cat: "Seafood",
      name: "Beer Battered Fish & Chips",
      tag: "Classic", rating: 4.8, price: 40000,
      shortDesc: "Crispy golden fish fillets served with tartar sauce",
      fullDesc: "Thick fillets of flaky white fish enveloped in a light, crispy, and airy beer batter, fried to golden perfection. Served with thick-cut fries, a lemon wedge, and our house-made tangy tartar sauce.",
      ingredients: ["White fish fillet", "Beer batter", "Potato fries", "Tartar sauce", "Lemon"],
      nutrition: { cal: "820 kcal", protein: "38g", carbs: "75g", fat: "42g" },
      image: "https://images.unsplash.com/photo-1599320677467-f31627c244c4?w=800&h=1000&fit=crop&q=85"
    },
    {
      id: 31, cat: "Seafood",
      name: "Grilled Tilapia in Creamy Basil Pesto Sauce",
      tag: "Flavorful", rating: 4.7, price: 37000,
      shortDesc: "Tender grilled fillet smothered in rich basil pesto cream",
      fullDesc: "A delicate grilled tilapia fillet elevated by a rich, luxurious sauce made from heavy cream, fresh basil pesto, toasted pine nuts, and a touch of parmesan. Served over steamed vegetables.",
      ingredients: ["Tilapia fillet", "Basil pesto", "Heavy cream", "Parmesan", "Pine nuts"],
      nutrition: { cal: "550 kcal", protein: "42g", carbs: "12g", fat: "36g" },
      image: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=800&h=1000&fit=crop&q=85"
    },
    {
      id: 32, cat: "Seafood",
      name: "Fish Fillet in Tomato & Black Olives Sauce",
      tag: "Mediterranean", rating: 4.6, price: 37000,
      shortDesc: "Pan-seared fish in a rustic tomato, caper, and olive stew",
      fullDesc: "A Mediterranean-inspired dish featuring a pan-seared white fish fillet poached gently in a rustic, savory sauce made from crushed tomatoes, Kalamata olives, capers, garlic, and fresh basil.",
      ingredients: ["White fish fillet", "Crushed tomatoes", "Black olives", "Capers", "Garlic", "Basil"],
      nutrition: { cal: "420 kcal", protein: "38g", carbs: "15g", fat: "22g" },
      image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&h=1000&fit=crop&q=85"
    },
    {
      id: 33, cat: "Seafood",
      name: "Fish Fingers (Adult Portion)",
      tag: "Comfort", rating: 4.5, price: 37000,
      shortDesc: "Crispy breaded strips of fish with dipping sauce",
      fullDesc: "A grown-up portion of a childhood classic. Thick strips of premium white fish coated in seasoned breadcrumbs and fried until perfectly crisp. Served with tartar sauce and a side of fries.",
      ingredients: ["White fish strips", "Breadcrumbs", "Tartar sauce", "Fries", "Lemon"],
      nutrition: { cal: "680 kcal", protein: "32g", carbs: "65g", fat: "34g" },
      image: "https://images.unsplash.com/photo-1599320677467-f31627c244c4?w=800&h=1000&fit=crop&q=85"
    },
    {
      id: 34, cat: "Seafood",
      name: "Chilli Garlic Fish",
      tag: "Spicy", rating: 4.7, price: 32000,
      shortDesc: "Spicy pan-fried fish served with vegetable fried rice",
      fullDesc: "Bite-sized pieces of fish fillet lightly battered, fried, and tossed in an intense, fiery sauce made from soy, fresh chillies, and garlic. Served alongside aromatic vegetable fried rice.",
      ingredients: ["Fish fillet pieces", "Chillies", "Garlic", "Soy sauce", "Vegetable fried rice"],
      nutrition: { cal: "610 kcal", protein: "35g", carbs: "70g", fat: "22g" },
      image: "https://images.unsplash.com/photo-1534604973900-c43089fa08ec?w=800&h=1000&fit=crop&q=85"
    },
    {
      id: 35, cat: "Pizzas",
      name: "BBQ Steak Pizza (Large)",
      tag: "Wood-Fired", rating: 4.8, price: 38000,
      shortDesc: "Smoky BBQ base topped with tender steak slices",
      fullDesc: "Our famous 72-hour fermented wood-fired pizza dough spread with a smoky BBQ sauce base, piled high with mozzarella, caramelized onions, bell peppers, and tender slices of marinated beef steak.",
      ingredients: ["Pizza dough", "BBQ sauce", "Beef steak", "Mozzarella", "Caramelized onions", "Bell peppers"],
      nutrition: { cal: "1150 kcal", protein: "52g", carbs: "120g", fat: "48g" },
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=1000&fit=crop&q=85"
    },
    {
      id: 36, cat: "Sides",
      name: "Masala Chips",
      tag: "Spicy", rating: 4.7, price: 20000,
      shortDesc: "Fries tossed in a rich, spicy, and tangy tomato masala",
      fullDesc: "Crispy fries completely coated in a thick, vibrant, and spicy East African style tomato masala sauce, finished with fresh coriander and a squeeze of lime.",
      ingredients: ["Potato fries", "Tomato masala", "Spices", "Coriander", "Lime"],
      nutrition: { cal: "480 kcal", protein: "6g", carbs: "65g", fat: "22g" },
      image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=800&h=1000&fit=crop&q=85"
    },
    {
      id: 37, cat: "Sides",
      name: "Poussin Chips",
      tag: "Bestseller", rating: 4.8, price: 18000,
      shortDesc: "Fries tossed in addictive buttery garlic-chilli sauce",
      fullDesc: "A local favorite! Our crispy fries are tossed in a luxurious, melted butter sauce infused with garlic, paprika, and bird's eye chillies for a spicy, savory kick.",
      ingredients: ["Potato fries", "Butter", "Garlic", "Chillies", "Paprika"],
      nutrition: { cal: "550 kcal", protein: "5g", carbs: "55g", fat: "35g" },
      image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&h=1000&fit=crop&q=85"
    },
    {
      id: 38, cat: "Sides",
      name: "Plain Chips",
      tag: "Classic", rating: 4.5, price: 15000,
      shortDesc: "Crispy, golden, perfectly salted potato fries",
      fullDesc: "A generous basket of classic, thick-cut potato fries, deep-fried until crisp and golden on the outside and fluffy on the inside. Lightly salted.",
      ingredients: ["Potatoes", "Frying oil", "Sea salt"],
      nutrition: { cal: "380 kcal", protein: "4g", carbs: "50g", fat: "18g" },
      image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=800&h=1000&fit=crop&q=85"
    }
  ];

  /* Expose DISHES for other scripts (like Admin Panel) */
  window.DISHES = DISHES;

  const CAT_META = {
    Appetizers: { 
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--forest)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8Z"/><path d="M10 2v3"/><path d="M14 2v3"/><path d="M6 2v3"/></svg>`, 
      label: "Appetizers, Wings & Bites" 
    },
    Meats: { 
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--forest)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 11 5.5 5.5a2.5 2.5 0 0 1-3.5 3.5L11.5 14.5"/><path d="M13 10a2 2 0 0 0 2-2 2 2 0 0 0-2-2 2 2 0 0 0-2 2 2 2 0 0 0 2 2Z"/><path d="M10.5 14.5c-2.3 2.3-5.6 1.8-8.2-.8s-3.1-5.9-.8-8.2c2.3-2.3 5.6-1.8 8.2.8s3.1 5.9.8 8.2Z"/></svg>`, 
      label: "Meats & Chicken" 
    },
    Seafood: { 
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--forest)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 16c.5 0 1 0 1.5-.5a2 2 0 0 1 3 0c.5.5 1 .5 1.5.5s1 0 1.5-.5a2 2 0 0 1 3 0c.5.5 1 .5 1.5.5s1 0 1.5-.5a2 2 0 0 1 3 0c.5.5 1 .5 1.5.5"/><path d="M7 10h.01"/><path d="M12 2c5 0 9 4 9 9s-4 9-9 9a11.66 11.66 0 0 1-7-2.5 4 4 0 0 0-3 0C2 14 2 12 2 11s0-9 10-9Z"/></svg>`, 
      label: "Seafood" 
    },
    Pizzas: { 
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--forest)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 11h.01"/><path d="M11 15h.01"/><path d="M16 16h.01"/><path d="m2 16 20 6-6-20A20 20 0 0 0 2 16Z"/><path d="M22 22 16 16"/></svg>`, 
      label: "Pizzas" 
    },
    Sides: { 
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--forest)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 14c.83 0 1.5.67 1.5 1.5a1.5 1.5 0 0 1-3 0c0-.83.67-1.5 1.5-1.5Z"/><path d="M21 14c.83 0 1.5.67 1.5 1.5a1.5 1.5 0 0 1-3 0c0-.83.67-1.5 1.5-1.5Z"/><path d="M12 14c.83 0 1.5.67 1.5 1.5a1.5 1.5 0 0 1-3 0c0-.83.67-1.5 1.5-1.5Z"/><path d="M3 12h18"/><path d="M3 12c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>`, 
      label: "Sides" 
    }
  };

  const ALL_CATS = Object.keys(CAT_META);
  const fmt = (n) => "UGX " + n.toLocaleString();

  /* ──────────────────────────────────────────────
     2. RENDER LOGIC
     ────────────────────────────────────────────── */
  function buildCard(dish) {
    const card = document.createElement("article");
    card.className = "menu-card";
    card.dataset.id  = dish.id;
    card.dataset.cat = dish.cat;

    card.innerHTML = `
      <div class="menu-card__img-wrap">
        <img src="${dish.image}" alt="${dish.name}" class="menu-card__img" loading="lazy">
        <span class="menu-card__tag">${dish.tag}</span>
      </div>
      <div class="menu-card__body">
        <div class="menu-card__top-row">
          <h3 class="menu-card__name">${dish.name}</h3>
          <span class="menu-card__rating">★ ${dish.rating.toFixed(1)}</span>
        </div>
        <p class="menu-card__desc">${dish.shortDesc}</p>
        <div class="menu-card__footer">
          <span class="menu-card__price">${fmt(dish.price)}</span>
          <button class="menu-card__plus" data-id="${dish.id}" aria-label="Add ${dish.name} to order">
            +
          </button>
        </div>
      </div>
      <span class="menu-card__hint">Tap for details →</span>
    `;

    card.addEventListener("click", function (e) {
      if (e.target.closest(".menu-card__plus")) return;
      openDetail(dish.id);
    });

    const plusBtn = card.querySelector(".menu-card__plus");
    if (plusBtn) {
      plusBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        quickAdd(dish, plusBtn);
      });
    }
    return card;
  }

  function renderMenu(dishes) {
    const grid = document.getElementById("menuGrid");
    if (!grid) return;
    grid.innerHTML = "";

    const groups = {};
    ALL_CATS.forEach(cat => groups[cat] = []);
    dishes.forEach(d => { if (groups[d.cat]) groups[d.cat].push(d); });

    let totalVisible = 0;
    ALL_CATS.forEach(cat => {
      const items = groups[cat];
      if (items.length === 0) return;
      totalVisible += items.length;

      const section = document.createElement("div");
      section.className = "menu-section reveal";
      const meta = CAT_META[cat];
      section.innerHTML = `
        <div class="menu-section__heading">
          <span class="menu-section__icon">${meta.icon}</span>
          <h2 class="menu-section__title">${meta.label}</h2>
          <span class="menu-section__count">${items.length} ${items.length === 1 ? "dish" : "dishes"}</span>
        </div>
        <div class="menu-section__grid"></div>
      `;
      const sectionGrid = section.querySelector(".menu-section__grid");
      items.forEach(dish => sectionGrid.appendChild(buildCard(dish)));
      grid.appendChild(section);
    });

    updateCount(totalVisible, dishes.length === DISHES.length);
    attachRevealObserver();
  }

  function updateCount(n, isAll) {
    const el = document.getElementById("menuCount");
    if (!el) return;
    el.textContent = isAll ? `Showing all ${n} dishes` : `${n} ${n === 1 ? "dish" : "dishes"} found`;
  }

  /* ──────────────────────────────────────────────
     3. FILTER & SEARCH
     ────────────────────────────────────────────── */
  let activeFilter = "All";
  let searchQuery  = "";

  function getFiltered() {
    return DISHES.filter(d => {
      const catMatch    = activeFilter === "All" || d.cat === activeFilter;
      const q           = searchQuery.toLowerCase();
      const searchMatch = q === "" ||
        d.name.toLowerCase().includes(q) ||
        d.shortDesc.toLowerCase().includes(q) ||
        d.cat.toLowerCase().includes(q);
      return catMatch && searchMatch;
    });
  }

  /* ──────────────────────────────────────────────
     4. DETAIL PANEL
     ────────────────────────────────────────────── */
  const panel    = document.getElementById("detailPanel");
  const backdrop = document.getElementById("detailBackdrop");
  let qty = 1;
  let currentDish = null;

  function openDetail(id) {
    const dish = DISHES.find(d => d.id === id);
    if (!dish) return;
    currentDish = dish;
    qty = 1;

    const els = {
      cat: document.getElementById("dCat"),
      name: document.getElementById("dName"),
      rating: document.getElementById("dRating"),
      tag: document.getElementById("dTag"),
      desc: document.getElementById("dDesc"),
      price: document.getElementById("dPrice"),
      photo: document.getElementById("dPhoto"),
      qty: document.getElementById("qtyVal"),
      barName: document.getElementById("mobileBarName"),
      ing: document.getElementById("dIngredients"),
      nut: document.getElementById("dNutrition")
    };

    if (els.cat) els.cat.textContent = dish.cat;
    if (els.name) els.name.textContent = dish.name;
    if (els.rating) els.rating.textContent = "★ " + dish.rating.toFixed(1) + " rating";
    if (els.tag) els.tag.textContent = dish.tag;
    if (els.desc) els.desc.textContent = dish.fullDesc;
    if (els.price) els.price.textContent = fmt(dish.price);
    if (els.photo) { els.photo.src = dish.image; els.photo.alt = dish.name; }
    if (els.qty) els.qty.textContent = 1;
    if (els.barName) els.barName.textContent = dish.name;
    if (els.ing) els.ing.innerHTML = dish.ingredients.map(i => `<span class="detail-panel__ingredient-pill">${i}</span>`).join("");
    if (els.nut) {
      const n = dish.nutrition;
      els.nut.innerHTML = `
        <div class="detail-panel__nut-item"><span class="detail-panel__nut-val">${n.cal}</span><span class="detail-panel__nut-label">Calories</span></div>
        <div class="detail-panel__nut-item"><span class="detail-panel__nut-val">${n.protein}</span><span class="detail-panel__nut-label">Protein</span></div>
        <div class="detail-panel__nut-item"><span class="detail-panel__nut-val">${n.carbs}</span><span class="detail-panel__nut-label">Carbs</span></div>
        <div class="detail-panel__nut-item"><span class="detail-panel__nut-val">${n.fat}</span><span class="detail-panel__nut-label">Fat</span></div>
      `;
    }

    if (panel) { panel.classList.add("open"); panel.setAttribute("aria-hidden", "false"); }
    if (backdrop) backdrop.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeDetail() {
    if (panel) { panel.classList.remove("open"); panel.setAttribute("aria-hidden", "true"); }
    if (backdrop) backdrop.classList.remove("open");
    document.body.style.overflow = "";
  }

  /* ──────────────────────────────────────────────
     5. CART & TOAST
     ────────────────────────────────────────────── */
  const CART_KEY = "olives_cart";
  const cartLoad = () => { try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch(e){ return []; } };
  const cartSave = (items) => localStorage.setItem(CART_KEY, JSON.stringify(items));

  function cartAddItem(dish, q) {
    let items = cartLoad();
    let existing = items.find(i => i.id === dish.id);
    if (existing) existing.qty += q;
    else items.push({ id: dish.id, name: dish.name, price: dish.price, image: dish.image, cat: dish.cat, tag: dish.tag, qty: q });
    cartSave(items);
  }

  function updateCartBadges() {
    const total = cartLoad().reduce((sum, i) => sum + i.qty, 0);
    const el = document.getElementById("cartCount");
    const mb = document.getElementById("mobileBadge");
    [el, mb].forEach(node => {
      if (!node) return;
      node.textContent = total;
      total > 0 ? node.removeAttribute("hidden") : node.setAttribute("hidden", "");
    });
  }

  function showToast(msg) {
    const t = document.getElementById("toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.remove("show");
    void t.offsetWidth;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 2100);
  }

  function quickAdd(dish, btn) {
    btn.classList.add("added");
    btn.textContent = "✓";
    setTimeout(() => { btn.classList.remove("added"); btn.textContent = "+"; }, 1400);
    cartAddItem(dish, 1);
    updateCartBadges();
    showToast(`✓  ${dish.name} added to order`);
  }

  /* ──────────────────────────────────────────────
     6. UTILS
     ────────────────────────────────────────────── */
  function attachRevealObserver() {
    if (!window.IntersectionObserver) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -30px 0px" });
    document.querySelectorAll(".reveal:not(.visible)").forEach(el => observer.observe(el));
  }

  /* ──────────────────────────────────────────────
     7. INITIALIZATION
     ────────────────────────────────────────────── */
  document.addEventListener("DOMContentLoaded", function() {
    renderMenu(DISHES);
    updateCartBadges();

    /* Nav Scroll */
    const navbar = document.getElementById("navbar");
    if (navbar) window.addEventListener("scroll", () => navbar.classList.toggle("scrolled", window.scrollY > 55));

    /* Hamburger */
    const hamburger = document.getElementById("hamburger");
    const navLinks  = document.getElementById("navLinks");
    if (hamburger && navLinks) {
      hamburger.addEventListener("click", () => {
        const open = navLinks.classList.toggle("open");
        hamburger.classList.toggle("open", open);
      });
      navLinks.querySelectorAll(".nav__link").forEach(link => {
        link.addEventListener("click", () => { navLinks.classList.remove("open"); hamburger.classList.remove("open"); });
      });
    }

    /* Category Navigation */
    document.querySelectorAll(".cat-nav__btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".cat-nav__btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeFilter = btn.dataset.cat;
        renderMenu(getFiltered());
      });
    });

    /* Search */
    const search = document.getElementById("searchInput");
    if (search) search.addEventListener("input", e => { searchQuery = e.target.value.trim(); renderMenu(getFiltered()); });

    /* Detail Panel Controls */
    const dClose = document.getElementById("detailClose");
    const mBack  = document.getElementById("mobileBackBtn");
    if (dClose) dClose.addEventListener("click", closeDetail);
    if (mBack)  mBack.addEventListener("click", closeDetail);
    if (backdrop) backdrop.addEventListener("click", closeDetail);
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeDetail(); });

    const qMinus = document.getElementById("qtyMinus");
    const qPlus  = document.getElementById("qtyPlus");
    const qVal   = document.getElementById("qtyVal");
    if (qMinus) qMinus.addEventListener("click", () => { if (qty > 1) { qty--; if (qVal) qVal.textContent = qty; } });
    if (qPlus)  qPlus.addEventListener("click", () => { if (qty < 20) { qty++; if (qVal) qVal.textContent = qty; } });

    const dAdd = document.getElementById("detailAddBtn");
    if (dAdd) dAdd.addEventListener("click", () => {
      if (!currentDish) return;
      cartAddItem(currentDish, qty);
      updateCartBadges();
      showToast(`✓  ${qty}× ${currentDish.name} added`);
      closeDetail();
    });

    const cartBtn = document.getElementById("cartBtn");
    const mobileCartBtn = document.getElementById("mobileCartBtn");
    if (cartBtn) cartBtn.addEventListener("click", () => window.location.href = "cart.html");
    if (mobileCartBtn) mobileCartBtn.addEventListener("click", () => window.location.href = "cart.html");
  });

})();