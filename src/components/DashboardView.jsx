import React from 'react';
import { 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign,
  ArrowRight,
  ShoppingCart,
  Store,
  ExternalLink,
  LayoutDashboard,
  User,
  LogOut
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardView({ products, onSwitchView, onManageProducts }) {
  // --- Analytics Logic ---
  const activeProducts = products.filter(p => p.isActive);
  const totalProducts = activeProducts.length;
  const outOfStockItems = activeProducts.filter(p => p.stock === 0).length;
  const totalStockCount = activeProducts.reduce((sum, p) => sum + p.stock, 0);
  const totalValue = activeProducts.reduce((sum, p) => sum + (p.price * p.stock), 0);

  const lowStockThreshold = 5;
  const lowStockItems = activeProducts.filter(p => p.stock > 0 && p.stock <= lowStockThreshold);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans text-slate-800">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white font-bold text-xl tracking-wide">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Package size={20} className="text-white" />
            </div>
            NICE<span className="text-blue-500">ADMIN</span>
          </div>
        </div>
        <nav className="flex-1 py-4">
          <ul className="space-y-1">
            <li>
              <button 
                className="w-full flex items-center gap-3 px-6 py-3 text-white bg-blue-600/10 border-r-4 border-blue-500"
              >
                <LayoutDashboard size={20} className="text-blue-500" />
                <span className="font-medium">Tổng quan</span>
              </button>
            </li>
            <li>
              <button 
                onClick={onManageProducts}
                className="w-full flex items-center gap-3 px-6 py-3 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <Package size={20} />
                <span className="font-medium">Sản phẩm</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* HEADER */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-800 hidden sm:block">Bảng điều khiển</h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={onSwitchView}
              className="flex items-center gap-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-4 py-2 rounded-lg font-medium transition-colors text-sm border border-emerald-200"
            >
              <Store size={18} />
              <span className="hidden sm:inline">Xem Cửa Hàng</span>
              <ExternalLink size={16} />
            </button>
            <div className="w-px h-6 bg-gray-300 mx-2"></div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <User size={18} />
              <span className="hidden sm:inline">admin@9solutions.vn</span>
            </div>
            <button className="text-gray-400 hover:text-red-500 transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <div className="flex-1 overflow-auto p-6 bg-gray-200/30">
          <motion.div 
            className="max-w-6xl mx-auto space-y-6"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            
            {/* WELCOME SECTION */}
            <motion.div 
              variants={itemVariants}
              className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg"
            >
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-2">Chào mừng trở lại, Admin! 👋</h2>
                <p className="text-blue-100 max-w-md">
                  Dưới đây là một số thống kê chính về kho hàng của bạn trong ngày hôm nay.
                </p>
              </div>
              <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
                <TrendingUp size={200} strokeWidth={1} />
              </div>
            </motion.div>

            {/* STATS GRID - Bento Style */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Products */}
              <motion.div 
                variants={itemVariants}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Package size={24} />
                  </div>
                  <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">+12%</span>
                </div>
                <h3 className="text-gray-500 text-sm font-medium">Tổng sản phẩm</h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">{totalProducts}</p>
              </motion.div>

              {/* Total Stock */}
              <motion.div 
                variants={itemVariants}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <ShoppingCart size={24} />
                  </div>
                  <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-full">Ổn định</span>
                </div>
                <h3 className="text-gray-500 text-sm font-medium">Tổng tồn kho</h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">{totalStockCount}</p>
              </motion.div>

              {/* Total Value */}
              <motion.div 
                variants={itemVariants}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <DollarSign size={24} />
                  </div>
                  <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">+5.4%</span>
                </div>
                <h3 className="text-gray-500 text-sm font-medium">Tổng giá trị kho</h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">{totalValue.toLocaleString('vi-VN')} đ</p>
              </motion.div>

              {/* Alerts */}
              <motion.div 
                variants={itemVariants}
                className={`p-6 rounded-2xl border transition-shadow group ${outOfStockItems > 0 ? 'bg-red-50 border-red-100 shadow-red-100/20' : 'bg-white border-gray-100 shadow-sm'}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl transition-colors ${outOfStockItems > 0 ? 'bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white' : 'bg-amber-50 text-amber-600'}`}>
                    <AlertTriangle size={24} />
                  </div>
                </div>
                <h3 className="text-gray-500 text-sm font-medium">Hết hàng / Sắp hết</h3>
                <p className={`text-2xl font-bold mt-1 ${outOfStockItems > 0 ? 'text-red-700' : 'text-gray-900'}`}>
                  {outOfStockItems} <span className="text-sm font-normal text-gray-400">/ {lowStockItems.length}</span>
                </p>
              </motion.div>
            </div>

            {/* DETAILED CARDS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Low Stock Monitor */}
              <motion.div 
                variants={itemVariants}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col"
              >
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <AlertTriangle size={18} className="text-amber-500" />
                    Cảnh báo tồn kho thấp
                  </h3>
                  <button onClick={onManageProducts} className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1 group">
                    Quản lý <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
                <div className="flex-1 p-0 overflow-auto max-h-[300px]">
                  {lowStockItems.length > 0 ? (
                    <ul className="divide-y divide-gray-50">
                      {lowStockItems.map(item => (
                        <li key={item.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                          <img src={item.imageUrl} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                            <p className="text-xs text-gray-500">ID: {item.id}</p>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-bold ${item.stock === 0 ? 'text-red-600' : 'text-amber-600'}`}>
                              {item.stock} cái
                            </p>
                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Tồn kho</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-12 text-center text-gray-400">
                      <Package size={32} className="mx-auto mb-2 opacity-20" />
                      <p>Mọi thứ đều ổn, không có cảnh báo nào.</p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Quick Actions / Recent Activity Placeholder */}
              <motion.div 
                variants={itemVariants}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
              >
                <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <TrendingUp size={18} className="text-indigo-500" />
                  Hành động nhanh
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={onManageProducts}
                    className="p-6 bg-slate-50 hover:bg-slate-100 rounded-2xl text-center border border-slate-100 transition-all group"
                  >
                    <PlusIcon className="w-8 h-8 text-blue-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-bold text-slate-700">Thêm sản phẩm</p>
                  </button>
                  <button 
                    onClick={onSwitchView}
                    className="p-6 bg-emerald-50/50 hover:bg-emerald-50 rounded-2xl text-center border border-emerald-100 transition-all group"
                  >
                    <Store className="w-8 h-8 text-emerald-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-bold text-slate-700">Xem cửa hàng</p>
                  </button>
                  <button className="p-6 bg-gray-50 opacity-50 cursor-not-allowed rounded-2xl text-center border border-gray-100">
                    <div className="w-8 h-8 bg-gray-200 rounded-full mx-auto mb-3"></div>
                    <p className="text-sm font-bold text-gray-400">Cấu hình hệ thống</p>
                  </button>
                  <button className="p-6 bg-gray-50 opacity-50 cursor-not-allowed rounded-2xl text-center border border-gray-100">
                    <div className="w-8 h-8 bg-gray-200 rounded-full mx-auto mb-3"></div>
                    <p className="text-sm font-bold text-gray-400">Báo cáo nâng cao</p>
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

function PlusIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  );
}
