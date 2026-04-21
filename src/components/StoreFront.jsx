import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Store, 
  ArrowLeft,
  Package
} from 'lucide-react';

export default function StoreFront({ products, onSwitchView }) {
  const [cartCount, setCartCount] = useState(0);

  // Chỉ lấy những sản phẩm có isActive = true để hiển thị cho Khách hàng
  const activeProducts = products.filter(p => p.isActive);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* HEADER CỬA HÀNG */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-2xl tracking-tight">
            <Store size={28} />
            <span>NICE<span className="text-gray-800">STORE</span></span>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
            <div className="w-px h-6 bg-gray-200"></div>
            <button 
              onClick={onSwitchView}
              className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="hidden sm:inline">Trang Quản Trị</span>
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <div className="bg-blue-600 text-white py-12 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">Sản Phẩm Mới Nhất</h1>
        <p className="text-blue-100 max-w-2xl mx-auto text-lg">
          Khám phá các sản phẩm công nghệ chất lượng cao, cập nhật theo thời gian thực từ hệ thống Quản trị.
        </p>
      </div>

      {/* GRID SẢN PHẨM */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 xl:gap-8">
            {activeProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/500'; }}
                  />
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="bg-gray-900 text-white px-4 py-2 rounded-full font-bold text-sm tracking-wide shadow-lg uppercase">
                        Hết Hàng
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-gray-900 font-semibold text-base mb-1 line-clamp-2" title={product.name}>
                    {product.name}
                  </h3>
                  <div className="mt-auto pt-4 flex items-end justify-between">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Kho: {product.stock > 0 ? product.stock : 0}
                      </p>
                      <p className="text-blue-600 font-bold text-lg">
                        {product.price.toLocaleString('vi-VN')} <span className="text-sm underline">đ</span>
                      </p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setCartCount(c => c + 1)}
                    disabled={product.stock === 0}
                    className={`mt-4 w-full py-2.5 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2
                      ${product.stock > 0 
                        ? 'bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                  >
                    <ShoppingCart size={16} />
                    {product.stock > 0 ? 'Thêm vào giỏ' : 'Tạm hết hàng'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Cửa hàng hiện đang trống</h2>
            <p className="text-gray-500">Vui lòng truy cập trang Quản trị để thêm sản phẩm mới.</p>
          </div>
        )}
      </main>
    </div>
  );
}
