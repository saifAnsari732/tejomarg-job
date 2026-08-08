const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Initialize Firebase Admin using the private key from .env.local
try {
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;
  if (!privateKey) throw new Error("FIREBASE_PRIVATE_KEY not found in .env.local");
  // Handle escaped newlines in the private key string if necessary
  if (privateKey.includes('\\n')) {
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
} catch (e) {
  console.log("Firebase Admin init error:", e);
}

const db = getFirestore();

const seedCategories = async () => {
  const categories = [
    { name: "Software Development", slug: "software-development", icon: "Code" },
    { name: "Design", slug: "design", icon: "PenTool" },
    { name: "Marketing", slug: "marketing", icon: "Megaphone" },
    { name: "Sales", slug: "sales", icon: "TrendingUp" },
    { name: "Customer Support", slug: "customer-support", icon: "Headphones" },
    { name: "Finance", slug: "finance", icon: "DollarSign" },
    { name: "Human Resources", slug: "human-resources", icon: "Users" },
    { name: "Data Science", slug: "data-science", icon: "Database" },
  ];

  console.log("Seeding categories...");
  const batch = db.batch();
  categories.forEach(cat => {
    const docRef = db.collection('categories').doc(cat.slug);
    batch.set(docRef, cat);
  });

  await batch.commit();
  console.log("Categories seeded successfully!");
  process.exit(0);
};

seedCategories();
