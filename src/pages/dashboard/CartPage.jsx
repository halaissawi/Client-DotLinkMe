import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  ChevronLeft,
  Plus,
  Minus,
  Sparkles,
  Zap,
  Star,
  Link2,
  Settings2,
  CheckCircle2
} from "lucide-react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, updateItemData, clearCart, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    // Check if all items that require a link have one
    const missingLinks = cartItems.filter(item => 
      ["social_link", "menu", "review"].includes(item.productType) && !item.setupUrl
    );

    if (missingLinks.length > 0) {
      Swal.fire({
        icon: "warning",
        title: "Setup Required",
        text: `Please setup the destination link for: ${missingLinks.map(i => i.name).join(", ")} before proceeding.`,
        confirmButtonColor: "#0066ff",
      });
      
      // Expand the first item that needs setup
      if (missingLinks.length > 0) {
        setExpandedItem(missingLinks[0].id);
      }
      return;
    }

    // All good, proceed to checkout page
    navigate("/dashboard/order-card");
  };

  const toggleExpand = (id) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  if (cartCount === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-brand-dark mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-xs text-center">
          Looks like you haven't added any products to your selection yet.
        </p>
        <button
          onClick={() => navigate("/gallery")}
          className="btn-primary-clean px-8 py-3 flex items-center gap-2"
        >
          Check out the Gallery
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <button
            onClick={() => navigate("/gallery")}
            className="flex items-center gap-2 text-gray-500 hover:text-brand-primary transition-colors text-sm mb-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Gallery
          </button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-brand-primary to-blue-600 bg-clip-text text-transparent">
            Your Selection
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-gray-400 hover:text-red-500 text-sm font-medium transition-colors"
        >
          Clear All Items
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="group flex flex-col bg-white border border-gray-200 rounded-3xl overflow-hidden hover:border-brand-primary/50 transition-all shadow-sm hover:shadow-md">
              <div className="p-5 flex items-center gap-4">
                {/* Product Icon */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-brand-primary/5 transition-colors border border-gray-100 overflow-hidden">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-contain p-2 hover:scale-110 transition-transform duration-500" 
                    />
                  ) : (
                    <>
                      {item.productType === 'social_link' && <Zap className="w-8 h-8 text-pink-500" />}
                      {item.productType === 'menu' && <Sparkles className="w-8 h-8 text-orange-500" />}
                      {item.productType === 'review' && <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />}
                      {!['social_link', 'menu', 'review'].includes(item.productType) && <ShoppingBag className="w-8 h-8 text-brand-primary" />}
                    </>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-brand-primary transition-colors truncate">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                          {item.productType?.replace('_', ' ')}
                        </span>
                        {item.setupUrl && (
                          <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Configured
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <button 
                      onClick={() => toggleExpand(item.id)}
                      className={`text-xs font-bold flex items-center gap-2 transition-colors ${expandedItem === item.id ? 'text-brand-primary' : 'text-gray-500 hover:text-brand-primary'}`}
                    >
                      <Settings2 className="w-4 h-4" />
                      {item.setupUrl ? 'Edit Link' : 'Setup Link Now'}
                    </button>
                    <p className="text-sm font-black text-brand-primary">Free</p>
                  </div>
                </div>
              </div>

              {/* Expandable Setup Section */}
              {expandedItem === item.id && (
                <div className="px-5 pb-6 pt-2 bg-gray-50 border-t border-gray-100 animate-in slide-in-from-top-2 duration-300">
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                         <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nickname</label>
                         <input 
                           type="text" 
                           placeholder="My Business Page"
                           value={item.setupNickname || ""}
                           onChange={(e) => updateItemData(item.id, { setupNickname: e.target.value })}
                           className="w-full px-4 py-2 text-sm rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all outline-none bg-white"
                         />
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Destination URL</label>
                         <div className="relative">
                            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                            <input 
                              type="url" 
                              placeholder="https://..."
                              value={item.setupUrl || ""}
                              onChange={(e) => updateItemData(item.id, { setupUrl: e.target.value })}
                              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all outline-none bg-white"
                            />
                         </div>
                      </div>
                   </div>
                   <p className="text-[10px] text-gray-400 mt-3 italic">
                      Entering data here will automatically activate your product upon claiming. You can also do this later.
                   </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold text-brand-dark mb-6">Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Items Selected</span>
                <span className="font-semibold text-brand-dark">{cartCount}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Total Value</span>
                <span className="text-brand-primary font-bold">Free Claim</span>
              </div>
              <div className="h-px bg-gray-100 my-4" />
              <div className="flex items-center gap-3 p-3 bg-brand-primary/5 rounded-2xl border border-brand-primary/10">
                 <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-brand-primary" />
                 </div>
                 <p className="text-[11px] text-gray-600 leading-tight">
                    All digital items will be instantly activated and available for use after claiming.
                 </p>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full btn-primary py-4 rounded-2xl font-bold flex items-center justify-center gap-2 group hover:shadow-xl hover:shadow-brand-primary/20 transition-all disabled:opacity-50"
            >
              {isProcessing ? "Processing..." : (
                <>
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <p className="mt-4 text-[10px] text-gray-400 text-center leading-relaxed">
              * This will process {cartCount} product activation{cartCount > 1 ? 's' : ''} on your account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
