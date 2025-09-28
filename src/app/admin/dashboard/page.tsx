"use client";
import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminLayout } from "@/components/AdminLayout";

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  pendingOrders: number;
  recentOrders: RecentOrder[];
  topProducts: TopProduct[];
  salesGrowth: number;
}

interface RecentOrder {
  _id: string;
  orderId: string;
  customerInfo: {
    fullName: string;
  };
  productDetails: {
    productId: {
      _id: string;
      name: string;
    };
    size?: string;
  };
  pricing: {
    totalPrice: number;
  };
  status: string;
  createdAt: string;
}

interface TopProduct {
  _id: string;
  name: string;
  orders: number;
  revenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    pendingOrders: 0,
    recentOrders: [],
    topProducts: [],
    salesGrowth: 0,
  });
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch orders and products
      const [ordersResponse, productsResponse] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/products')
      ]);

      const ordersData = await ordersResponse.json();
      const productsData = await productsResponse.json();
      
      if (ordersData.success && ordersData.data?.orders && productsData.success && productsData.data?.products) {
        const orders = ordersData.data.orders;
        const products = productsData.data.products;
        
        // Calculate stats
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum: number, order: RecentOrder) => sum + order.pricing.totalPrice, 0);
        const totalProducts = products.length;
        const pendingOrders = orders.filter((order: RecentOrder) => order.status === 'pending').length;
        
        // Get recent orders (last 5)
        const recentOrders = orders
          .sort((a: RecentOrder, b: RecentOrder) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);

        // Calculate top products from actual order data
        const productStats = new Map();
        orders.forEach((order: RecentOrder) => {
          const productId = order.productDetails.productId._id || order.productDetails.productId;
          const productName = order.productDetails.productId.name || 'Unknown Product';
          
          if (!productStats.has(productId)) {
            productStats.set(productId, {
              _id: productId,
              name: productName,
              orders: 0,
              revenue: 0
            });
          }
          
          const stats = productStats.get(productId);
          stats.orders += 1;
          stats.revenue += order.pricing.totalPrice;
        });

        const topProducts: TopProduct[] = Array.from(productStats.values())
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 3);

        setStats({
          totalOrders,
          totalRevenue,
          totalProducts,
          pendingOrders,
          recentOrders,
          topProducts,
          salesGrowth: 0,
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-400';
      case 'contacted': return 'bg-blue-100 text-blue-800 border-blue-400';
      case 'printed': return 'bg-purple-100 text-purple-800 border-purple-400';
      case 'shipping': return 'bg-indigo-100 text-indigo-800 border-indigo-400';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-400';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-400';
      default: return 'bg-gray-100 text-gray-800 border-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'contacted': return 'Contacted';
      case 'printed': return 'Printed';
      case 'shipping': return 'Shipping';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <AdminLayout>
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="text-4xl mb-4">⏳</div>
              <div className="text-lg font-display font-bold uppercase tracking-tight text-black">
                Loading Dashboard...
              </div>
            </div>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-white border-6 border-black shadow-brutal p-6 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-display font-bold uppercase tracking-tight text-black mb-2">
                  Welcome Back!
                </h3>
                <p className="text-lg text-brand-accent font-bold">
                  Here's what's happening with your store today
                </p>
              </div>
              <button
                onClick={fetchDashboardData}
                className="btn-brutal bg-brand-green text-black font-bold uppercase tracking-wider"
              >
                Refresh Data
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border-6 border-black shadow-brutal p-6 text-center rounded-lg">
              <div className="text-4xl mb-3">💰</div>
              <div className="text-3xl font-bold text-black mb-2">${stats.totalRevenue.toFixed(2)}</div>
              <div className="text-sm text-brand-accent font-bold uppercase tracking-wider">Total Revenue</div>
              <div className="text-xs mt-2 text-gray-500">All time revenue</div>
            </div>
            
            <div className="bg-white border-6 border-black shadow-brutal p-6 text-center rounded-lg">
              <div className="text-4xl mb-3">📦</div>
              <div className="text-3xl font-bold text-black mb-2">{stats.totalOrders}</div>
              <div className="text-sm text-brand-accent font-bold uppercase tracking-wider">Total Orders</div>
              <div className="text-xs mt-2 text-gray-500">All time orders</div>
            </div>
            
            <div className="bg-white border-6 border-black shadow-brutal p-6 text-center rounded-lg">
              <div className="text-4xl mb-3">🛍️</div>
              <div className="text-3xl font-bold text-black mb-2">{stats.totalProducts}</div>
              <div className="text-sm text-brand-accent font-bold uppercase tracking-wider">Products</div>
              <div className="text-xs mt-2 text-gray-500">In catalog</div>
            </div>
            
            <div className="bg-white border-6 border-black shadow-brutal p-6 text-center rounded-lg">
              <div className="text-4xl mb-3">⏳</div>
              <div className="text-3xl font-bold text-black mb-2">{stats.pendingOrders}</div>
              <div className="text-sm text-brand-accent font-bold uppercase tracking-wider">Pending</div>
              <div className="text-xs mt-2 text-gray-500">Need attention</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <div className="bg-white border-6 border-black shadow-brutal p-6 rounded-lg">
              <h3 className="text-xl font-display font-bold uppercase tracking-tight text-black mb-6">
                Recent Orders
              </h3>
              {stats.recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📦</div>
                  <p className="text-brand-accent font-bold">No orders yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {stats.recentOrders.map((order) => (
                    <div key={order._id} className="flex justify-between items-center p-3 bg-gray-50 border-3 border-gray-300 rounded">
                      <div>
                        <div className="font-bold text-black">{order.orderId}</div>
                        <div className="text-sm text-brand-accent">{order.customerInfo.fullName}</div>
                        <div className="text-xs text-gray-500">{order.productDetails.productId?.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-black">${order.pricing.totalPrice.toFixed(2)}</div>
                        <div className={`inline-block px-2 py-1 text-xs font-bold uppercase tracking-wider border-2 rounded ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top Products */}
            <div className="bg-white border-6 border-black shadow-brutal p-6 rounded-lg">
              <h3 className="text-xl font-display font-bold uppercase tracking-tight text-black mb-6">
                Top Products
              </h3>
              {stats.topProducts.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">🛍️</div>
                  <p className="text-brand-accent font-bold">No sales data</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {stats.topProducts.map((product, index) => (
                    <div key={product._id} className="flex justify-between items-center p-3 bg-gray-50 border-3 border-gray-300 rounded">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-brand-green text-black border-3 border-black flex items-center justify-center font-bold text-sm mr-3">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-bold text-black">{product.name}</div>
                          <div className="text-sm text-brand-accent">{product.orders} orders</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-black">${product.revenue}</div>
                        <div className="text-sm text-gray-500">revenue</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-black text-white border-6 border-black shadow-brutal p-6 rounded-lg">
            <h3 className="text-xl font-display font-bold uppercase tracking-tight mb-6">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <a
                href="/admin/orders"
                className="bg-brand-green text-black p-4 rounded border-3 border-white shadow-brutal hover:shadow-brutalMd transition-all duration-200 text-center font-bold uppercase tracking-wider"
              >
                <div className="text-2xl mb-2">📦</div>
                View Orders
              </a>
              <a
                href="/admin/products"
                className="bg-brand-green text-black p-4 rounded border-3 border-white shadow-brutal hover:shadow-brutalMd transition-all duration-200 text-center font-bold uppercase tracking-wider"
              >
                <div className="text-2xl mb-2">🛍️</div>
                Manage Products
              </a>
              <a
                href="/admin/analytics"
                className="bg-brand-green text-black p-4 rounded border-3 border-white shadow-brutal hover:shadow-brutalMd transition-all duration-200 text-center font-bold uppercase tracking-wider"
              >
                <div className="text-2xl mb-2">📈</div>
                View Analytics
              </a>
              <a
                href="/admin/settings"
                className="bg-brand-green text-black p-4 rounded border-3 border-white shadow-brutal hover:shadow-brutalMd transition-all duration-200 text-center font-bold uppercase tracking-wider"
              >
                <div className="text-2xl mb-2">⚙️</div>
                Settings
              </a>
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
