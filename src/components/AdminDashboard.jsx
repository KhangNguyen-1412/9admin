import React, { useState, useMemo } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  LayoutDashboard, 
  Package, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  X,
  LogOut,
  User,
  AlertCircle,
  Store,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDashboard({ products, onSwitchView, onDashboard }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({ name: '', price: '', stock: '', imageUrl: '' });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- LOGIC XỬ LÝ ---
  
  // Lọc sản phẩm theo từ khóa (Real-time Search)
  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.isActive && p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  // Mở form thêm mới
  const handleAddNew = () => {
    setEditingProduct(null);
    setFormData({ name: '', price: '', stock: '', imageUrl: '' });
    setFormError('');
    setIsModalOpen(true);
  };

  // Mở form chỉnh sửa
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({ 
      name: product.name, 
      price: product.price.toString(), 
      stock: product.stock.toString(), 
      imageUrl: product.imageUrl || '' 
    });
    setFormError('');
    setIsModalOpen(true);
  };

  // Xóa mềm (Soft Delete) trong Firestore
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này? (Sản phẩm sẽ bị ẩn khỏi Cửa hàng)')) {
      try {
        const productRef = doc(db, "products", id);
        await updateDoc(productRef, { isActive: false });
      } catch (error) {
        console.error("Error deleting product: ", error);
        alert("Có lỗi xảy ra khi xóa sản phẩm.");
      }
    }
  };

  // Submit Form (Lưu hoặc Cập nhật vào Firestore)
  const handleSave = async (e) => {
    e.preventDefault();
    
    // Validation cơ bản
    if (!formData.name || !formData.price || !formData.stock) {
      setFormError('Vui lòng nhập đầy đủ thông tin bắt buộc (*)');
      return;
    }
    
    if (Number(formData.price) <= 0 || Number(formData.stock) < 0) {
      setFormError('Giá bán phải > 0 và Tồn kho không được âm');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingProduct) {
        // Cập nhật (Update)
        const productRef = doc(db, "products", editingProduct.id);
        await updateDoc(productRef, {
          name: formData.name,
          price: Number(formData.price),
          stock: Number(formData.stock),
          imageUrl: formData.imageUrl,
          updatedAt: serverTimestamp()
        });
      } else {
        // Thêm mới (Create)
        await addDoc(collection(db, "products"), {
          name: formData.name,
          price: Number(formData.price),
          stock: Number(formData.stock),
          imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80',
          isActive: true,
          createdAt: serverTimestamp()
        });
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving product: ", error);
      setFormError("Có lỗi xảy ra khi lưu sản phẩm.");
    } finally {
      setIsSubmitting(false);
    }
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
                onClick={onDashboard}
                className="w-full flex items-center gap-3 px-6 py-3 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <LayoutDashboard size={20} />
                <span className="font-medium">Tổng quan</span>
              </button>
            </li>
            <li>
              <button 
                className="w-full flex items-center gap-3 px-6 py-3 text-white bg-blue-600/10 border-r-4 border-blue-500"
              >
                <Package size={20} className="text-blue-500" />
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
            <h1 className="text-xl font-semibold text-gray-800 hidden sm:block">Quản lý kho hàng</h1>
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
        <div className="flex-1 overflow-auto p-6 bg-gray-50">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Thanh công cụ (Toolbar) */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="relative w-full sm:w-96">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên sản phẩm..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button 
                onClick={handleAddNew}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
              >
                <Plus size={20} />
                Thêm Sản Phẩm
              </button>
            </div>

            {/* Bảng Dữ Liệu (Data Table) */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Giá bán (VNĐ)</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Tồn kho</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product, index) => (
                        <motion.tr 
                          key={product.id} 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                                <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/150'; }} />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900 truncate max-w-[200px] sm:max-w-[300px]">{product.name}</div>
                                <div className="text-xs text-gray-500 mt-0.5">ID: {product.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-semibold text-blue-600">
                              {product.price.toLocaleString('vi-VN')} đ
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {product.stock > 10 ? (
                              <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">
                                {product.stock} (Còn hàng)
                              </span>
                            ) : product.stock > 0 ? (
                              <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">
                                {product.stock} (Sắp hết)
                              </span>
                            ) : (
                              <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                Hết hàng
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => handleEdit(product)}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Chỉnh sửa"
                              >
                                <Edit size={18} />
                              </button>
                              <button 
                                onClick={() => handleDelete(product.id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Xóa"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                          Không tìm thấy sản phẩm nào đang hoạt động.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL FORM (Thêm/Sửa) - Added motion here too for consistency */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" 
              onClick={() => setIsModalOpen(false)}
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden z-10 transform transition-all"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Package size={20} className="text-blue-600" />
                  {editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSave} className="p-6 space-y-5">
                {formError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-600 text-sm">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    <p>{formError}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Nhập tên sản phẩm..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Giá bán (VNĐ) <span className="text-red-500">*</span></label>
                    <input 
                      type="number" 
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng tồn kho <span className="text-red-500">*</span></label>
                    <input 
                      type="number" 
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Đường dẫn hình ảnh (URL)</label>
                  <input 
                    type="text" 
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="https://..."
                  />
                </div>

                <div className="pt-4 flex gap-3 justify-end">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Hủy bỏ
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
                  >
                    {isSubmitting ? 'Đang lưu...' : (editingProduct ? 'Lưu thay đổi' : 'Thêm mới')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
