"use client";
import { useEffect, useState } from "react";

interface Order {
  _id: string;
  orderId: string;
  customerInfo: {
    fullName: string;
    whatsappNumber: string;
    city: string;
  };
  productDetails: {
    productId: {
      _id: string;
      name: string;
    };
    size?: string;
    isCustom: boolean;
    customText?: string;
  };
  pricing: {
    basePrice: number;
    customFee: number;
    shippingFee: number;
    totalPrice: number;
  };
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "contacted", label: "Contacted" },
    { value: "printed", label: "Printed" },
    { value: "shipping", label: "Shipping" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterStatus) params.append('status', filterStatus);
      
      const response = await fetch(`/api/orders?${params.toString()}`);
      const data = await response.json();
      
      if (data.success && data.data?.orders) {
        setOrders(data.data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingStatus(orderId);
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        // Update local state
        setOrders(prev => prev.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
        alert('Order status updated successfully!');
      } else {
        throw new Error(result.message || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status: ' + error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Delete order
  const deleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setOrders(prev => prev.filter(order => order._id !== orderId));
        setSelectedOrder(null);
        alert('Order deleted successfully!');
      } else {
        throw new Error('Failed to delete order');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Failed to delete order: ' + error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

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

  // Filter orders based on search term
  const filteredOrders = orders.filter(order =>
    order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerInfo.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerInfo.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.productDetails.productId.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <div className="text-lg font-display font-bold uppercase tracking-tight text-black">
            Loading Orders...
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
              Orders Management
            </h2>
            <p className="text-lg text-brand-accent font-bold">
              Track and manage all customer orders
            </p>
          </div>
          <button
            onClick={fetchOrders}
            className="btn-brutal bg-brand-green text-black font-bold uppercase tracking-wider"
          >
            Refresh Orders
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-6 border-black shadow-brutal p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider text-black mb-2">
              Search Orders
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by order ID, customer, city, or product..."
              className="w-full px-4 py-3 border-3 border-gray-300 focus:border-black transition-colors font-body text-black placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider text-black mb-2">
              Filter by Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-3 border-3 border-gray-300 focus:border-black transition-colors font-body text-black"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders Count */}
      <div className="flex justify-between items-center">
        <p className="text-lg font-bold text-brand-accent">
          {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white border-6 border-black shadow-brutal p-12 text-center">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-xl text-brand-accent font-bold mb-2">No orders found</p>
          <p className="text-sm text-gray-500">
            {searchTerm || filterStatus ? "Try adjusting your filters" : "Orders will appear here once customers place them"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredOrders.map((order) => (
            <div key={order._id} className="bg-white border-6 border-black shadow-brutal hover:shadow-brutalMd transition-all duration-200">
              <div className="p-6">
                {/* Order Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-black">{order.orderId}</h3>
                    <p className="text-sm text-brand-accent font-bold">{order.customerInfo.fullName}</p>
                  </div>
                  <div className={`px-2 py-1 text-xs font-bold uppercase tracking-wider border-2 ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </div>
                </div>

                {/* Order Details */}
                <div className="space-y-2 text-sm mb-4">
                  <div><strong>Product:</strong> {order.productDetails.productId.name}</div>
                  {order.productDetails.size && (
                    <div><strong>Size:</strong> {order.productDetails.size}</div>
                  )}
                  {order.productDetails.isCustom && order.productDetails.customText && (
                    <div><strong>Custom Text:</strong> "{order.productDetails.customText}"</div>
                  )}
                  <div><strong>City:</strong> {order.customerInfo.city}</div>
                  <div><strong>WhatsApp:</strong> {order.customerInfo.whatsappNumber}</div>
                  <div><strong>Total:</strong> <span className="font-bold">${order.pricing.totalPrice.toFixed(2)}</span></div>
                  <div><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</div>
                </div>

                {/* Status Update */}
                <div className="mb-4">
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                    Update Status
                  </label>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    disabled={updatingStatus === order._id}
                    className="w-full px-3 py-2 border-3 border-gray-300 focus:border-black transition-colors text-sm font-body text-black disabled:opacity-50"
                  >
                    <option value="pending">Pending</option>
                    <option value="contacted">Contacted</option>
                    <option value="printed">Printed</option>
                    <option value="shipping">Shipping</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="flex-1 px-3 py-2 bg-brand-green text-black border-3 border-black shadow-brutal hover:shadow-brutalMd transition-all duration-200 font-bold text-sm uppercase tracking-wider"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => deleteOrder(order._id)}
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

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white border-6 border-black shadow-brutalLg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-display font-bold uppercase tracking-tight text-black">
                  Order Details
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-3xl font-bold text-gray-500 hover:text-black transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-black border-b-3 border-black pb-2">Customer Information</h3>
                  <div className="space-y-2">
                    <div><strong>Name:</strong> {selectedOrder.customerInfo.fullName}</div>
                    <div><strong>WhatsApp:</strong> {selectedOrder.customerInfo.whatsappNumber}</div>
                    <div><strong>City:</strong> {selectedOrder.customerInfo.city}</div>
                  </div>
                </div>

                {/* Order Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-black border-b-3 border-black pb-2">Order Information</h3>
                  <div className="space-y-2">
                    <div><strong>Order ID:</strong> {selectedOrder.orderId}</div>
                    <div><strong>Status:</strong> <span className={`px-2 py-1 text-xs font-bold uppercase tracking-wider border-2 ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusLabel(selectedOrder.status)}
                    </span></div>
                    <div><strong>Created:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</div>
                    <div><strong>Updated:</strong> {new Date(selectedOrder.updatedAt).toLocaleString()}</div>
                  </div>
                </div>

                {/* Product Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-black border-b-3 border-black pb-2">Product Details</h3>
                  <div className="space-y-2">
                    <div><strong>Product:</strong> {selectedOrder.productDetails.productId.name}</div>
                    {selectedOrder.productDetails.size && (
                      <div><strong>Size:</strong> {selectedOrder.productDetails.size}</div>
                    )}
                    <div><strong>Customizable:</strong> {selectedOrder.productDetails.isCustom ? 'Yes' : 'No'}</div>
                    {selectedOrder.productDetails.isCustom && selectedOrder.productDetails.customText && (
                      <div><strong>Custom Text:</strong> "{selectedOrder.productDetails.customText}"</div>
                    )}
                  </div>
                </div>

                {/* Pricing Breakdown */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-black border-b-3 border-black pb-2">Pricing Breakdown</h3>
                  <div className="space-y-2">
                    <div><strong>Base Price:</strong> ${selectedOrder.pricing.basePrice.toFixed(2)}</div>
                    {selectedOrder.pricing.customFee > 0 && (
                      <div><strong>Custom Fee:</strong> ${selectedOrder.pricing.customFee.toFixed(2)}</div>
                    )}
                    <div><strong>Shipping Fee:</strong> ${selectedOrder.pricing.shippingFee.toFixed(2)}</div>
                    <div className="border-t-3 border-black pt-2">
                      <strong className="text-lg">Total: ${selectedOrder.pricing.totalPrice.toFixed(2)}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 btn-brutal bg-gray-500 text-white font-bold uppercase tracking-wider"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
