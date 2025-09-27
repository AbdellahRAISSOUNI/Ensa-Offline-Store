"use client";
import { useEffect, useState } from "react";

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  pendingOrders: number;
}

interface RecentOrder {
  _id: string;
  orderId: string;
  customerInfo: {
    fullName: string;
  };
  productDetails: {
    productId: {
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

export default function DashboardTab() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch orders
      const ordersResponse = await fetch('/api/orders');
      const ordersData = await ordersResponse.json();
      
      // Fetch products
      const productsResponse = await fetch('/api/products');
      const productsData = await productsResponse.json();
      
      if (ordersData.success && ordersData.data?.orders && productsData.success && productsData.data?.products) {
        const orders = ordersData.data.orders;
        const products = productsData.data.products;
        
        // Calculate stats
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum: number, order: RecentOrder) => sum + order.pricing.totalPrice, 0);
        const totalProducts = products.length;
        const pendingOrders = orders.filter((order: RecentOrder) => order.status === 'pending').length;
        
        setStats({
          totalOrders,
          totalRevenue,
          totalProducts,
          pendingOrders,
        });
        
        // Get recent orders (last 5)
        const sortedOrders = orders
          .sort((a: RecentOrder, b: RecentOrder) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);
        
        setRecentOrders(sortedOrders);
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
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <div className="text-lg font-display font-bold uppercase tracking-tight text-black">
            Loading Dashboard...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white border-6 border-black shadow-brutal p-6">
        <h2 className="text-3xl font-display font-bold uppercase tracking-tight text-black mb-4">
          Welcome to ENSA OFFLINE Admin
        </h2>
        <p className="text-lg text-brand-accent font-bold">
          Manage your brutalist merch empire with grace under pressure
        </p>
        <button
          onClick={fetchDashboardData}
          className="mt-4 btn-brutal bg-brand-green text-black font-bold uppercase tracking-wider"
        >
          Refresh Data
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border-6 border-black shadow-brutal p-6 text-center">
          <div className="text-4xl mb-3">📦</div>
          <div className="text-3xl font-bold text-black mb-2">{stats.totalOrders}</div>
          <div className="text-sm text-brand-accent font-bold uppercase tracking-wider">Total Orders</div>
        </div>
        
        <div className="bg-white border-6 border-black shadow-brutal p-6 text-center">
          <div className="text-4xl mb-3">💰</div>
          <div className="text-3xl font-bold text-black mb-2">${stats.totalRevenue.toFixed(2)}</div>
          <div className="text-sm text-brand-accent font-bold uppercase tracking-wider">Revenue</div>
        </div>
        
        <div className="bg-white border-6 border-black shadow-brutal p-6 text-center">
          <div className="text-4xl mb-3">🛍️</div>
          <div className="text-3xl font-bold text-black mb-2">{stats.totalProducts}</div>
          <div className="text-sm text-brand-accent font-bold uppercase tracking-wider">Products</div>
        </div>
        
        <div className="bg-white border-6 border-black shadow-brutal p-6 text-center">
          <div className="text-4xl mb-3">⏳</div>
          <div className="text-3xl font-bold text-black mb-2">{stats.pendingOrders}</div>
          <div className="text-sm text-brand-accent font-bold uppercase tracking-wider">Pending</div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white border-6 border-black shadow-brutal p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-display font-bold uppercase tracking-tight text-black">
            Recent Orders
          </h3>
          <button
            onClick={fetchDashboardData}
            className="text-sm text-brand-accent font-bold hover:text-black transition-colors uppercase tracking-wider"
          >
            Refresh
          </button>
        </div>
        
        {recentOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-xl text-brand-accent font-bold mb-2">No orders yet</p>
            <p className="text-sm text-gray-500">Orders will appear here once customers start placing them</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order._id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-gray-50 border-3 border-gray-300 hover:border-black transition-colors">
                <div className="mb-2 sm:mb-0">
                  <div className="font-bold text-black text-lg">{order.orderId}</div>
                  <div className="text-sm text-brand-accent font-bold">{order.customerInfo.fullName}</div>
                  <div className="text-xs text-gray-500">
                    {order.productDetails.productId?.name} 
                    {order.productDetails.size && ` - ${order.productDetails.size}`}
                  </div>
                </div>
                <div className="flex flex-col sm:text-right">
                  <div className="font-bold text-black text-lg">${order.pricing.totalPrice.toFixed(2)}</div>
                  <div className={`inline-block px-2 py-1 text-xs font-bold uppercase tracking-wider border-2 ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
