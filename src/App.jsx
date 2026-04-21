import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import AdminDashboard from './components/AdminDashboard';
import StoreFront from './components/StoreFront';
import DashboardView from './components/DashboardView';
import { AnimatePresence, motion } from 'framer-motion';

export default function App() {
  // View state: 'dashboard', 'admin', or 'store'
  const [currentView, setCurrentView] = useState('dashboard'); 
  
  // Real-time products state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Firestore Real-time Sync ---
  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const prods = [];
      querySnapshot.forEach((doc) => {
        prods.push({ id: doc.id, ...doc.data() });
      });
      setProducts(prods);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching products: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-blue-600 font-bold">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // Animation Variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    duration: 0.4,
    ease: "circOut"
  };

  return (
    <AnimatePresence mode="wait">
      {currentView === 'dashboard' ? (
        <motion.div
           key="dashboard"
           initial="initial"
           animate="animate"
           exit="exit"
           variants={pageVariants}
           transition={pageTransition}
           className="min-h-screen"
        >
          <DashboardView 
            products={products} 
            onSwitchView={() => setCurrentView('store')}
            onManageProducts={() => setCurrentView('admin')}
          />
        </motion.div>
      ) : currentView === 'admin' ? (
        <motion.div
           key="admin"
           initial="initial"
           animate="animate"
           exit="exit"
           variants={pageVariants}
           transition={pageTransition}
           className="min-h-screen"
        >
          <AdminDashboard 
            products={products} 
            onSwitchView={() => setCurrentView('store')} 
            onDashboard={() => setCurrentView('dashboard')}
          />
        </motion.div>
      ) : (
        <motion.div
           key="store"
           initial="initial"
           animate="animate"
           exit="exit"
           variants={pageVariants}
           transition={pageTransition}
           className="min-h-screen"
        >
          <StoreFront 
            products={products} 
            onSwitchView={() => setCurrentView('dashboard')} 
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}