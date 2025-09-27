"use client";
import { useEffect, useState, useRef } from "react";

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

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (result.success) {
        return result.data.images;
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image: ' + error);
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
        alert(editingProduct ? 'Product updated successfully!' : 'Product created successfully!');
      } else {
        throw new Error(result.message || 'Failed to save product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product: ' + error);
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

  // Delete product
  const deleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchProducts();
        alert('Product deleted successfully!');
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product: ' + error);
    }
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border-6 border-black shadow-brutal p-4 text-center">
          <div className="text-2xl mb-2">🛍️</div>
          <div className="text-xl font-bold text-black">{products.length}</div>
          <div className="text-xs text-brand-accent font-bold uppercase tracking-wider">Total Products</div>
        </div>
        <div className="bg-white border-6 border-black shadow-brutal p-4 text-center">
          <div className="text-2xl mb-2">✅</div>
          <div className="text-xl font-bold text-black">{products.filter(p => p.isActive).length}</div>
          <div className="text-xs text-brand-accent font-bold uppercase tracking-wider">Active Products</div>
        </div>
        <div className="bg-white border-6 border-black shadow-brutal p-4 text-center">
          <div className="text-2xl mb-2">🎨</div>
          <div className="text-xl font-bold text-black">{products.filter(p => p.isCustomizable).length}</div>
          <div className="text-xs text-brand-accent font-bold uppercase tracking-wider">Customizable</div>
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="bg-white border-6 border-black shadow-brutal p-12 text-center">
          <div className="text-6xl mb-4">🛍️</div>
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
                      <div className="text-4xl mb-2">📷</div>
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
                    onClick={() => deleteProduct(product._id)}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white border-6 border-black shadow-brutalLg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-display font-bold uppercase tracking-tight text-black">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-3xl font-bold text-gray-500 hover:text-black transition-colors"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-black mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 border-3 border-gray-300 focus:border-black transition-colors font-body text-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-black mb-2">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-4 py-3 border-3 border-gray-300 focus:border-black transition-colors font-body text-black"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-black mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 border-3 border-gray-300 focus:border-black transition-colors font-body text-black h-24"
                  />
                </div>

                {/* Category and Stock */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-black mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 border-3 border-gray-300 focus:border-black transition-colors font-body text-black"
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
                    <label className="block text-sm font-bold uppercase tracking-wider text-black mb-2">
                      Stock
                    </label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                      className="w-full px-4 py-3 border-3 border-gray-300 focus:border-black transition-colors font-body text-black"
                      min="0"
                    />
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-black mb-2">
                    Sizes *
                  </label>
                  <div className="space-y-2">
                    {formData.sizes.map((size, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={size}
                          onChange={(e) => updateSize(index, e.target.value)}
                          className="flex-1 px-3 py-2 border-3 border-gray-300 focus:border-black transition-colors font-body text-black"
                          placeholder="Size (e.g., S, M, L, XL)"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => removeSize(index)}
                          className="px-3 py-2 bg-red-500 text-white font-bold border-3 border-black"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addSize}
                      className="btn-brutal bg-brand-green text-black font-bold uppercase tracking-wider"
                    >
                      Add Size
                    </button>
                  </div>
                </div>

                {/* Customization */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="isCustomizable"
                      checked={formData.isCustomizable}
                      onChange={(e) => setFormData(prev => ({ ...prev, isCustomizable: e.target.checked }))}
                      className="w-5 h-5"
                    />
                    <label htmlFor="isCustomizable" className="text-sm font-bold uppercase tracking-wider text-black">
                      Customizable Product
                    </label>
                  </div>
                  {formData.isCustomizable && (
                    <div>
                      <label className="block text-sm font-bold uppercase tracking-wider text-black mb-2">
                        Custom Text Fee ($)
                      </label>
                      <input
                        type="number"
                        value={formData.customPrice}
                        onChange={(e) => setFormData(prev => ({ ...prev, customPrice: parseFloat(e.target.value) || 0 }))}
                        className="w-full px-4 py-3 border-3 border-gray-300 focus:border-black transition-colors font-body text-black"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  )}
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-black mb-2">
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
                    className="btn-brutal bg-brand-green text-black font-bold uppercase tracking-wider mb-4"
                  >
                    {uploading ? 'Uploading...' : 'Upload Image'}
                  </button>
                  
                  {/* Image Preview */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image.medium}
                          alt={`Product ${index + 1}`}
                          className="w-full aspect-square object-cover border-3 border-black"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white font-bold border-2 border-black text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-black mb-2">
                    Tags
                  </label>
                  <div className="space-y-2">
                    {formData.tags.map((tag, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={tag}
                          onChange={(e) => updateTag(index, e.target.value)}
                          className="flex-1 px-3 py-2 border-3 border-gray-300 focus:border-black transition-colors font-body text-black"
                          placeholder="Tag (e.g., brutalist, streetwear)"
                        />
                        <button
                          type="button"
                          onClick={() => removeTag(index)}
                          className="px-3 py-2 bg-red-500 text-white font-bold border-3 border-black"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addTag}
                      className="btn-brutal bg-brand-green text-black font-bold uppercase tracking-wider"
                    >
                      Add Tag
                    </button>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="w-5 h-5"
                  />
                  <label htmlFor="isActive" className="text-sm font-bold uppercase tracking-wider text-black">
                    Active Product
                  </label>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-6 border-t-3 border-gray-300">
                  <button
                    type="submit"
                    className="flex-1 btn-brutal bg-brand-green text-black font-bold uppercase tracking-wider py-3"
                  >
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 btn-brutal bg-gray-500 text-white font-bold uppercase tracking-wider py-3"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
