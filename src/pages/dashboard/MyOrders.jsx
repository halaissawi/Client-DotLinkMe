import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Hourglass,
  Check,
  Cog,
  Truck,
  X,
  Package,
  User,
  Briefcase,
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

  const statusDescriptions = {
    pending: "Your order is awaiting confirmation",
    confirmed: "Order confirmed! We're preparing your card",
    processing: "Your card is being manufactured",
    shipped: "Your card is on its way!",
    delivered: "Your card has been delivered",
    cancelled: "This order was cancelled",
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

      if (data.success) {
        setOrders(data.data);
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
            Track your NFC card orders
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/cart")}
          className="btn-primary whitespace-nowrap w-full sm:w-auto text-sm sm:text-base py-2.5 sm:py-2"
        >
          + Order New Card
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
            You haven't ordered any NFC cards yet. Get started by creating your
            first card!
          </p>
          <button
            onClick={() => navigate("/dashboard/cart")}
            className="btn-primary w-full sm:w-auto"
          >
            Order Your First Card
          </button>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-gray-100 sm:border-2 hover:border-brand-primary/30 transition-all"
            >
              <div className="p-4 sm:p-6">
                {/* Order Header */}
                <div className="flex flex-col gap-3 sm:gap-4 mb-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900">
                          Order #{order.orderNumber}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold border w-fit ${statusColors[order.orderStatus]
                            }`}
                        >
                          {statusIcons[order.orderStatus]} {order.orderStatus}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {statusDescriptions[order.orderStatus]}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xs sm:text-sm text-gray-600">
                        Order Date
                      </p>
                      <p className="text-sm sm:text-base font-semibold text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl">
                  {/* Card Info */}
                  <div className="flex items-center gap-3 col-span-1">
                    {order.profile?.avatarUrl ? (
                      <img
                        src={order.profile.avatarUrl}
                        alt={order.profile.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover border-2 border-white shadow-sm flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-brand-primary/10 border-2 border-brand-primary/20 flex items-center justify-center flex-shrink-0">
                        {order.cardType === "personal" ? (
                          <User className="w-4 h-4 sm:w-5 sm:h-5 text-brand-primary" />
                        ) : (
                          <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-brand-primary" />
                        )}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {order.profile?.name || "NFC Card"}
                      </p>
                      <p className="text-xs text-gray-600">
                        {order.cardType === "personal"
                          ? "Personal Card"
                          : "Business Card"}
                      </p>
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div className="col-span-1">
                    <p className="text-xs text-gray-600 mb-1">Ship to:</p>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {order.shippingCity}, {order.shippingCountry}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {order.shippingAddress}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="col-span-1 sm:col-span-2 lg:col-span-1 text-left sm:text-right">
                    <p className="text-xs text-gray-600 mb-1">Total</p>
                    <p className="text-xl sm:text-2xl font-bold text-brand-primary">
                      {order.totalAmount} JOD
                    </p>
                  </div>
                </div>

                {/* Order Timeline - Mobile Optimized */}
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                  {/* Desktop Timeline */}
                  <div className="hidden sm:flex items-center gap-2 text-xs">
                    <div
                      className={`flex items-center gap-1 ${[
                          "pending",
                          "confirmed",
                          "processing",
                          "shipped",
                          "delivered",
                        ].includes(order.orderStatus)
                          ? "text-green-600"
                          : "text-gray-400"
                        }`}
                    >
                      <div className="w-2 h-2 rounded-full bg-current"></div>
                      <span>Ordered</span>
                    </div>
                    <div className="flex-1 h-px bg-gray-300"></div>
                    <div
                      className={`flex items-center gap-1 ${[
                          "confirmed",
                          "processing",
                          "shipped",
                          "delivered",
                        ].includes(order.orderStatus)
                          ? "text-green-600"
                          : "text-gray-400"
                        }`}
                    >
                      <div className="w-2 h-2 rounded-full bg-current"></div>
                      <span>Confirmed</span>
                    </div>
                    <div className="flex-1 h-px bg-gray-300"></div>
                    <div
                      className={`flex items-center gap-1 ${["processing", "shipped", "delivered"].includes(
                        order.orderStatus
                      )
                          ? "text-green-600"
                          : "text-gray-400"
                        }`}
                    >
                      <div className="w-2 h-2 rounded-full bg-current"></div>
                      <span>Processing</span>
                    </div>
                    <div className="flex-1 h-px bg-gray-300"></div>
                    <div
                      className={`flex items-center gap-1 ${["shipped", "delivered"].includes(order.orderStatus)
                          ? "text-green-600"
                          : "text-gray-400"
                        }`}
                    >
                      <div className="w-2 h-2 rounded-full bg-current"></div>
                      <span>Shipped</span>
                    </div>
                    <div className="flex-1 h-px bg-gray-300"></div>
                    <div
                      className={`flex items-center gap-1 ${order.orderStatus === "delivered"
                          ? "text-green-600"
                          : "text-gray-400"
                        }`}
                    >
                      <div className="w-2 h-2 rounded-full bg-current"></div>
                      <span>Delivered</span>
                    </div>
                  </div>

                  {/* Mobile Timeline - Vertical */}
                  <div className="sm:hidden space-y-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${[
                            "pending",
                            "confirmed",
                            "processing",
                            "shipped",
                            "delivered",
                          ].includes(order.orderStatus)
                            ? "bg-green-600"
                            : "bg-gray-400"
                          }`}
                      ></div>
                      <span
                        className={`text-xs ${[
                            "pending",
                            "confirmed",
                            "processing",
                            "shipped",
                            "delivered",
                          ].includes(order.orderStatus)
                            ? "text-green-600 font-medium"
                            : "text-gray-400"
                          }`}
                      >
                        Ordered
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${[
                            "confirmed",
                            "processing",
                            "shipped",
                            "delivered",
                          ].includes(order.orderStatus)
                            ? "bg-green-600"
                            : "bg-gray-400"
                          }`}
                      ></div>
                      <span
                        className={`text-xs ${[
                            "confirmed",
                            "processing",
                            "shipped",
                            "delivered",
                          ].includes(order.orderStatus)
                            ? "text-green-600 font-medium"
                            : "text-gray-400"
                          }`}
                      >
                        Confirmed
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${["processing", "shipped", "delivered"].includes(
                          order.orderStatus
                        )
                            ? "bg-green-600"
                            : "bg-gray-400"
                          }`}
                      ></div>
                      <span
                        className={`text-xs ${["processing", "shipped", "delivered"].includes(
                          order.orderStatus
                        )
                            ? "text-green-600 font-medium"
                            : "text-gray-400"
                          }`}
                      >
                        Processing
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${["shipped", "delivered"].includes(order.orderStatus)
                            ? "bg-green-600"
                            : "bg-gray-400"
                          }`}
                      ></div>
                      <span
                        className={`text-xs ${["shipped", "delivered"].includes(order.orderStatus)
                            ? "text-green-600 font-medium"
                            : "text-gray-400"
                          }`}
                      >
                        Shipped
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${order.orderStatus === "delivered"
                            ? "bg-green-600"
                            : "bg-gray-400"
                          }`}
                      ></div>
                      <span
                        className={`text-xs ${order.orderStatus === "delivered"
                            ? "text-green-600 font-medium"
                            : "text-gray-400"
                          }`}
                      >
                        Delivered
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delivery Dates */}
                {(order.shippedAt || order.deliveredAt) && (
                  <div className="mt-3 flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs text-gray-600">
                    {order.shippedAt && (
                      <p>
                        Shipped on:{" "}
                        {new Date(order.shippedAt).toLocaleDateString()}
                      </p>
                    )}
                    {order.deliveredAt && (
                      <p>
                        Delivered on:{" "}
                        {new Date(order.deliveredAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Payment Method Footer */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 sm:px-6 py-3 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Wallet className="w-4 h-4 flex-shrink-0" />
                    <span>Payment: Cash on Delivery</span>
                  </div>
                  {order.orderStatus === "delivered" && (
                    <span className="text-green-600 font-medium">
                      <Check className="inline w-4 h-4 mr-1" />
                      Completed
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Help Section */}
      {orders.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-200 sm:border-2">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-5 h-5 sm:w-7 sm:h-7 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
                Need help with your order?
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-3">
                If you have any questions about your order or need to make changes, please contact our support team.
              </p>
              <a href="https://wa.me/962789924535" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-brand-primary hover:text-brand-primary/80 transition-colors">
                Contact Support →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
