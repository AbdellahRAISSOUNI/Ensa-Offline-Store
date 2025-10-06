"use client";
import { useEffect, useState, useRef } from "react";
import { 
  Trash2, 
  Edit3, 
  Package, 
  Shirt, 
  XCircle,
  CheckCircle,
  MessageCircle,
  ShoppingBag,
  CheckSquare,
  Palette
} from "lucide-react";

interface ProductImage {
  original: string;
  thumbnail: string;
  medium: string;
  large: string;
}

interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  images: ProductImage[];
  sizes: string[];
  category?: string;
  isCustomizable: boolean;
  customPrice?: number;
  isActive: boolean;
  stock?: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  images: ProductImage[];
  sizes: string[];
  category: string;
  isCustomizable: boolean;
  customPrice: number;
  isActive: boolean;
  stock: number;
  tags: string[];
}

export default function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ product: Product | null, show: boolean }>({ product: null, show: false });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    images: [],
    sizes: [],
    category: '',
    isCustomizable: false,
    customPrice: 0,
    isActive: true,
    stock: 0,
    tags: [],
  });

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      const data = await response.json();
      
      if (data.success && data.data?.products) {
        setProducts(data.data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Upload image
  const uploadImage = async (file: File): Promise<ProductImage | null> => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', file);

      // Pre-validate client-side to fail fast on hosts with strict limits
      const maxBytes = 4 * 1024 * 1024; // keep in sync with API
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        showNotification('error', 'Invalid file type. Use JPG, PNG, WEBP, or GIF.');
        return null;
      }
      if (file.size > maxBytes) {
        showNotification('error', 'File too large. Max 4MB.');
        return null;
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      // Some hosting providers return HTML/plaintext error pages on 4xx/5xx.
      // Guard JSON parsing to avoid "Unexpected token" errors.
      const contentType = response.headers.get('content-type') || '';
      let result: any = null;
      if (contentType.includes('application/json')) {
        result = await response.json();
      } else {
        const text = await response.text();
        if (!response.ok) {
          throw new Error(text || `Upload failed with status ${response.status}`);
        }
        // Fallback minimal shape if server responded 2xx but not JSON
        try {
          result = JSON.parse(text);
        } catch {
          throw new Error('Unexpected non-JSON response from server');
        }
      }
      
      if (result.success) {
        return result.data.images;
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      showNotification('error', `Failed to upload image: ${error}`);
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const uploadedImage = await uploadImage(file);
    
    if (uploadedImage) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, uploadedImage]
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingProduct ? `/api/products/${editingProduct._id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        await fetchProducts();
        resetForm();
        showNotification('success', editingProduct ? 'Product updated successfully!' : 'Product created successfully!');
      } else {
        throw new Error(result.message || 'Failed to save product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      showNotification('error', `Failed to save product: ${error}`);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      images: [],
      sizes: [],
      category: '',
      isCustomizable: false,
      customPrice: 0,
      isActive: true,
      stock: 0,
      tags: [],
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  // Edit product
  const editProduct = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      images: product.images,
      sizes: product.sizes,
      category: product.category || '',
      isCustomizable: product.isCustomizable,
      customPrice: product.customPrice || 0,
      isActive: product.isActive,
      stock: product.stock || 0,
      tags: product.tags || [],
    });
    setEditingProduct(product);
    setShowForm(true);
  };

  // Show notification
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Delete product
  const deleteProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchProducts();
        setDeleteConfirm({ product: null, show: false });
        showNotification('success', 'Product deleted successfully!');
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      showNotification('error', `Failed to delete product: ${error}`);
    }
  };

  // Show delete confirmation
  const showDeleteConfirm = (product: Product) => {
    setDeleteConfirm({ product, show: true });
  };

  // Helper functions for form arrays
  const addSize = () => {
    setFormData(prev => ({ ...prev, sizes: [...prev.sizes, ''] }));
  };

  const removeSize = (index: number) => {
    setFormData(prev => ({ ...prev, sizes: prev.sizes.filter((_, i) => i !== index) }));
  };

  const updateSize = (index: number, value: string) => {
    setFormData(prev => ({ ...prev, sizes: prev.sizes.map((size, i) => i === index ? value : size) }));
  };

  const addTag = () => {
    setFormData(prev => ({ ...prev, tags: [...prev.tags, ''] }));
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter((_, i) => i !== index) }));
  };

  const updateTag = (index: number, value: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.map((tag, i) => i === index ? value : tag) }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <div className="text-lg font-display font-bold uppercase tracking-tight text-black">
            Loading Products...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border-6 border-black shadow-brutal p-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
          <div className="mb-4 lg:mb-0">
            <h2 className="text-3xl font-display font-bold uppercase tracking-tight text-black mb-2">
              Products Management
            </h2>
            <p className="text-lg text-brand-accent font-bold">
              Manage your brutalist merch catalog
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowForm(true)}
              className="btn-brutal bg-brand-green text-black font-bold uppercase tracking-wider"
            >
              Add New Product
            </button>
            <button
              onClick={fetchProducts}
              className="btn-brutal bg-black text-white font-bold uppercase tracking-wider"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

       {/* Products Stats */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="bg-white border-4 border-black shadow-brutal p-4 text-center rounded-lg hover:shadow-brutalMd transition-all duration-200">
           <div className="w-12 h-12 bg-blue-100 border-2 border-blue-300 mx-auto mb-3 flex items-center justify-center rounded-lg">
             <ShoppingBag className="w-6 h-6 text-blue-600" />
           </div>
           <div className="text-2xl font-bold text-black mb-1">{products.length}</div>
           <div className="text-xs text-brand-accent font-bold uppercase tracking-wider">Total Products</div>
           <div className="text-xs mt-1 text-gray-500">All products in catalog</div>
         </div>
         
         <div className="bg-white border-4 border-black shadow-brutal p-4 text-center rounded-lg hover:shadow-brutalMd transition-all duration-200">
           <div className="w-12 h-12 bg-green-100 border-2 border-green-300 mx-auto mb-3 flex items-center justify-center rounded-lg">
             <CheckSquare className="w-6 h-6 text-green-600" />
           </div>
           <div className="text-2xl font-bold text-black mb-1">{products.filter(p => p.isActive).length}</div>
           <div className="text-xs text-brand-accent font-bold uppercase tracking-wider">Active Products</div>
           <div className="text-xs mt-1 text-gray-500">Currently available</div>
         </div>
         
         <div className="bg-white border-4 border-black shadow-brutal p-4 text-center rounded-lg hover:shadow-brutalMd transition-all duration-200">
           <div className="w-12 h-12 bg-purple-100 border-2 border-purple-300 mx-auto mb-3 flex items-center justify-center rounded-lg">
             <Palette className="w-6 h-6 text-purple-600" />
           </div>
           <div className="text-2xl font-bold text-black mb-1">{products.filter(p => p.isCustomizable).length}</div>
           <div className="text-xs text-brand-accent font-bold uppercase tracking-wider">Customizable</div>
           <div className="text-xs mt-1 text-gray-500">With custom text options</div>
         </div>
       </div>

       {/* Products Grid */}
       {products.length === 0 ? (
         <div className="bg-white border-6 border-black shadow-brutal p-12 text-center">
           <div className="w-16 h-16 bg-gray-100 border-3 border-gray-300 mx-auto mb-4 flex items-center justify-center rounded-lg">
             <ShoppingBag className="w-8 h-8 text-gray-500" />
           </div>
           <p className="text-xl text-brand-accent font-bold mb-2">No products yet</p>
           <p className="text-sm text-gray-500 mb-4">Create your first product to get started</p>
           <button
             onClick={() => setShowForm(true)}
             className="btn-brutal bg-brand-green text-black font-bold uppercase tracking-wider"
           >
             Add First Product
           </button>
         </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white border-6 border-black shadow-brutal hover:shadow-brutalMd transition-all duration-200">
              {/* Product Image */}
              <div className="aspect-square bg-gray-200 overflow-hidden border-b-6 border-black">
                {product.images.length > 0 ? (
                  <img
                    src={product.images[0].medium}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-gray-500">
                     <div className="text-center">
                       <div className="w-12 h-12 bg-gray-100 border-2 border-gray-300 mx-auto mb-2 flex items-center justify-center rounded">
                         <Package className="w-6 h-6 text-gray-400" />
                       </div>
                       <div className="text-sm">No Image</div>
                     </div>
                   </div>
                 )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-black">{product.name}</h3>
                  <div className={`px-2 py-1 text-xs font-bold uppercase tracking-wider border-2 ${
                    product.isActive ? 'bg-green-100 text-green-800 border-green-400' : 'bg-red-100 text-red-800 border-red-400'
                  }`}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
                
                <p className="text-xl font-bold text-brand-green mb-2">${product.price}</p>
                
                <div className="text-sm text-gray-600 space-y-1 mb-4">
                  <div><strong>Sizes:</strong> {product.sizes.join(', ') || 'None'}</div>
                  <div><strong>Stock:</strong> {product.stock || 0}</div>
                  <div><strong>Category:</strong> {product.category || 'Uncategorized'}</div>
                  {product.isCustomizable && (
                    <div><strong>Custom Fee:</strong> ${product.customPrice || 0}</div>
                  )}
                </div>

                {product.description && (
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{product.description}</p>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => editProduct(product)}
                    className="flex-1 px-3 py-2 bg-brand-green text-black border-3 border-black shadow-brutal hover:shadow-brutalMd transition-all duration-200 font-bold text-sm uppercase tracking-wider"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => showDeleteConfirm(product)}
                    className="px-3 py-2 bg-red-500 text-white border-3 border-black shadow-brutal hover:shadow-brutalMd transition-all duration-200 font-bold text-sm uppercase tracking-wider"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Form Modal */}
      {showForm && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => resetForm()}
        >
          <div 
            className="bg-white border-6 border-black shadow-brutalLg max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-green border-3 border-black flex items-center justify-center rounded">
                    <Package className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-bold uppercase tracking-tight text-black">
                      {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <p className="text-sm text-gray-600 font-medium">
                      {editingProduct ? 'Update product information' : 'Create a new product for your store'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={resetForm}
                  className="w-10 h-10 bg-gray-100 border-3 border-gray-300 hover:border-red-400 hover:bg-red-50 transition-all duration-200 flex items-center justify-center rounded"
                >
                  <XCircle className="w-5 h-5 text-gray-600 hover:text-red-600" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information Section */}
                <div className="bg-gray-50 border-3 border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-blue-100 border-2 border-blue-300 flex items-center justify-center rounded">
                      <Package className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold uppercase tracking-wider text-black">Basic Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold uppercase tracking-wider text-black mb-3">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 border-3 border-gray-300 focus:border-black focus:shadow-brutal transition-all duration-200 font-body text-black rounded"
                        required
                        placeholder="Enter product name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold uppercase tracking-wider text-black mb-3">
                        Price ($) *
                      </label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                        className="w-full px-4 py-3 border-3 border-gray-300 focus:border-black focus:shadow-brutal transition-all duration-200 font-body text-black rounded"
                        required
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-bold uppercase tracking-wider text-black mb-3">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-3 border-3 border-gray-300 focus:border-black focus:shadow-brutal transition-all duration-200 font-body text-black h-24 rounded"
                      placeholder="Describe your product..."
                    />
                  </div>
                </div>

                {/* Product Details Section */}
                <div className="bg-gray-50 border-3 border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-purple-100 border-2 border-purple-300 flex items-center justify-center rounded">
                      <Shirt className="w-4 h-4 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-bold uppercase tracking-wider text-black">Product Details</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-bold uppercase tracking-wider text-black mb-3">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-4 py-3 border-3 border-gray-300 focus:border-black focus:shadow-brutal transition-all duration-200 font-body text-black rounded"
                      >
                        <option value="">Select Category</option>
                        <option value="Hoodies">Hoodies</option>
                        <option value="T-Shirts">T-Shirts</option>
                        <option value="Tank Tops">Tank Tops</option>
                        <option value="Long Sleeves">Long Sleeves</option>
                        <option value="Accessories">Accessories</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold uppercase tracking-wider text-black mb-3">
                        Stock Quantity
                      </label>
                      <input
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                        className="w-full px-4 py-3 border-3 border-gray-300 focus:border-black focus:shadow-brutal transition-all duration-200 font-body text-black rounded"
                        min="0"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* Sizes */}
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-black mb-3">
                      Available Sizes *
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                      {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'].map((size) => (
                        <label key={size} className="flex items-center space-x-3 cursor-pointer p-3 border-2 border-gray-200 hover:border-brand-green hover:bg-green-50 transition-all duration-200 rounded">
                          <input
                            type="checkbox"
                            checked={formData.sizes.includes(size)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData(prev => ({ ...prev, sizes: [...prev.sizes, size] }));
                              } else {
                                setFormData(prev => ({ ...prev, sizes: prev.sizes.filter(s => s !== size) }));
                              }
                            }}
                            className="w-4 h-4 text-brand-green border-2 border-gray-300 rounded focus:ring-brand-green focus:ring-2"
                          />
                          <span className="text-sm font-bold uppercase tracking-wider text-black">
                            {size}
                          </span>
                        </label>
                      ))}
                    </div>
                    {formData.sizes.length === 0 && (
                      <p className="text-sm text-red-500 mt-3 font-medium">Please select at least one size</p>
                    )}
                  </div>
                </div>

                {/* Customization Section */}
                <div className="bg-gray-50 border-3 border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-orange-100 border-2 border-orange-300 flex items-center justify-center rounded">
                      <Edit3 className="w-4 h-4 text-orange-600" />
                    </div>
                    <h3 className="text-lg font-bold uppercase tracking-wider text-black">Customization Options</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded">
                      <input
                        type="checkbox"
                        id="isCustomizable"
                        checked={formData.isCustomizable}
                        onChange={(e) => setFormData(prev => ({ ...prev, isCustomizable: e.target.checked }))}
                        className="w-5 h-5 text-brand-green border-2 border-gray-300 rounded focus:ring-brand-green focus:ring-2"
                      />
                      <label htmlFor="isCustomizable" className="text-sm font-bold uppercase tracking-wider text-black cursor-pointer">
                        Enable Custom Text
                      </label>
                    </div>
                    {formData.isCustomizable && (
                      <div>
                        <label className="block text-sm font-bold uppercase tracking-wider text-black mb-3">
                          Custom Text Fee ($)
                        </label>
                        <input
                          type="number"
                          value={formData.customPrice}
                          onChange={(e) => setFormData(prev => ({ ...prev, customPrice: parseFloat(e.target.value) || 0 }))}
                          className="w-full px-4 py-3 border-3 border-gray-300 focus:border-black focus:shadow-brutal transition-all duration-200 font-body text-black rounded"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Media & Settings Section */}
                <div className="bg-gray-50 border-3 border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-green-100 border-2 border-green-300 flex items-center justify-center rounded">
                      <Package className="w-4 h-4 text-green-600" />
                    </div>
                    <h3 className="text-lg font-bold uppercase tracking-wider text-black">Media & Settings</h3>
                  </div>

                  {/* Image Upload */}
                  <div className="mb-6">
                    <label className="block text-sm font-bold uppercase tracking-wider text-black mb-3">
                      Product Images
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="px-6 py-3 bg-brand-green text-black border-3 border-black shadow-brutal hover:shadow-brutalMd transition-all duration-200 font-bold uppercase tracking-wider rounded mb-4"
                    >
                      {uploading ? 'Uploading...' : 'Upload Image'}
                    </button>
                    
                    {/* Image Preview */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image.medium}
                            alt={`Product ${index + 1}`}
                            className="w-full aspect-square object-cover border-3 border-black rounded"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white font-bold border-2 border-black text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="mb-6">
                    <label className="block text-sm font-bold uppercase tracking-wider text-black mb-3">
                      Product Tags
                    </label>
                    <div className="space-y-3">
                      {formData.tags.map((tag, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={tag}
                            onChange={(e) => updateTag(index, e.target.value)}
                            className="flex-1 px-4 py-2 border-3 border-gray-300 focus:border-black focus:shadow-brutal transition-all duration-200 font-body text-black rounded"
                            placeholder="Enter tag"
                          />
                          <button
                            type="button"
                            onClick={() => removeTag(index)}
                            className="px-3 py-2 bg-red-500 text-white border-3 border-black shadow-brutal hover:shadow-brutalMd transition-all duration-200 font-bold text-sm uppercase tracking-wider rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addTag}
                        className="px-4 py-2 bg-gray-500 text-white border-3 border-black shadow-brutal hover:shadow-brutalMd transition-all duration-200 font-bold text-sm uppercase tracking-wider rounded"
                      >
                        Add Tag
                      </button>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="w-5 h-5 text-brand-green border-2 border-gray-300 rounded focus:ring-brand-green focus:ring-2"
                    />
                    <label htmlFor="isActive" className="text-sm font-bold uppercase tracking-wider text-black cursor-pointer">
                      Active Product
                    </label>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-8 border-t-4 border-gray-300">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-4 bg-brand-green text-black border-3 border-black shadow-brutal hover:shadow-brutalMd transition-all duration-200 font-bold uppercase tracking-wider rounded text-lg"
                  >
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-6 py-4 bg-gray-500 text-white border-3 border-black shadow-brutal hover:shadow-brutalMd transition-all duration-200 font-bold uppercase tracking-wider rounded text-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && deleteConfirm.product && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setDeleteConfirm({ product: null, show: false })}
        >
          <div 
            className="bg-white border-6 border-black shadow-brutalLg max-w-md w-full rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-red-100 border-3 border-red-400 flex items-center justify-center rounded">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-display font-bold uppercase tracking-tight text-black">
                    Delete Product
                  </h2>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>

              <div className="mb-6 p-4 bg-gray-50 border-3 border-gray-200 rounded">
                <div className="space-y-2 text-sm">
                  <div><strong>Product Name:</strong> {deleteConfirm.product.name}</div>
                  <div><strong>Category:</strong> {deleteConfirm.product.category || 'Uncategorized'}</div>
                  <div><strong>Price:</strong> ${deleteConfirm.product.price.toFixed(2)}</div>
                  <div><strong>Status:</strong> {deleteConfirm.product.isActive ? 'Active' : 'Inactive'}</div>
                  {deleteConfirm.product.stock !== undefined && (
                    <div><strong>Stock:</strong> {deleteConfirm.product.stock}</div>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm({ product: null, show: false })}
                  className="flex-1 px-4 py-3 bg-gray-500 text-white border-3 border-black shadow-brutal hover:shadow-brutalMd transition-all duration-200 font-bold uppercase tracking-wider rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteProduct(deleteConfirm.product!._id)}
                  className="flex-1 px-4 py-3 bg-red-500 text-white border-3 border-black shadow-brutal hover:shadow-brutalMd transition-all duration-200 font-bold uppercase tracking-wider rounded"
                >
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className={`border-6 border-black shadow-brutalLg p-4 rounded-lg max-w-md ${
            notification.type === 'success' ? 'bg-green-100 text-green-800' :
            notification.type === 'error' ? 'bg-red-100 text-red-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            <div className="flex items-center gap-3">
              {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
              {notification.type === 'error' && <XCircle className="w-5 h-5" />}
              {notification.type === 'info' && <MessageCircle className="w-5 h-5" />}
              <span className="font-bold uppercase tracking-wider">{notification.message}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
