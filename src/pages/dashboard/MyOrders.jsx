import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Hourglass,
  Check,
  Cog,
  Truck,
  X,
  Package,
  Wallet,
  MessageCircle,
} from "lucide-react";

export default function MyOrders() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    confirmed: "bg-blue-100 text-blue-800 border-blue-300",
    processing: "bg-purple-100 text-purple-800 border-purple-300",
    shipped: "bg-indigo-100 text-indigo-800 border-indigo-300",
    delivered: "bg-green-100 text-green-800 border-green-300",
    cancelled: "bg-red-100 text-red-800 border-red-300",
  };

  const statusIcons = {
    pending: <Hourglass className="w-4 h-4" />,
    confirmed: <Check className="w-4 h-4" />,
    processing: <Cog className="w-4 h-4" />,
    shipped: <Truck className="w-4 h-4" />,
    delivered: <Check className="w-4 h-4" />,
    cancelled: <X className="w-4 h-4" />,
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        setOrders(data.data);
      } else if (Array.isArray(data)) {
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-3 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-brand-dark">
            My Orders
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Track your NFC product orders
          </p>
        </div>
        <button
          onClick={() => navigate("/gallery")}
          className="btn-primary whitespace-nowrap w-full sm:w-auto text-sm sm:text-base py-2.5 sm:py-2"
        >
          + Order New Products
        </button>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-12 text-center">
          <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <Package className="w-8 h-8 sm:w-12 sm:h-12 text-gray-500" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            No orders yet
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-2">
            You haven't ordered any NFC products yet. Get started by browsing our gallery!
          </p>
          <button
            onClick={() => navigate("/gallery")}
            className="btn-primary w-full sm:w-auto"
          >
            Browse Gallery
          </button>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-gray-100 hover:border-brand-primary/20 transition-all duration-300"
            >
              {/* Order Header */}
              <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center">
                      <Package className="w-5 h-5 text-brand-primary" />
                   </div>
                   <div>
                      <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">
                        Order #{order.orderNumber}
                      </h3>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }) : 'Recent'}
                      </p>
                   </div>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] border shadow-sm ${statusColors[order.orderStatus || 'pending']}`}>
                  {statusIcons[order.orderStatus || 'pending']} 
                  {order.orderStatus || 'pending'}
                </span>
              </div>

              <div className="p-6">
                {/* Order Items */}
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
                    Products in this Order
                  </p>
                  <div className="grid grid-cols-1 gap-4">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, idx) => (
                        <div 
                          key={idx} 
                          className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100 group hover:bg-white hover:shadow-md transition-all"
                        >
                          <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                             <img 
                               src={item.image || "/products/placeholder.png"} 
                               className="w-full h-full object-contain p-1" 
                               alt={item.productName}
                             />
                          </div>
                          <div className="flex-1 min-w-0">
                             <h4 className="text-sm font-bold text-gray-900 truncate">
                               {item.productName || "NFC Product"}
                             </h4>
                             <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">
                               {item.productType?.replace('_', ' ') || 'Product'}
                             </p>
                          </div>
                          <div className="text-right">
                             <p className="text-xs font-black text-brand-primary">
                               {item.price === 0 ? 'FREE' : `${item.price} JOD`}
                             </p>
                             <p className="text-[9px] text-gray-400 font-bold uppercase">
                               Qty: {item.quantity || 1}
                             </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 italic">No items found</p>
                    )}
                  </div>
                </div>

                {/* Shipping & Payment Footer */}
                <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">
                      Shipping Details
                    </h4>
                    <div className="flex gap-3">
                       <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                          <Truck className="w-4 h-4 text-gray-400" />
                       </div>
                       <div className="text-xs">
                          <p className="font-bold text-gray-800">
                            {order.shippingCity || 'N/A'}, {order.shippingCountry || 'Jordan'}
                          </p>
                          <p className="text-gray-500">
                            {order.shippingAddress || 'Digital Delivery'}
                          </p>
                       </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-start md:items-end justify-center">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">
                       Total Amount
                     </p>
                     <p className="text-3xl font-black text-gray-900">
                       {order.totalAmount === 0 ? 'FREE' : `${order.totalAmount} JOD`}
                     </p>
                     <div className="flex items-center gap-1.5 text-[10px] font-bold text-green-600 mt-1 uppercase tracking-widest">
                        <Wallet size={12} />
                        Cash on Delivery
                     </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Help Section */}
      {orders.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 border-2 border-blue-100 shadow-sm mt-12">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-black text-gray-900 mb-2">
                Need help with your order?
              </h3>
              <p className="text-sm text-gray-600 mb-4 max-w-md">
                Our support team is available 24/7 to help you with your NFC product activation or delivery status.
              </p>
              <a 
                href="https://wa.me/962789924535" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-primary text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all"
              >
                Contact Support →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}