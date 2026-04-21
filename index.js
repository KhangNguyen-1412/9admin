import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  query, 
  where,
  serverTimestamp 
} from "firebase/firestore";

// Load environment variables from .env
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Firebase Configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// --- API ROUTES ---

// 1. Health Check
app.get('/', (req, res) => {
  res.json({ 
    message: "Welcome to 9Admin Backend API!",
    status: "Healthy",
    endpoints: {
      getAllProducts: "GET /api/products",
      createProduct: "POST /api/products"
    }
  });
});

// 2. GET All Active Products
app.get('/api/products', async (req, res) => {
  try {
    const q = query(collection(db, "products"), where("isActive", "==", true));
    const querySnapshot = await getDocs(q);
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: error.message });
  }
});

// 3. POST Create New Product
app.post('/api/products', async (req, res) => {
  try {
    const { name, price, stock, imageUrl } = req.body;
    
    // Simple validation
    if (!name || isNaN(price) || isNaN(stock)) {
      return res.status(400).json({ 
        error: "Invalid data. 'name', 'price', and 'stock' are required." 
      });
    }

    const docRef = await addDoc(collection(db, "products"), {
      name,
      price: Number(price),
      stock: Number(stock),
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80",
      isActive: true,
      createdAt: serverTimestamp()
    });

    res.status(201).json({ 
      id: docRef.id, 
      message: "Product created successfully via API!" 
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: error.message });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`\n🚀 Backend server is running at http://localhost:${port}`);
  console.log(`\n--- Test Endpoints with Postman ---`);
  console.log(`GET  http://localhost:${port}/api/products`);
  console.log(`POST http://localhost:${port}/api/products\n`);
});
