import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import OrderSummary from "../../components/Dashboard/Cart/OrderSummary";
import ContactInformationForm from "../../components/Dashboard/Cart/ContactInformationForm";
import ShippingAddressForm from "../../components/Dashboard/Cart/ShippingAddressForm";
import PaymentMethodSection from "../../components/Dashboard/Cart/PaymentMethodSection";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import { Loader2, Package, CheckCircle2, ArrowRight } from "lucide-react"; 
import { useCart } from "../../context/CartContext";
import Swal from "sweetalert2";


export default function CartCheckout() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const API_URL = import.meta.env.VITE_API_URL;

  // State management
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);


  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "Jordan",
    notes: "",
  });

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      setFormData((prev) => ({
        ...prev,
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || "",
        phone: data.phoneNumber || "",
      }));
    } catch (error) {
      console.error("Error fetching user info:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    
    setSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      Swal.fire({
        title: "Processing Order...",
        text: "Please wait while we set up your products",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      for (const item of cartItems) {
        // CASE A: Digital Products (Social Link, Menu, Review)
        if (["social_link", "menu", "review"].includes(item.productType)) {
          // 1. Purchase digital asset
          const purchaseRes = await fetch(`${API_URL}/api/user-products/purchase`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              productId: item.productId || item.id,
              quantity: 1,
              isPaid: true,
            }),
          });
          
          if (purchaseRes.ok) {
            const purchaseData = await purchaseRes.json();
            const userProductId = purchaseData.data.id;

            // 2. Setup (If link exists)
            if (item.setupUrl) {
              await fetch(`${API_URL}/api/user-products/${userProductId}/setup`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  nickname: item.setupNickname || item.name,
                  profileData: {
                    platform: item.platform || null,
                    url: item.setupUrl,
                    googleReviewUrl: item.productType === 'review' ? item.setupUrl : undefined,
                  },
                  setupComplete: true,
                }),
              });
            }
          }

          // 3. Create an "Order" entry so it shows in My Orders
          // We use the same fields as the working profile order, but adapted
          await fetch(`${API_URL}/api/orders`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              // Many backends require these fields
              customerInfo: {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
              },
              shippingInfo: {
                address: formData.address,
                city: formData.city,
                country: formData.country,
                notes: formData.notes,
              },
              paymentMethod: "cash_on_delivery",
              totalAmount: item.price || 0,
              // Match backend expectations for product identification
              productId: item.productId || item.id,
              productName: item.name,
              orderType: 'digital_activation'
            }),
          });
        } 
        
        // CASE B: Physical NFC Cards / Profiles
        else {
          await fetch(`${API_URL}/api/orders`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              // Mandatory fields for profile-based cards
              profileId: item.profileId || (item.productType === 'profile' || item.type === 'profile' ? item.id : null),
              customerInfo: {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
              },
              shippingInfo: {
                address: formData.address,
                city: formData.city,
                country: formData.country,
                notes: formData.notes,
              },
              cardDesign: item.design || { color: "#0066ff", template: "default" },
              paymentMethod: "cash_on_delivery",
              totalAmount: item.price || 15.0,
            }),
          });
        }
      }

      Swal.fire({
        icon: "success",
        title: "Order Processed!",
        text: "Your items have been ordered and activations are complete.",
        confirmButtonColor: "#0066ff",
      }).then(() => {
        clearCart();
        navigate("/dashboard");
      });

    } catch (error) {
      console.error("Order submission error:", error);
      Swal.fire({
        icon: "error",
        title: "Order Failed",
        text: "One or more items could not be processed. Please check My Orders.",
      });
    } finally {
      setSubmitting(false);
    }
  };
  if (loading) {
    return <LoadingSpinner fullPage text="Loading checkout..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumbs / Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <button
              onClick={() => navigate("/dashboard/cart")}
              className="group flex items-center gap-2 text-gray-400 hover:text-brand-primary transition-colors text-sm font-bold uppercase tracking-widest mb-4"
            >
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Selection
            </button>
            <h1 className="text-5xl font-black text-gray-900 tracking-tight">
              Checkout <span className="text-brand-primary">.</span>
            </h1>
          </div>
          <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-[2rem] shadow-sm border border-gray-100">
             <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                <Package className="w-6 h-6 text-green-600" />
             </div>
             <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Items in Order</p>
                <p className="text-xl font-black text-gray-900">{cartItems.length} Products</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Form Area */}
          <div className="lg:col-span-8 space-y-10">
            {/* Products Overview */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-50">
               <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                  Your Selection
                  <span className="text-xs font-bold px-3 py-1 bg-gray-100 text-gray-500 rounded-full uppercase tracking-widest">Review</span>
               </h2>
               <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-6 p-4 rounded-3xl hover:bg-gray-50 transition-colors group">
                       <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-gray-100 flex-shrink-0 flex items-center justify-center p-2 group-hover:scale-105 transition-transform">
                          <img 
                            src={item.image || "/products/placeholder.png"} 
                            alt={item.name} 
                            className="w-full h-full object-contain"
                          />
                       </div>
                       <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 group-hover:text-brand-primary transition-colors truncate">{item.name}</h4>
                          <p className="text-sm text-gray-400 font-medium truncate mb-2">{item.setupNickname || "NFC Activation"}</p>
                          <div className="flex items-center gap-2">
                             <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100">
                                <CheckCircle2 size={12} />
                                Configured
                             </div>
                             {item.setupUrl && (
                                <p className="text-[10px] text-gray-400 truncate max-w-[150px] font-mono">{item.setupUrl}</p>
                             )}
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total</p>
                          <p className="text-lg font-black text-brand-primary">{item.price || 'Free'}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <form onSubmit={handleSubmitOrder} className="space-y-10">
              {/* Contact Information */}
              <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-50">
                 <ContactInformationForm
                   formData={formData}
                   onChange={handleInputChange}
                 />
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-50">
                 <ShippingAddressForm
                   formData={formData}
                   onChange={handleInputChange}
                 />
              </div>

              {/* Payment Info */}
              <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-50">
                 <PaymentMethodSection />
              </div>

              {/* Submit Section */}
              <div className="flex flex-col items-center gap-6">
                 <button
                   type="submit"
                   disabled={submitting}
                   className="w-full btn-primary py-6 rounded-[2rem] text-xl font-black shadow-2xl shadow-brand-primary/20 hover:shadow-3xl hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-4 group"
                 >
                   {submitting ? (
                     <>
                        <Loader2 className="animate-spin w-8 h-8" />
                        Finalizing Order...
                     </>
                   ) : (
                     <>
                        Complete Purchase & Activate
                        <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                     </>
                   )}
                 </button>
                 <p className="text-gray-400 text-sm font-medium">
                    By placing this order, you agree to our <span className="text-brand-primary cursor-pointer hover:underline">Terms of Service</span>
                 </p>
              </div>
            </form>
          </div>

          {/* Sidebar / Sidebar Summary */}
          <div className="lg:col-span-4">
             <div className="sticky top-24 space-y-8">
                <div className="bg-brand-dark text-white rounded-[2.5rem] p-8 shadow-2xl">
                   <h3 className="text-2xl font-black mb-8">Order Summary</h3>
                   <div className="space-y-6">
                      <div className="flex justify-between items-center pb-6 border-b border-white/10">
                         <span className="text-white/60 font-bold uppercase tracking-widest text-xs">Subtotal</span>
                         <span className="text-xl font-black">{cartTotal || 'Free'}</span>
                      </div>
                      <div className="flex justify-between items-center pb-6 border-b border-white/10">
                         <span className="text-white/60 font-bold uppercase tracking-widest text-xs">Shipping</span>
                         <span className="text-lg font-black text-green-400">FREE</span>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                         <span className="text-white font-black uppercase tracking-[0.2em] text-sm">Grand Total</span>
                         <span className="text-4xl font-black bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
                            {cartTotal || 'Free'}
                         </span>
                      </div>
                   </div>

                   <div className="mt-10 p-4 bg-white/5 rounded-2xl border border-white/10">
                      <div className="flex gap-4">
                         <div className="w-10 h-10 bg-brand-primary/20 rounded-xl flex items-center justify-center shrink-0">
                            <CheckCircle2 size={20} className="text-brand-primary" />
                         </div>
                         <p className="text-xs text-white/60 leading-relaxed">
                            Your products will be activated immediately and your items will be shipped within 2-3 business days.
                         </p>
                      </div>
                   </div>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-col items-center gap-4 opacity-50">
                   <div className="flex gap-2">
                      <div className="h-6 w-10 bg-gray-200 rounded"></div>
                      <div className="h-6 w-10 bg-gray-200 rounded"></div>
                      <div className="h-6 w-10 bg-gray-200 rounded"></div>
                   </div>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Secure 256-bit SSL Transaction</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
