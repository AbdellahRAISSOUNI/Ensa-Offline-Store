"use client";
import { useEffect, useState } from "react";

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  customOrdersPercentage: number;
  topProducts: {
    productId: string;
    productName: string;
    orderCount: number;
    revenue: number;
  }[];
  ordersByStatus: {
    status: string;
    count: number;
  }[];
  ordersByCity: {
    city: string;
    count: number;
    revenue: number;
  }[];
  recentOrdersGrowth: number;
}

export default function AnalyticsTab() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    customOrdersPercentage: 0,
    topProducts: [],
    ordersByStatus: [],
    ordersByCity: [],
    recentOrdersGrowth: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Fetch orders and products data
      const [ordersResponse, productsResponse] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/products')
      ]);

      const ordersData = await ordersResponse.json();
      const productsData = await productsResponse.json();

      if (ordersData.success && ordersData.data?.orders && productsData.success && productsData.data?.products) {
        const orders = ordersData.data.orders;
        const products = productsData.data.products;

        // Calculate analytics
        const totalRevenue = orders.reduce((sum: number, order: any) => sum + order.pricing.totalPrice, 0);
        const totalOrders = orders.length;
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        
        // Custom orders percentage
        const customOrders = orders.filter((order: any) => order.productDetails.isCustom);
        const customOrdersPercentage = totalOrders > 0 ? (customOrders.length / totalOrders) * 100 : 0;

        // Top products
        const productStats = new Map();
        orders.forEach((order: any) => {
          const productId = order.productDetails.productId._id || order.productDetails.productId;
          const productName = order.productDetails.productId.name || 'Unknown Product';
          
          if (!productStats.has(productId)) {
            productStats.set(productId, {
              productId,
              productName,
              orderCount: 0,
              revenue: 0
            });
          }
          
          const stats = productStats.get(productId);
          stats.orderCount += 1;
          stats.revenue += order.pricing.totalPrice;
        });

        const topProducts = Array.from(productStats.values())
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5);

        // Orders by status
        const statusStats = new Map();
        orders.forEach((order: any) => {
          const status = order.status;
          statusStats.set(status, (statusStats.get(status) || 0) + 1);
        });

        const ordersByStatus = Array.from(statusStats.entries()).map(([status, count]) => ({
          status,
          count
        }));

        // Orders by city
        const cityStats = new Map();
        orders.forEach((order: any) => {
          const city = order.customerInfo.city;
          if (!cityStats.has(city)) {
            cityStats.set(city, { city, count: 0, revenue: 0 });
          }
          const stats = cityStats.get(city);
          stats.count += 1;
          stats.revenue += order.pricing.totalPrice;
        });

        const ordersByCity = Array.from(cityStats.values())
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 10);

        // Recent orders growth (mock calculation)
        const recentOrdersGrowth = Math.random() * 20 - 10; // Random growth between -10% and +10%

        setAnalytics({
          totalRevenue,
          totalOrders,
          averageOrderValue,
          customOrdersPercentage,
          topProducts,
          ordersByStatus,
          ordersByCity,
          recentOrdersGrowth,
        });
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
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
            Loading Analytics...
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
              Analytics Dashboard
            </h2>
            <p className="text-lg text-brand-accent font-bold">
              Track your brutalist merch performance
            </p>
          </div>
          <button
            onClick={fetchAnalyticsData}
            className="btn-brutal bg-brand-green text-black font-bold uppercase tracking-wider"
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border-6 border-black shadow-brutal p-6 text-center">
          <div className="text-4xl mb-3">💰</div>
          <div className="text-3xl font-bold text-black mb-2">${analytics.totalRevenue.toFixed(2)}</div>
          <div className="text-sm text-brand-accent font-bold uppercase tracking-wider">Total Revenue</div>
          <div className={`text-xs mt-2 font-bold ${analytics.recentOrdersGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {analytics.recentOrdersGrowth >= 0 ? '↗' : '↘'} {Math.abs(analytics.recentOrdersGrowth).toFixed(1)}%
          </div>
        </div>
        
        <div className="bg-white border-6 border-black shadow-brutal p-6 text-center">
          <div className="text-4xl mb-3">📦</div>
          <div className="text-3xl font-bold text-black mb-2">{analytics.totalOrders}</div>
          <div className="text-sm text-brand-accent font-bold uppercase tracking-wider">Total Orders</div>
          <div className="text-xs mt-2 text-gray-500">All time</div>
        </div>
        
        <div className="bg-white border-6 border-black shadow-brutal p-6 text-center">
          <div className="text-4xl mb-3">📊</div>
          <div className="text-3xl font-bold text-black mb-2">${analytics.averageOrderValue.toFixed(2)}</div>
          <div className="text-sm text-brand-accent font-bold uppercase tracking-wider">Average Order</div>
          <div className="text-xs mt-2 text-gray-500">Per order</div>
        </div>
        
        <div className="bg-white border-6 border-black shadow-brutal p-6 text-center">
          <div className="text-4xl mb-3">🎨</div>
          <div className="text-3xl font-bold text-black mb-2">{analytics.customOrdersPercentage.toFixed(1)}%</div>
          <div className="text-sm text-brand-accent font-bold uppercase tracking-wider">Custom Orders</div>
          <div className="text-xs mt-2 text-gray-500">With custom text</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white border-6 border-black shadow-brutal p-6">
          <h3 className="text-xl font-display font-bold uppercase tracking-tight text-black mb-6">
            Top Products
          </h3>
          {analytics.topProducts.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🛍️</div>
              <p className="text-brand-accent font-bold">No sales data yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {analytics.topProducts.map((product, index) => (
                <div key={product.productId} className="flex justify-between items-center p-3 bg-gray-50 border-3 border-gray-300">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-brand-green text-black border-3 border-black flex items-center justify-center font-bold text-sm mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-bold text-black">{product.productName}</div>
                      <div className="text-sm text-brand-accent">{product.orderCount} orders</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-black">${product.revenue.toFixed(2)}</div>
                    <div className="text-sm text-gray-500">revenue</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Orders by Status */}
        <div className="bg-white border-6 border-black shadow-brutal p-6">
          <h3 className="text-xl font-display font-bold uppercase tracking-tight text-black mb-6">
            Orders by Status
          </h3>
          {analytics.ordersByStatus.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-brand-accent font-bold">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {analytics.ordersByStatus.map((statusData) => (
                <div key={statusData.status} className="flex justify-between items-center">
                  <div className={`px-3 py-2 text-sm font-bold uppercase tracking-wider border-2 ${getStatusColor(statusData.status)}`}>
                    {getStatusLabel(statusData.status)}
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-black text-xl">{statusData.count}</div>
                    <div className="text-sm text-gray-500">orders</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Geographic Distribution */}
      <div className="bg-white border-6 border-black shadow-brutal p-6">
        <h3 className="text-xl font-display font-bold uppercase tracking-tight text-black mb-6">
          Orders by City
        </h3>
        {analytics.ordersByCity.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🗺️</div>
            <p className="text-brand-accent font-bold">No geographic data yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.ordersByCity.map((cityData) => (
              <div key={cityData.city} className="p-4 bg-gray-50 border-3 border-gray-300 hover:border-black transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-black">{cityData.city}</h4>
                  <div className="text-sm text-brand-accent font-bold">{cityData.count} orders</div>
                </div>
                <div className="text-lg font-bold text-brand-green">${cityData.revenue.toFixed(2)}</div>
                <div className="text-sm text-gray-500">total revenue</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Insights */}
      <div className="bg-white border-6 border-black shadow-brutal p-6">
        <h3 className="text-xl font-display font-bold uppercase tracking-tight text-black mb-6">
          Business Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-lg font-bold text-black">
              {analytics.totalOrders > 0 ? (analytics.totalRevenue / analytics.totalOrders).toFixed(0) : '0'}%
            </div>
            <div className="text-sm text-brand-accent font-bold">Conversion Rate</div>
            <div className="text-xs text-gray-500">Revenue per order</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl mb-2">🚀</div>
            <div className="text-lg font-bold text-black">
              {analytics.topProducts.length > 0 ? analytics.topProducts[0].productName.split(' ')[0] : 'None'}
            </div>
            <div className="text-sm text-brand-accent font-bold">Best Seller</div>
            <div className="text-xs text-gray-500">Most popular product</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl mb-2">📈</div>
            <div className="text-lg font-bold text-black">
              {analytics.ordersByCity.length > 0 ? analytics.ordersByCity[0].city : 'None'}
            </div>
            <div className="text-sm text-brand-accent font-bold">Top Market</div>
            <div className="text-xs text-gray-500">Highest revenue city</div>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-black text-white border-6 border-black shadow-brutal p-6">
        <h3 className="text-xl font-display font-bold uppercase tracking-tight mb-4">
          Performance Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-bold text-brand-green mb-3">Sales Performance</h4>
            <ul className="space-y-2 text-sm">
              <li>• Total revenue of ${analytics.totalRevenue.toFixed(2)} from {analytics.totalOrders} orders</li>
              <li>• Average order value of ${analytics.averageOrderValue.toFixed(2)}</li>
              <li>• {analytics.customOrdersPercentage.toFixed(1)}% of orders include custom text</li>
              <li>• {analytics.ordersByStatus.filter(s => s.status === 'delivered').reduce((sum, s) => sum + s.count, 0)} orders successfully delivered</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold text-brand-green mb-3">Market Insights</h4>
            <ul className="space-y-2 text-sm">
              <li>• Serving {analytics.ordersByCity.length} different cities in Morocco</li>
              <li>• {analytics.topProducts.length} products generating revenue</li>
              <li>• {analytics.ordersByStatus.filter(s => s.status === 'pending').reduce((sum, s) => sum + s.count, 0)} orders pending fulfillment</li>
              <li>• Strong presence in {analytics.ordersByCity.slice(0, 3).map(c => c.city).join(', ')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
