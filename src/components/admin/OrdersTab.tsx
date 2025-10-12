"use client";
import { useEffect, useState } from "react";
import { 
  Search, 
  Filter, 
  RefreshCw, 
  Grid3X3, 
  List, 
  Eye, 
  Trash2, 
  Edit3,
  Package,
  User,
  MapPin,
  Phone,
  Calendar,
  DollarSign,
  Shirt,
  Zap,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  MessageCircle,
  Printer,
  Download,
  MoreVertical,
  Plus
} from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";

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

interface Product {
  _id: string;
  name: string;
  price: number;
  sizes: string[];
  isCustomizable: boolean;
  customPrice?: number;
  category?: string;
  isActive: boolean;
}

interface CreateOrderFormData {
  customerName: string;
  whatsappNumber: string;
  city: string;
  productId: string;
  size: string;
  customText: string;
  isCustom: boolean;
}

export default function OrdersTab() {
  const { formatPrice } = useCurrency();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [sortBy, setSortBy] = useState<'date' | 'status' | 'total' | 'customer'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ order: Order | null, show: boolean }>({ order: null, show: false });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [editingStatusId, setEditingStatusId] = useState<string | null>(null);
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [createOrderData, setCreateOrderData] = useState<CreateOrderFormData>({
    customerName: '',
    whatsappNumber: '',
    city: '',
    productId: '',
    size: '',
    customText: '',
    isCustom: false
  });
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Category icons mapping
  const categoryIcons = {
    'Hoodies': Shirt,
    'T-Shirts': Shirt,
    'Tank Tops': Shirt,
    'Long Sleeves': Shirt,
    'Accessories': Package,
    'default': Package
  };

  // Enhanced status options with icons (matching API)
  const statusOptions = [
    { value: "", label: "All Status", icon: Filter },
    { value: "pending", label: "Pending", icon: Clock, color: "yellow" },
    { value: "contacted", label: "Contacted", icon: MessageCircle, color: "blue" },
    { value: "printed", label: "Printed", icon: Printer, color: "purple" },
    { value: "delivering", label: "Delivering", icon: Truck, color: "indigo" },
    { value: "delivered", label: "Delivered", icon: CheckCircle, color: "green" },
    { value: "finished", label: "Finished", icon: CheckCircle, color: "green" },
  ];

  // Moroccan cities with shipping fees
  const cities = [
    { name: "Tetouan", fee: 0, isTetouan: true },
    { name: "Tangier", fee: 15 },
    { name: "Casablanca", fee: 25 },
    { name: "Rabat", fee: 20 },
    { name: "Fez", fee: 18 },
    { name: "Meknes", fee: 16 },
    { name: "Agadir", fee: 30 },
    { name: "Marrakech", fee: 28 },
    { name: "Oujda", fee: 22 },
    { name: "Kenitra", fee: 18 },
    { name: "Tetouan Province", fee: 5 },
    { name: "Other", fee: 35 }
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

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      console.log('Fetching products...');
      const response = await fetch('/api/products');
      console.log('Products response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Products data:', data);
      
      if (data.success && data.data?.products) {
        const activeProducts = data.data.products.filter((p: Product) => p.isActive);
        console.log('Active products:', activeProducts);
        setProducts(activeProducts);
      } else {
        console.error('No products found in response:', data);
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Create new order
  const createOrder = async () => {
    try {
      setIsCreatingOrder(true);

      const selectedProduct = products.find(p => p._id === createOrderData.productId);
      if (!selectedProduct) {
        throw new Error('Selected product not found');
      }

      const selectedCity = cities.find(c => c.name === createOrderData.city);
      const shippingFee = selectedCity ? selectedCity.fee : 35;
      const customFee = createOrderData.isCustom && selectedProduct.customPrice ? selectedProduct.customPrice : 0;
      const totalPrice = selectedProduct.price + customFee + shippingFee;

      const orderData = {
        productDetails: {
          productId: createOrderData.productId,
          size: createOrderData.size,
          isCustom: createOrderData.isCustom,
          customText: createOrderData.isCustom ? createOrderData.customText : undefined
        },
        customerInfo: {
          fullName: createOrderData.customerName,
          whatsappNumber: createOrderData.whatsappNumber,
          city: createOrderData.city
        },
        pricing: {
          basePrice: selectedProduct.price,
          customFee,
          shippingFee,
          totalPrice
        }
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const result = await response.json();
      
      if (result.success) {
        // Reset form
        setCreateOrderData({
          customerName: '',
          whatsappNumber: '',
          city: '',
          productId: '',
          size: '',
          customText: '',
          isCustom: false
        });
        setShowCreateOrder(false);
        showNotification('success', 'Order created successfully!');
        fetchOrders(); // Refresh orders list
      } else {
        throw new Error(result.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      showNotification('error', `Failed to create order: ${error}`);
    } finally {
      setIsCreatingOrder(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingStatus(orderId);
      
      // Immediate UI update for better UX
      setOrders(prev => prev.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        showNotification('success', `Order status updated to ${getStatusLabel(newStatus)} successfully!`);
      } else {
        // Revert the change if API call failed
        setOrders(prev => prev.map(order => 
          order._id === orderId ? { ...order, status: result.originalStatus || 'pending' } : order
        ));
        throw new Error(result.message || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      showNotification('error', `Failed to update order status: ${error}`);
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Delete order
  const deleteOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setOrders(prev => prev.filter(order => order._id !== orderId));
        setSelectedOrder(null);
        setDeleteConfirm({ order: null, show: false });
        showNotification('success', 'Order deleted successfully!');
      } else {
        throw new Error('Failed to delete order');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      showNotification('error', `Failed to delete order: ${error}`);
    }
  };

  // Show delete confirmation
  const showDeleteConfirm = (order: Order) => {
    setDeleteConfirm({ order, show: true });
  };

  // Handle status editing in table
  const handleStatusEdit = (orderId: string) => {
    setEditingStatusId(editingStatusId === orderId ? null : orderId);
  };

  // Handle status change in table
  const handleTableStatusChange = async (orderId: string, newStatus: string) => {
    await updateOrderStatus(orderId, newStatus);
    setEditingStatusId(null);
  };

  // Export orders to CSV
  const exportOrdersToCSV = () => {
    const csvContent = generateCSVContent(filteredAndSortedOrders);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `ENSA_OFFLINE_Orders_${timestamp}.csv`;
    downloadCSV(csvContent, filename);
    showNotification('success', 'Orders exported successfully!');
  };

  // Generate CSV content with beautiful formatting
  const generateCSVContent = (orders: Order[]) => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const header = [
      '================================================',
      '           ENSA OFFLINE - ORDERS EXPORT',
      '================================================',
      '',
      'Export Information:',
      `Generated on: ${formattedDate}`,
      `Total Orders: ${orders.length}`,
      `Export includes: All order details, customer info, pricing`,
      '',
      '================================================',
      'ORDER DETAILS',
      '================================================',
      'Order ID,Customer Name,WhatsApp Number,City,Product Name,Size,Custom Text,Status,Base Price ($),Custom Fee ($),Shipping Fee ($),Total Price ($),Order Date,Last Updated'
    ];

    const rows = orders.map(order => {
      const statusInfo = getStatusInfo(order.status);
      return [
        order.orderId,
        `"${order.customerInfo.fullName}"`,
        order.customerInfo.whatsappNumber,
        order.customerInfo.city,
        `"${order.productDetails?.productId?.name || 'Unknown Product'}"`,
        order.productDetails.size || 'N/A',
        order.productDetails.customText ? `"${order.productDetails.customText}"` : 'N/A',
        statusInfo.label,
        order.pricing.basePrice.toFixed(2),
        order.pricing.customFee.toFixed(2),
        order.pricing.shippingFee.toFixed(2),
        order.pricing.totalPrice.toFixed(2),
        new Date(order.createdAt).toLocaleDateString(),
        new Date(order.updatedAt).toLocaleDateString()
      ].join(',');
    });

    const footer = [
      '',
      '================================================',
      'END OF EXPORT',
      '================================================',
      '',
      'This export was generated by ENSA OFFLINE Admin Panel',
      'For support, contact: abdellahraissouni@gmail.com'
    ];

    return [...header, ...rows, ...footer].join('\n');
  };

  // Download CSV file
  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate styled HTML export
  const generateStyledHTML = (orders: Order[]) => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ENSA OFFLINE - Orders Export</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f8f9fa;
            color: #000;
            line-height: 1.4;
        }
        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border: 4px solid #000;
            box-shadow: 6px 6px 0px #000;
            border-radius: 0;
            overflow: hidden;
        }
        .header {
            background: #000;
            color: #fff;
            padding: 25px;
            text-align: center;
            border-bottom: 4px solid #000;
        }
        .header h1 {
            font-size: 2.2em;
            font-weight: 900;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        .header p {
            font-size: 1.1em;
            margin: 8px 0 0 0;
            font-weight: bold;
            color: #00ff88;
        }
        .info-section {
            background: #f8f9fa;
            padding: 20px;
            border-bottom: 3px solid #000;
        }
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }
        .info-item {
            background: white;
            padding: 15px;
            border: 3px solid #000;
            border-radius: 0;
        }
        .info-item strong {
            color: #000;
            font-size: 1em;
            font-weight: 900;
        }
        .table-container {
            padding: 20px;
            overflow-x: auto;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
            font-size: 0.9em;
        }
        th {
            background: #000;
            color: #fff;
            padding: 12px 8px;
            text-align: left;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border: 2px solid #000;
            font-size: 0.85em;
            white-space: nowrap;
        }
        td {
            padding: 10px 8px;
            border: 2px solid #000;
            background: white;
            font-size: 0.85em;
            vertical-align: top;
        }
        tr:nth-child(even) td {
            background: #f8f9fa;
        }
        tr:hover td {
            background: #e8f5e8;
        }
        .status-badge {
            padding: 4px 8px;
            border-radius: 0;
            font-weight: 900;
            text-transform: uppercase;
            font-size: 0.8em;
            border: 2px solid #000;
        }
        .status-pending { background: #fff3cd; color: #000; }
        .status-contacted { background: #d1ecf1; color: #000; }
        .status-printed { background: #d4edda; color: #000; }
        .status-delivering { background: #cce5ff; color: #000; }
        .status-delivered { background: #d4edda; color: #000; }
        .status-finished { background: #d4edda; color: #000; }
        .price {
            font-weight: 900;
            color: #000;
        }
        .order-id {
            font-weight: 900;
            color: #000;
            font-size: 0.9em;
        }
        .footer {
            background: #000;
            color: #fff;
            padding: 20px;
            text-align: center;
            font-weight: 900;
        }
        .footer a {
            color: #00ff88;
            text-decoration: none;
            font-weight: 900;
        }
        .footer a:hover {
            text-decoration: underline;
        }
        @media print {
            body { padding: 0; }
            .container { box-shadow: none; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>ENSA OFFLINE</h1>
            <p>ORDERS EXPORT</p>
        </div>
        
        <div class="info-section">
            <div class="info-grid">
                <div class="info-item">
                    <strong>Generated on:</strong><br>
                    ${formattedDate}
                </div>
                <div class="info-item">
                    <strong>Total Orders:</strong><br>
                    ${orders.length}
                </div>
                <div class="info-item">
                    <strong>Export includes:</strong><br>
                    All order details, customer info, pricing
                </div>
                <div class="info-item">
                    <strong>Support:</strong><br>
                    <a href="mailto:abdellahraissouni@gmail.com">abdellahraissouni@gmail.com</a>
                </div>
            </div>
        </div>
        
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer Name</th>
                        <th>WhatsApp</th>
                        <th>City</th>
                        <th>Product</th>
                        <th>Size</th>
                        <th>Custom Text</th>
                        <th>Status</th>
                        <th>Base Price</th>
                        <th>Custom Fee</th>
                        <th>Shipping</th>
                        <th>Total</th>
                        <th>Order Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${orders.map(order => {
                      const statusInfo = getStatusInfo(order.status);
                      return `
                        <tr>
                            <td class="order-id">${order.orderId}</td>
                            <td>${order.customerInfo.fullName}</td>
                            <td>${order.customerInfo.whatsappNumber}</td>
                            <td>${order.customerInfo.city}</td>
                            <td>${order.productDetails?.productId?.name || 'Unknown Product'}</td>
                            <td>${order.productDetails.size || 'N/A'}</td>
                            <td>${order.productDetails.customText || 'N/A'}</td>
                            <td><span class="status-badge status-${order.status}">${statusInfo.label}</span></td>
                            <td class="price">$${order.pricing.basePrice.toFixed(2)}</td>
                            <td class="price">$${order.pricing.customFee.toFixed(2)}</td>
                            <td class="price">$${order.pricing.shippingFee.toFixed(2)}</td>
                            <td class="price"><strong>$${order.pricing.totalPrice.toFixed(2)}</strong></td>
                            <td>${new Date(order.createdAt).toLocaleDateString()}</td>
                        </tr>
                      `;
                    }).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="footer">
            <p>This export was generated by ENSA OFFLINE Admin Panel</p>
            <p>For support, contact: <a href="mailto:abdellahraissouni@gmail.com">abdellahraissouni@gmail.com</a></p>
        </div>
    </div>
</body>
</html>`;

    return htmlContent;
  };

  // Export orders to styled HTML
  const exportOrdersToHTML = () => {
    const htmlContent = generateStyledHTML(filteredAndSortedOrders);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `ENSA_OFFLINE_Orders_${timestamp}.html`;
    downloadHTML(htmlContent, filename);
    showNotification('success', 'Styled orders exported successfully!');
  };

  // Download HTML file
  const downloadHTML = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/html;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper function to truncate text
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Helper function to create order title
  const getOrderTitle = (order: Order) => {
    const customerName = order.customerInfo.fullName;
    const productName = order.productDetails?.productId?.name || 'Unknown Product';
    const title = `${customerName} - ${productName}`;
    return truncateText(title, 40);
  };

  // Status Dropdown Component
  const StatusDropdown = ({ 
    currentStatus, 
    onStatusChange, 
    disabled = false, 
    size = 'default' 
  }: { 
    currentStatus: string; 
    onStatusChange: (status: string) => void; 
    disabled?: boolean;
    size?: 'small' | 'default';
  }) => {
    const currentStatusInfo = getStatusInfo(currentStatus);
    const CurrentIcon = currentStatusInfo.icon;
    
    return (
      <div className={`relative ${size === 'small' ? 'w-full' : 'w-full'}`}>
        <select
          value={currentStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          disabled={disabled}
          className={`w-full px-3 py-2 border-3 border-gray-300 focus:border-black focus:shadow-brutal transition-all duration-200 text-sm font-body text-black disabled:opacity-50 rounded appearance-none bg-white cursor-pointer ${
            size === 'small' ? 'py-1 text-xs' : 'py-2'
          }`}
        >
          {statusOptions.slice(1).map((option) => {
            const OptionIcon = option.icon;
            return (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            );
          })}
        </select>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <div className={`flex items-center gap-1 ${size === 'small' ? 'text-xs' : 'text-sm'}`}>
            <CurrentIcon className={`${size === 'small' ? 'w-3 h-3' : 'w-4 h-4'} text-gray-500`} />
            <span className="text-gray-400">▼</span>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, [filterStatus]);

  // Enhanced status functions with icons
  const getStatusInfo = (status: string) => {
    const statusOption = statusOptions.find(opt => opt.value === status);
    return statusOption || { label: status, icon: Clock, color: 'gray' };
  };

  const getStatusLabel = (status: string) => {
    const statusInfo = getStatusInfo(status);
    return statusInfo.label;
  };

  const getStatusColor = (status: string) => {
    const statusInfo = getStatusInfo(status);
    const colorMap = {
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-400',
      blue: 'bg-blue-100 text-blue-800 border-blue-400',
      purple: 'bg-purple-100 text-purple-800 border-purple-400',
      indigo: 'bg-indigo-100 text-indigo-800 border-indigo-400',
      green: 'bg-green-100 text-green-800 border-green-400',
      red: 'bg-red-100 text-red-800 border-red-400',
      gray: 'bg-gray-100 text-gray-800 border-gray-400'
    };
    return colorMap[statusInfo.color as keyof typeof colorMap] || colorMap.gray;
  };

  // Show notification
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Sorting function
  const sortOrders = (orders: Order[]) => {
    return [...orders].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'total':
          aValue = a.pricing.totalPrice;
          bValue = b.pricing.totalPrice;
          break;
        case 'customer':
          aValue = a.customerInfo.fullName.toLowerCase();
          bValue = b.customerInfo.fullName.toLowerCase();
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  // Filter and sort orders
  const filteredAndSortedOrders = sortOrders(
    orders.filter(order =>
    order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerInfo.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerInfo.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.productDetails?.productId?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    ).filter(order => filterStatus === '' || order.status === filterStatus)
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = filteredAndSortedOrders.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, sortBy, sortOrder]);

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
      {/* Modern Header */}
      <div className="bg-white border-6 border-black shadow-brutal p-6 rounded-lg">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div>
            <h2 className="text-3xl font-display font-bold uppercase tracking-tight text-black mb-2">
              Orders Management
            </h2>
            <p className="text-lg text-brand-accent font-bold">
              Track and manage all customer orders
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setShowCreateOrder(true);
                fetchProducts(); // Ensure products are fetched when modal opens
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white border-3 border-black shadow-brutal hover:shadow-brutalMd transition-all duration-200 font-bold uppercase tracking-wider"
            >
              <Plus className="w-4 h-4" />
              Create Order
            </button>
            <button
              onClick={fetchOrders}
              className="flex items-center gap-2 px-4 py-2 bg-brand-green text-black border-3 border-black shadow-brutal hover:shadow-brutalMd transition-all duration-200 font-bold uppercase tracking-wider"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button 
              onClick={exportOrdersToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white border-3 border-black shadow-brutal hover:shadow-brutalMd transition-all duration-200 font-bold uppercase tracking-wider"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button 
              onClick={exportOrdersToHTML}
              className="flex items-center gap-2 px-4 py-2 bg-brand-green text-black border-3 border-black shadow-brutal hover:shadow-brutalMd transition-all duration-200 font-bold uppercase tracking-wider"
            >
              <Download className="w-4 h-4" />
              Export Styled
            </button>
          </div>
        </div>
      </div>

      {/* Modern Controls */}
      <div className="bg-white border-6 border-black shadow-brutal p-6 rounded-lg">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-bold uppercase tracking-wider text-black mb-2">
              Search Orders
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by order ID, customer, city, or product..."
                className="w-full pl-10 pr-4 py-3 border-3 border-gray-300 focus:border-black transition-colors font-body text-black placeholder-gray-500 rounded"
            />
          </div>
          </div>
          
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider text-black mb-2">
              Filter by Status
            </label>
            <StatusDropdown
              currentStatus={filterStatus}
              onStatusChange={setFilterStatus}
              size="default"
            />
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider text-black mb-2">
              Sort by
            </label>
            <div className="flex gap-2">
            <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="flex-1 px-3 py-3 border-3 border-gray-300 focus:border-black transition-colors font-body text-black rounded appearance-none"
              >
                <option value="date">Date</option>
                <option value="status">Status</option>
                <option value="total">Total</option>
                <option value="customer">Customer</option>
            </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-3 bg-gray-200 text-black border-3 border-gray-300 hover:border-black transition-colors rounded font-bold"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
          </div>
        </div>
      </div>

        {/* View Toggle and Stats */}
      <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold uppercase tracking-wider text-black">View:</span>
            <div className="flex border-3 border-gray-300 rounded">
              <button
                onClick={() => setViewMode('cards')}
                className={`flex items-center gap-2 px-4 py-2 transition-colors ${
                  viewMode === 'cards' 
                    ? 'bg-brand-green text-black font-bold' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
                Cards
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-2 px-4 py-2 transition-colors ${
                  viewMode === 'table' 
                    ? 'bg-brand-green text-black font-bold' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <List className="w-4 h-4" />
                Table
              </button>
            </div>
          </div>
          <div className="text-right">
        <p className="text-lg font-bold text-brand-accent">
              {filteredAndSortedOrders.length} order{filteredAndSortedOrders.length !== 1 ? 's' : ''} found
            </p>
            <p className="text-sm text-gray-500">
              Total: {formatPrice(filteredAndSortedOrders.reduce((sum, order) => sum + order.pricing.totalPrice, 0))}
        </p>
          </div>
        </div>
      </div>

      {/* Orders Display */}
      {filteredAndSortedOrders.length === 0 ? (
        <div className="bg-white border-6 border-black shadow-brutal p-12 text-center rounded-lg">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-xl text-brand-accent font-bold mb-2">No orders found</p>
          <p className="text-sm text-gray-500">
            {searchTerm || filterStatus ? "Try adjusting your filters" : "Orders will appear here once customers place them"}
          </p>
        </div>
      ) : viewMode === 'cards' ? (
        /* Modern Card View */
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {paginatedOrders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            const StatusIcon = statusInfo.icon;
            const CategoryIcon = categoryIcons.default;
            
            return (
              <div key={order._id} className="bg-white border-6 border-black shadow-brutal hover:shadow-brutalMd transition-all duration-200 rounded-lg overflow-hidden">
                {/* Card Header */}
                <div className="bg-gray-50 p-4 border-b-3 border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-green border-3 border-black flex items-center justify-center rounded">
                        <Package className="w-5 h-5 text-black" />
                      </div>
                  <div>
                        <h3 className="text-lg font-bold text-black">{getOrderTitle(order)}</h3>
                        <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 text-xs font-bold uppercase tracking-wider border-2 rounded ${getStatusColor(order.status)}`}>
                      <StatusIcon className="w-3 h-3" />
                      {statusInfo.label}
                  </div>
                </div>

                  {/* Status Update - Now at the top for easy access */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-black mb-2">
                      Update Status
                    </label>
                    <StatusDropdown
                      currentStatus={order.status}
                      onStatusChange={(status) => updateOrderStatus(order._id, status)}
                      disabled={updatingStatus === order._id}
                      size="small"
                    />
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 space-y-4">
                  {/* Customer Info */}
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gray-500" />
                  <div>
                      <p className="font-bold text-black">{order.customerInfo.fullName}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {order.customerInfo.city}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {order.customerInfo.whatsappNumber}
                        </div>
                  </div>
                  </div>
                </div>

                  {/* Product Info */}
                  <div className="flex items-center gap-3">
                    <CategoryIcon className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="font-bold text-black">{order.productDetails?.productId?.name || 'Unknown Product'}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                  {order.productDetails.size && (
                          <span>Size: {order.productDetails.size}</span>
                        )}
                        {order.productDetails.isCustom && (
                          <span className="flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            Custom
                          </span>
                        )}
                      </div>
                  {order.productDetails.isCustom && order.productDetails.customText && (
                        <p className="text-sm text-gray-600 mt-1 italic">"{order.productDetails.customText}"</p>
                  )}
                    </div>
                </div>

                  {/* Pricing */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 border-3 border-gray-200 rounded">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Total</span>
                    </div>
                    <span className="text-xl font-bold text-black">${order.pricing.totalPrice.toFixed(2)}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedOrder(order)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-brand-green text-black border-3 border-black shadow-brutal hover:shadow-brutalMd transition-all duration-200 font-bold text-sm uppercase tracking-wider rounded"
                  >
                      <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  <button
                       onClick={() => showDeleteConfirm(order)}
                       className="px-3 py-2 bg-red-500 text-white border-3 border-black shadow-brutal hover:shadow-brutalMd transition-all duration-200 font-bold text-sm uppercase tracking-wider rounded"
                  >
                       <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      ) : (
        /* Modern Table View */
        <div className="bg-white border-6 border-black shadow-brutal rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-3 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-black">Order</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-black">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-black">Product</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-black">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-black">Total</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-black">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-black">Actions</th>
                </tr>
              </thead>
                <tbody className="divide-y divide-gray-200">
                 {paginatedOrders.map((order) => {
                  const statusInfo = getStatusInfo(order.status);
                  const StatusIcon = statusInfo.icon;
                  const CategoryIcon = categoryIcons.default;
                  
                  return (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-brand-green border-2 border-black flex items-center justify-center rounded">
                            <Package className="w-4 h-4 text-black" />
                          </div>
                          <div>
                            <div className="font-bold text-black">{order.orderId}</div>
                            <div className="text-sm text-gray-500">{order.productDetails.size}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-bold text-black">{order.customerInfo.fullName}</div>
                          <div className="text-sm text-gray-500">{order.customerInfo.city}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <CategoryIcon className="w-4 h-4 text-gray-500" />
                          <div>
                            <div className="font-bold text-black">{order.productDetails?.productId?.name || 'Unknown Product'}</div>
                            {order.productDetails.isCustom && (
                              <div className="text-sm text-gray-500 flex items-center gap-1">
                                <Zap className="w-3 h-3" />
                                Custom
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {editingStatusId === order._id ? (
                          <StatusDropdown
                            currentStatus={order.status}
                            onStatusChange={(status) => handleTableStatusChange(order._id, status)}
                            disabled={updatingStatus === order._id}
                            size="small"
                          />
                        ) : (
                          <button
                            onClick={() => handleStatusEdit(order._id)}
                            className={`flex items-center gap-2 px-3 py-1 text-xs font-bold uppercase tracking-wider border-2 rounded hover:shadow-brutal transition-all duration-200 cursor-pointer ${getStatusColor(order.status)}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {statusInfo.label}
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-black">${order.pricing.totalPrice.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 bg-brand-green text-black border-2 border-black shadow-brutal hover:shadow-brutalMd transition-all duration-200 rounded"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                           <button
                             onClick={() => showDeleteConfirm(order)}
                             className="p-2 bg-red-500 text-white border-2 border-black shadow-brutal hover:shadow-brutalMd transition-all duration-200 rounded"
                           >
                             <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {filteredAndSortedOrders.length > itemsPerPage && (
        <div className="bg-white border-6 border-black shadow-brutal p-6 rounded-lg">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Items per page selector */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-bold uppercase tracking-wider text-black">
                Items per page:
              </label>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border-3 border-gray-300 focus:border-black focus:shadow-brutal transition-all duration-200 text-sm font-body text-black rounded"
              >
                <option value={6}>6</option>
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={48}>48</option>
              </select>
            </div>

            {/* Pagination info */}
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredAndSortedOrders.length)} of {filteredAndSortedOrders.length} orders
            </div>

            {/* Pagination controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-3 py-2 bg-gray-500 text-white border-3 border-black shadow-brutal hover:shadow-brutalMd transition-all duration-200 font-bold text-sm uppercase tracking-wider rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                First
              </button>
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 bg-gray-500 text-white border-3 border-black shadow-brutal hover:shadow-brutalMd transition-all duration-200 font-bold text-sm uppercase tracking-wider rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 border-3 border-black shadow-brutal hover:shadow-brutalMd transition-all duration-200 font-bold text-sm uppercase tracking-wider rounded ${
                        currentPage === pageNum
                          ? 'bg-brand-green text-black'
                          : 'bg-white text-black'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 bg-gray-500 text-white border-3 border-black shadow-brutal hover:shadow-brutalMd transition-all duration-200 font-bold text-sm uppercase tracking-wider rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 bg-gray-500 text-white border-3 border-black shadow-brutal hover:shadow-brutalMd transition-all duration-200 font-bold text-sm uppercase tracking-wider rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Last
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
         <div 
           className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
           onClick={() => setSelectedOrder(null)}
         >
           <div 
             className="bg-white border-6 border-black shadow-brutalLg max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-lg"
             onClick={(e) => e.stopPropagation()}
           >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-display font-bold uppercase tracking-tight text-black">
                  Order Details
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-gray-100 transition-colors rounded"
                >
                  <XCircle className="w-6 h-6 text-gray-500" />
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
                    <div><strong>Product:</strong> {selectedOrder.productDetails?.productId?.name || 'Unknown Product'}</div>
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
                    <div><strong>Base Price:</strong> {formatPrice(selectedOrder.pricing.basePrice)}</div>
                    {selectedOrder.pricing.customFee > 0 && (
                      <div><strong>Custom Fee:</strong> {formatPrice(selectedOrder.pricing.customFee)}</div>
                    )}
                    <div><strong>Shipping Fee:</strong> {formatPrice(selectedOrder.pricing.shippingFee)}</div>
                    <div className="border-t-3 border-black pt-2">
                      <strong className="text-lg">Total: {formatPrice(selectedOrder.pricing.totalPrice)}</strong>
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
       
       {/* Delete Confirmation Modal */}
       {deleteConfirm.show && deleteConfirm.order && (
         <div 
           className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
           onClick={() => setDeleteConfirm({ order: null, show: false })}
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
                     Delete Order
                   </h2>
                   <p className="text-sm text-gray-600">This action cannot be undone</p>
                 </div>
               </div>

               <div className="mb-6 p-4 bg-gray-50 border-3 border-gray-200 rounded">
                 <div className="space-y-2 text-sm">
                   <div><strong>Order ID:</strong> {deleteConfirm.order.orderId}</div>
                   <div><strong>Customer:</strong> {deleteConfirm.order.customerInfo.fullName}</div>
                   <div><strong>Product:</strong> {deleteConfirm.order.productDetails?.productId?.name || 'Unknown Product'}</div>
                   <div><strong>Total:</strong> {formatPrice(deleteConfirm.order.pricing.totalPrice)}</div>
                 </div>
               </div>

               <div className="flex gap-3">
                 <button
                   onClick={() => setDeleteConfirm({ order: null, show: false })}
                   className="flex-1 px-4 py-3 bg-gray-500 text-white border-3 border-black shadow-brutal hover:shadow-brutalMd transition-all duration-200 font-bold uppercase tracking-wider rounded"
                 >
                   Cancel
                 </button>
                 <button
                   onClick={() => deleteOrder(deleteConfirm.order!._id)}
                   className="flex-1 px-4 py-3 bg-red-500 text-white border-3 border-black shadow-brutal hover:shadow-brutalMd transition-all duration-200 font-bold uppercase tracking-wider rounded"
                 >
                   Delete Order
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
             <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                 {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
                 {notification.type === 'error' && <XCircle className="w-5 h-5" />}
                 {notification.type === 'info' && <MessageCircle className="w-5 h-5" />}
                 <span className="font-bold uppercase tracking-wider text-sm">
                   {notification.message}
                 </span>
               </div>
               <button
                 onClick={() => setNotification(null)}
                 className="ml-4 text-lg font-bold hover:opacity-70 transition-opacity"
               >
                 ×
               </button>
            </div>
          </div>
        </div>
       )}

       {/* Create Order Modal */}
       {showCreateOrder && (
         <div 
           className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
           onClick={() => setShowCreateOrder(false)}
         >
           <div 
             className="bg-white border-6 border-black shadow-brutalLg max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-lg"
             onClick={(e) => e.stopPropagation()}
           >
             <div className="p-6">
               <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-display font-bold uppercase tracking-tight text-black">
                   Create New Order
                 </h2>
                 <button
                   onClick={() => setShowCreateOrder(false)}
                   className="p-2 hover:bg-gray-100 transition-colors rounded"
                 >
                   <XCircle className="w-6 h-6 text-gray-500" />
                 </button>
               </div>

               <div className="space-y-6">
                 {/* Customer Information */}
                 <div className="space-y-4">
                   <h3 className="text-lg font-bold text-black border-b-3 border-black pb-2">Customer Information</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-bold uppercase tracking-wider text-black mb-2">
                         Customer Name *
                       </label>
                       <input
                         type="text"
                         value={createOrderData.customerName}
                         onChange={(e) => setCreateOrderData(prev => ({ ...prev, customerName: e.target.value }))}
                         className="w-full px-4 py-3 border-3 border-black shadow-brutal focus:shadow-brutalMd transition-all duration-200 font-body text-black placeholder-gray-500"
                         placeholder="Enter customer name"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-bold uppercase tracking-wider text-black mb-2">
                         WhatsApp Number *
                       </label>
                       <input
                         type="tel"
                         value={createOrderData.whatsappNumber}
                         onChange={(e) => setCreateOrderData(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                         className="w-full px-4 py-3 border-3 border-black shadow-brutal focus:shadow-brutalMd transition-all duration-200 font-body text-black placeholder-gray-500"
                         placeholder="+212 6XX XXX XXX"
                       />
                     </div>
                     <div className="md:col-span-2">
                       <label className="block text-sm font-bold uppercase tracking-wider text-black mb-2">
                         City *
                       </label>
                       <select
                         value={createOrderData.city}
                         onChange={(e) => setCreateOrderData(prev => ({ ...prev, city: e.target.value }))}
                         className="w-full px-4 py-3 border-3 border-black shadow-brutal focus:shadow-brutalMd transition-all duration-200 font-body text-black"
                       >
                         <option value="">Select City</option>
                         {cities.map((city) => (
                           <option key={city.name} value={city.name}>
                             {city.name} {city.fee > 0 ? `(+$${city.fee})` : city.isTetouan ? "(FREE)" : ""}
                           </option>
                         ))}
                       </select>
                     </div>
                   </div>
                 </div>

                 {/* Product Selection */}
                 <div className="space-y-4">
                   <div className="flex justify-between items-center">
                     <h3 className="text-lg font-bold text-black border-b-3 border-black pb-2">Product Selection</h3>
                     <button
                       onClick={fetchProducts}
                       disabled={loadingProducts}
                       className="px-3 py-1 bg-gray-200 text-black border-2 border-black shadow-brutal hover:shadow-brutalMd transition-all duration-200 font-bold text-sm uppercase tracking-wider rounded disabled:opacity-50"
                     >
                       {loadingProducts ? "Loading..." : "Refresh"}
                     </button>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-bold uppercase tracking-wider text-black mb-2">
                         Product *
                       </label>
                       <select
                         value={createOrderData.productId}
                         onChange={(e) => {
                           const product = products.find(p => p._id === e.target.value);
                           setCreateOrderData(prev => ({ 
                             ...prev, 
                             productId: e.target.value,
                             size: '',
                             customText: '',
                             isCustom: false
                           }));
                         }}
                         disabled={loadingProducts}
                         className="w-full px-4 py-3 border-3 border-black shadow-brutal focus:shadow-brutalMd transition-all duration-200 font-body text-black disabled:bg-gray-100"
                       >
                         <option value="">
                           {loadingProducts ? "Loading products..." : "Select Product"}
                         </option>
                         {products.length === 0 && !loadingProducts ? (
                           <option value="" disabled>No products available</option>
                         ) : (
                           products.map((product) => (
                             <option key={product._id} value={product._id}>
                               {product.name} - ${product.price}
                             </option>
                           ))
                         )}
                       </select>
                     </div>
                     <div>
                       <label className="block text-sm font-bold uppercase tracking-wider text-black mb-2">
                         Size *
                       </label>
                       <select
                         value={createOrderData.size}
                         onChange={(e) => setCreateOrderData(prev => ({ ...prev, size: e.target.value }))}
                         disabled={!createOrderData.productId}
                         className="w-full px-4 py-3 border-3 border-black shadow-brutal focus:shadow-brutalMd transition-all duration-200 font-body text-black disabled:bg-gray-100"
                       >
                         <option value="">Select Size</option>
                         {createOrderData.productId && products.find(p => p._id === createOrderData.productId)?.sizes.map((size) => (
                           <option key={size} value={size}>
                             {size}
                           </option>
                         ))}
                       </select>
                     </div>
                   </div>
                 </div>

                 {/* Custom Text Option */}
                 {createOrderData.productId && products.find(p => p._id === createOrderData.productId)?.isCustomizable && (
                   <div className="space-y-4">
                     <h3 className="text-lg font-bold text-black border-b-3 border-black pb-2">Custom Text</h3>
                     <div className="space-y-4">
                       <label className="flex items-center space-x-3 cursor-pointer">
                         <input
                           type="checkbox"
                           checked={createOrderData.isCustom}
                           onChange={(e) => setCreateOrderData(prev => ({ 
                             ...prev, 
                             isCustom: e.target.checked,
                             customText: e.target.checked ? prev.customText : ''
                           }))}
                           className="w-5 h-5 text-brand-green border-3 focus:ring-brand-green"
                         />
                         <span className="text-sm font-bold uppercase tracking-wider text-black">
                           Add Custom Text (+${products.find(p => p._id === createOrderData.productId)?.customPrice || 0})
                         </span>
                       </label>
                       
                       {createOrderData.isCustom && (
                         <div>
                           <input
                             type="text"
                             value={createOrderData.customText}
                             onChange={(e) => setCreateOrderData(prev => ({ ...prev, customText: e.target.value }))}
                             className="w-full px-4 py-3 border-3 border-black shadow-brutal focus:shadow-brutalMd transition-all duration-200 font-body text-black placeholder-gray-500"
                             placeholder="Enter custom text (max 50 characters)"
                             maxLength={50}
                           />
                           <div className="text-xs text-brand-accent font-bold mt-1">
                             {createOrderData.customText.length}/50 characters
                           </div>
                         </div>
                       )}
                     </div>
                   </div>
                 )}

                 {/* Order Summary */}
                 {createOrderData.productId && createOrderData.size && createOrderData.city && (
                   <div className="bg-black text-white p-6 border-6 shadow-brutal">
                     <h3 className="text-lg font-display font-bold uppercase tracking-tight mb-4">
                       Order Summary
                     </h3>
                     <div className="space-y-2 text-sm">
                       <div className="flex justify-between">
                         <span>Product:</span>
                         <span>{products.find(p => p._id === createOrderData.productId)?.name}</span>
                       </div>
                       <div className="flex justify-between">
                         <span>Size:</span>
                         <span>{createOrderData.size}</span>
                       </div>
                       <div className="flex justify-between">
                         <span>Base Price:</span>
                         <span>${products.find(p => p._id === createOrderData.productId)?.price}</span>
                       </div>
                       {createOrderData.isCustom && (
                         <div className="flex justify-between">
                           <span>Custom Text:</span>
                           <span>+${products.find(p => p._id === createOrderData.productId)?.customPrice || 0}</span>
                         </div>
                       )}
                       <div className="flex justify-between">
                         <span>Shipping to {createOrderData.city}:</span>
                         <span>
                           +${cities.find(city => city.name === createOrderData.city)?.fee || 0}
                         </span>
                       </div>
                       <div className="border-t border-white pt-2 mt-4">
                         <div className="flex justify-between font-bold text-brand-green text-lg">
                           <span>Total:</span>
                           <span>
                             ${(() => {
                               const product = products.find(p => p._id === createOrderData.productId);
                               const city = cities.find(c => c.name === createOrderData.city);
                               const basePrice = product?.price || 0;
                               const customFee = createOrderData.isCustom && product?.customPrice ? product.customPrice : 0;
                               const shippingFee = city?.fee || 35;
                               return (basePrice + customFee + shippingFee).toFixed(2);
                             })()}
                           </span>
                         </div>
                       </div>
                     </div>
                   </div>
                 )}

                 {/* Action Buttons */}
                 <div className="flex gap-4">
                   <button
                     onClick={() => setShowCreateOrder(false)}
                     className="flex-1 px-4 py-3 bg-gray-500 text-white border-3 border-black shadow-brutal hover:shadow-brutalMd transition-all duration-200 font-bold uppercase tracking-wider rounded"
                   >
                     Cancel
                   </button>
                   <button
                     onClick={createOrder}
                     disabled={isCreatingOrder || !createOrderData.customerName || !createOrderData.whatsappNumber || !createOrderData.city || !createOrderData.productId || !createOrderData.size}
                     className="flex-1 px-4 py-3 bg-blue-500 text-white border-3 border-black shadow-brutal hover:shadow-brutalMd transition-all duration-200 font-bold uppercase tracking-wider rounded disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     {isCreatingOrder ? "Creating..." : "Create Order"}
                   </button>
                 </div>
               </div>
             </div>
           </div>
         </div>
       )}
    </div>
  );
}
