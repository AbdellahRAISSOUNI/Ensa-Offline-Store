"use client";
import { useEffect, useState } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  DollarSign, 
  Users, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  RefreshCw,
  Calendar,
  BarChart3,
  ShoppingBag,
  MapPin,
  Shirt
} from "lucide-react";

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCustomers: number;
  pendingOrders: number;
  completedOrders: number;
  averageOrderValue: number;
  customOrdersPercentage: number;
  last7DaysRevenue: number;
  prev7DaysRevenue: number;
  revenueGrowth: number;
  ordersGrowth: number;
}

interface RecentOrder {
  _id: string;
  orderId: string;
  customerInfo: {
    fullName: string;
    city: string;
  };
  productDetails: {
    productId: {
      name: string;
    } | null;
    size?: string;
    isCustom: boolean;
    customText?: string;
  };
  pricing: {
    totalPrice: number;
  };
  status: string;
  createdAt: string;
}

interface TopProduct {
  productId: string;
  productName: string;
  orderCount: number;
  revenue: number;
}

interface StatusBreakdown {
  status: string;
  count: number;
  percentage: number;
}

interface CityStats {
  city: string;
  orderCount: number;
  revenue: number;
}

export default function DashboardTab() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    completedOrders: 0,
    averageOrderValue: 0,
    customOrdersPercentage: 0,
    last7DaysRevenue: 0,
    prev7DaysRevenue: 0,
    revenueGrowth: 0,
    ordersGrowth: 0,
  });
  
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [statusBreakdown, setStatusBreakdown] = useState<StatusBreakdown[]>([]);
  const [topCities, setTopCities] = useState<CityStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch orders and products in parallel
      const [ordersResponse, productsResponse] = await Promise.all([
        fetch('/api/orders', { credentials: 'include' }),
        fetch('/api/products', { credentials: 'include' })
      ]);

      const ordersData = await ordersResponse.json();
      const productsData = await productsResponse.json();

      if (ordersData.success && ordersData.data?.orders && productsData.success && productsData.data?.products) {
        const orders = ordersData.data.orders;
        const products = productsData.data.products;

        // Calculate date ranges
        const now = new Date();
        const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const prev7Days = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

        // Basic stats
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order?.pricing?.totalPrice || 0), 0);
        const totalProducts = products.length;
        
        // Get unique customers
        const uniqueCustomers = new Set(orders.map((order: any) => order?.customerInfo?.whatsappNumber)).size;
        
        // Order status counts
        const pendingOrders = orders.filter((order: any) => order?.status === 'pending').length;
        const completedOrders = orders.filter((order: any) => 
          ['delivered', 'finished'].includes(order?.status || '')
        ).length;

        // Average order value
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        // Custom orders percentage
        const customOrders = orders.filter((order: any) => order?.productDetails?.isCustom === true);
        const customOrdersPercentage = totalOrders > 0 ? (customOrders.length / totalOrders) * 100 : 0;

        // 7-day comparisons
        const last7DaysOrders = orders.filter((order: any) => new Date(order.createdAt) >= last7Days);
        const prev7DaysOrders = orders.filter((order: any) => 
          new Date(order.createdAt) >= prev7Days && new Date(order.createdAt) < last7Days
        );

        const last7DaysRevenue = last7DaysOrders.reduce((sum: number, order: any) => sum + (order?.pricing?.totalPrice || 0), 0);
        const prev7DaysRevenue = prev7DaysOrders.reduce((sum: number, order: any) => sum + (order?.pricing?.totalPrice || 0), 0);

        const revenueGrowth = prev7DaysRevenue === 0 
          ? (last7DaysRevenue > 0 ? 100 : 0)
          : ((last7DaysRevenue - prev7DaysRevenue) / prev7DaysRevenue) * 100;

        const ordersGrowth = prev7DaysOrders.length === 0 
          ? (last7DaysOrders.length > 0 ? 100 : 0)
          : ((last7DaysOrders.length - prev7DaysOrders.length) / prev7DaysOrders.length) * 100;

        setStats({
          totalOrders,
          totalRevenue,
          totalProducts,
          totalCustomers: uniqueCustomers,
          pendingOrders,
          completedOrders,
          averageOrderValue,
          customOrdersPercentage,
          last7DaysRevenue,
          prev7DaysRevenue,
          revenueGrowth,
          ordersGrowth,
        });

        // Recent orders (last 8)
        const sortedOrders = orders
          .sort((a: RecentOrder, b: RecentOrder) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 8);
        setRecentOrders(sortedOrders);

        // Top products by revenue
        const productStats = new Map();
        orders.forEach((order: any) => {
          const productId = order?.productDetails?.productId?._id || order?.productDetails?.productId || 'unknown';
          const productName = order?.productDetails?.productId?.name || 'Unknown Product';
          
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
          stats.revenue += (order?.pricing?.totalPrice || 0);
        });

        const topProductsList = Array.from(productStats.values())
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5);
        setTopProducts(topProductsList);

        // Status breakdown
        const statusMap = new Map();
        orders.forEach((order: any) => {
          const status = order?.status || 'unknown';
          statusMap.set(status, (statusMap.get(status) || 0) + 1);
        });

        const statusBreakdownList = Array.from(statusMap.entries()).map(([status, count]) => ({
          status,
          count,
          percentage: totalOrders > 0 ? (count / totalOrders) * 100 : 0
        }));
        setStatusBreakdown(statusBreakdownList);

        // Top cities
        const cityMap = new Map();
        orders.forEach((order: any) => {
          const city = order?.customerInfo?.city || 'Unknown';
          if (!cityMap.has(city)) {
            cityMap.set(city, { city, orderCount: 0, revenue: 0 });
          }
          const cityStats = cityMap.get(city);
          cityStats.orderCount += 1;
          cityStats.revenue += (order?.pricing?.totalPrice || 0);
        });

        const topCitiesList = Array.from(cityMap.values())
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 6);
        setTopCities(topCitiesList);

        setLastUpdated(new Date());
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
      case 'delivering': return 'bg-indigo-100 text-indigo-800 border-indigo-400';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-400';
      case 'finished': return 'bg-gray-100 text-gray-800 border-gray-400';
      default: return 'bg-gray-100 text-gray-800 border-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'contacted': return 'Contacted';
      case 'printed': return 'Printed';
      case 'delivering': return 'Delivering';
      case 'delivered': return 'Delivered';
      case 'finished': return 'Finished';
      default: return status;
    }
  };

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
  const formatPercentage = (percentage: number) => `${percentage >= 0 ? '+' : ''}${percentage.toFixed(1)}%`;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-spin">⏳</div>
          <div className="text-lg font-display font-bold uppercase tracking-tight text-black">
            Loading Dashboard...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh */}
      <div className="bg-white border-6 border-black shadow-brutal p-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
          <div className="mb-4 lg:mb-0">
            <h2 className="text-3xl font-display font-bold uppercase tracking-tight text-black mb-2">
              Admin Dashboard
            </h2>
            <p className="text-lg text-brand-accent font-bold">
              Real-time overview of your brutalist merch empire
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="btn-brutal bg-brand-green text-black font-bold uppercase tracking-wider flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Total Revenue */}
        <div className="bg-white border-6 border-black shadow-brutal p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-6 h-6 md:w-8 md:h-8 text-brand-green" />
            <div className={`flex items-center text-sm font-bold ${stats.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.revenueGrowth >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              {formatPercentage(stats.revenueGrowth)}
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-black mb-1 md:mb-2">{formatCurrency(stats.totalRevenue)}</div>
          <div className="text-xs md:text-sm text-brand-accent font-bold uppercase tracking-wider">Total Revenue</div>
          <div className="text-xs text-gray-500 mt-1">
            Last 7 days: {formatCurrency(stats.last7DaysRevenue)}
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white border-6 border-black shadow-brutal p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <Package className="w-6 h-6 md:w-8 md:h-8 text-brand-green" />
            <div className={`flex items-center text-sm font-bold ${stats.ordersGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.ordersGrowth >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              {formatPercentage(stats.ordersGrowth)}
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-black mb-1 md:mb-2">{stats.totalOrders}</div>
          <div className="text-xs md:text-sm text-brand-accent font-bold uppercase tracking-wider">Total Orders</div>
          <div className="text-xs text-gray-500 mt-1">
            {stats.pendingOrders} pending · {stats.completedOrders} completed
          </div>
        </div>

        {/* Average Order Value */}
        <div className="bg-white border-6 border-black shadow-brutal p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="w-6 h-6 md:w-8 md:h-8 text-brand-green" />
            <div className="text-sm text-gray-500 font-bold">AOV</div>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-black mb-1 md:mb-2">{formatCurrency(stats.averageOrderValue)}</div>
          <div className="text-xs md:text-sm text-brand-accent font-bold uppercase tracking-wider">Average Order</div>
          <div className="text-xs text-gray-500 mt-1">
            {stats.customOrdersPercentage.toFixed(1)}% include custom text
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white border-6 border-black shadow-brutal p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-6 h-6 md:w-8 md:h-8 text-brand-green" />
            <div className="text-sm text-gray-500 font-bold">{stats.totalProducts} products</div>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-black mb-1 md:mb-2">{stats.totalCustomers}</div>
          <div className="text-xs md:text-sm text-brand-accent font-bold uppercase tracking-wider">Unique Customers</div>
          <div className="text-xs text-gray-500 mt-1">
            Based on WhatsApp numbers
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white border-6 border-black shadow-brutal p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-display font-bold uppercase tracking-tight text-black">
              Recent Orders
            </h3>
            <div className="text-sm text-gray-500">Last 8 orders</div>
          </div>
          
          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-brand-accent font-bold">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 border-3 border-gray-300 hover:border-black transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="font-bold text-black text-sm">{order.orderId}</div>
                      {order.productDetails.isCustom && (
                        <div className="px-2 py-1 bg-brand-green text-black text-xs font-bold border-2 border-black">
                          CUSTOM
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-brand-accent font-bold">{order.customerInfo.fullName}</div>
                    <div className="text-xs text-gray-500">
                      {order.productDetails.productId?.name || 'Unknown Product'}
                      {order.productDetails.size && ` · ${order.productDetails.size}`}
                      {order.customerInfo.city && ` · ${order.customerInfo.city}`}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-black">{formatCurrency(order.pricing.totalPrice)}</div>
                    <div className={`inline-block px-2 py-1 text-xs font-bold uppercase tracking-wider border-2 ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Status Breakdown */}
        <div className="bg-white border-6 border-black shadow-brutal p-6">
          <h3 className="text-xl font-display font-bold uppercase tracking-tight text-black mb-6">
            Order Status
          </h3>
          
          {statusBreakdown.length === 0 ? (
            <div className="text-center py-8">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-brand-accent font-bold">No status data</p>
            </div>
          ) : (
            <div className="space-y-4">
              {statusBreakdown.map((status) => (
                <div key={status.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-2 text-sm font-bold uppercase tracking-wider border-2 ${getStatusColor(status.status)}`}>
                      {getStatusLabel(status.status)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {status.percentage.toFixed(1)}%
                    </div>
                  </div>
                  <div className="text-xl font-bold text-black">{status.count}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white border-6 border-black shadow-brutal p-6">
          <h3 className="text-xl font-display font-bold uppercase tracking-tight text-black mb-6">
            Top Products
          </h3>
          
          {topProducts.length === 0 ? (
            <div className="text-center py-8">
              <Shirt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-brand-accent font-bold">No sales data</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div key={product.productId} className="flex items-center justify-between p-3 bg-gray-50 border-3 border-gray-300">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-brand-green text-black border-3 border-black flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-bold text-black text-sm">{product.productName}</div>
                      <div className="text-xs text-brand-accent">{product.orderCount} orders</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-black">{formatCurrency(product.revenue)}</div>
                    <div className="text-xs text-gray-500">revenue</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Cities */}
        <div className="bg-white border-6 border-black shadow-brutal p-6">
          <h3 className="text-xl font-display font-bold uppercase tracking-tight text-black mb-6">
            Top Markets
          </h3>
          
          {topCities.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-brand-accent font-bold">No geographic data</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topCities.map((city, index) => (
                <div key={city.city} className="flex items-center justify-between p-3 bg-gray-50 border-3 border-gray-300">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-black text-white border-3 border-black flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-bold text-black text-sm">{city.city}</div>
                      <div className="text-xs text-brand-accent">{city.orderCount} orders</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-black">{formatCurrency(city.revenue)}</div>
                    <div className="text-xs text-gray-500">revenue</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-black text-white border-6 border-black shadow-brutal p-6">
        <h3 className="text-xl font-display font-bold uppercase tracking-tight mb-6">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border-3 border-brand-green bg-brand-green text-black font-bold uppercase tracking-wider hover:bg-white transition-colors">
            <Package className="w-6 h-6 mx-auto mb-2" />
            View Orders
          </button>
          <button className="p-4 border-3 border-white bg-transparent text-white font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-colors">
            <Shirt className="w-6 h-6 mx-auto mb-2" />
            Add Product
          </button>
          <button className="p-4 border-3 border-white bg-transparent text-white font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-colors">
            <BarChart3 className="w-6 h-6 mx-auto mb-2" />
            Analytics
          </button>
          <button className="p-4 border-3 border-white bg-transparent text-white font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-colors">
            <Eye className="w-6 h-6 mx-auto mb-2" />
            View Site
          </button>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-brand-green border-6 border-black shadow-brutal p-6">
        <h3 className="text-xl font-display font-bold uppercase tracking-tight text-black mb-4">
          Performance Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-black">
          <div>
            <h4 className="font-bold mb-2">📈 Growth</h4>
            <ul className="text-sm space-y-1">
              <li>• Revenue growth: {formatPercentage(stats.revenueGrowth)} (7d)</li>
              <li>• Orders growth: {formatPercentage(stats.ordersGrowth)} (7d)</li>
              <li>• Average order value: {formatCurrency(stats.averageOrderValue)}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-2">🎯 Conversion</h4>
            <ul className="text-sm space-y-1">
              <li>• {stats.customOrdersPercentage.toFixed(1)}% orders are custom</li>
              <li>• {((stats.completedOrders / stats.totalOrders) * 100).toFixed(1)}% completion rate</li>
              <li>• {stats.totalCustomers} unique customers</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-2">🚀 Highlights</h4>
            <ul className="text-sm space-y-1">
              <li>• {topCities.length} cities served</li>
              <li>• {topProducts.length} products generating revenue</li>
              <li>• {stats.pendingOrders} orders need attention</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}