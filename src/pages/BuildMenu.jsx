import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import BuildMenuHero from "../components/CreateCard/BuildMenuHero";
import StepBasics from "../components/MenuBuilder/StepBasics";
import StepMenuItems from "../components/MenuBuilder/StepMenuItems";
import StepDesign from "../components/MenuBuilder/StepDesign";
import StepReview from "../components/MenuBuilder/StepReview";

const INITIAL_MENU_DATA = {
  // Basics
  restaurantName: "",
  tagline: "",
  cuisineType: "",
  logo: null,
  coverImage: null,
  
  // Contact
  phone: "",
  email: "",
  address: "",
  website: "",
  
  // Menu Items
  categories: [],
  
  // Design
  theme: {
    primaryColor: "#f2a91d",
    layout: "modern",
    fontFamily: "Inter",
  },
  
  // Social
  social: {
    facebook: "",
    instagram: "",
    twitter: "",
  },
};

const STEPS = [
  { id: 1, name: "Basics", component: StepBasics },
  { id: 2, name: "Menu Items", component: StepMenuItems },
  { id: 3, name: "Design", component: StepDesign },
  { id: 4, name: "Review", component: StepReview },
];

export default function BuildMenu() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(INITIAL_MENU_DATA);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    AOS.init({ duration: 900, once: true });
    
    const savedData = localStorage.getItem("buildMenuFormData");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Merge with defaults to ensure no undefined values
        setFormData({
          ...INITIAL_MENU_DATA,
          ...parsed,
          theme: {
            ...INITIAL_MENU_DATA.theme,
            ...(parsed.theme || {}),
          },
          social: {
            ...INITIAL_MENU_DATA.social,
            ...(parsed.social || {}),
          },
        });
      } catch (e) {
        console.error("Error parsing saved menu data", e);
      }
    }
  }, []);

  const updateFormData = (updates) => {
    setFormData((prev) => {
      const newData = {
        ...INITIAL_MENU_DATA,
        ...prev,
        ...updates,
        theme: {
          ...INITIAL_MENU_DATA.theme,
          ...(prev.theme || {}),
          ...(updates.theme || {}),
        },
        social: {
          ...INITIAL_MENU_DATA.social,
          ...(prev.social || {}),
          ...(updates.social || {}),
        },
      };
      localStorage.setItem("buildMenuFormData", JSON.stringify(newData));
      return newData;
    });
  };

  const validateStep = () => {
    if (currentStep === 1) {
      if (!formData.restaurantName.trim()) {
        Swal.fire({
          icon: "error",
          title: "Required Field",
          text: "Restaurant name is required",
          confirmButtonColor: "#f2a91d",
        });
        return false;
      }
    }
    
    if (currentStep === 2) {
      if (formData.categories.length === 0) {
        Swal.fire({
          icon: "error",
          title: "Add Menu Items",
          text: "Please add at least one category with items",
          confirmButtonColor: "#f2a91d",
        });
        return false;
      }
      
      const hasItems = formData.categories.some(cat => 
        cat.items && cat.items.length > 0
      );
      
      if (!hasItems) {
        Swal.fire({
          icon: "error",
          title: "Add Menu Items",
          text: "Please add items to your categories",
          confirmButtonColor: "#f2a91d",
        });
        return false;
      }
    }
    
    return true;
  };

  const nextStep = () => {
    if (!validateStep()) return;
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleCreateMenu = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      Swal.fire({
        icon: "info",
        title: "Login Required",
        html: `
          <p>Please login to save your menu.</p>
          <p class="text-sm text-gray-500 mt-2">Don't worry, your work is saved!</p>
        `,
        confirmButtonColor: "#f2a91d",
        confirmButtonText: "Go to Login",
        showCancelButton: true,
        cancelButtonText: "Sign Up",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login", { state: { returnTo: "/build-menu" } });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          navigate("/signup", { state: { returnTo: "/build-menu" } });
        }
      });
      return;
    }

    if (!validateStep()) return;

    setLoading(true);

    try {
      // Create menu WITHOUT purchasing
      const createRes = await fetch(`${API_URL}/api/menus/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          restaurantName: formData.restaurantName,
          tagline: formData.tagline,
          cuisineType: formData.cuisineType,
          logo: formData.logo,
          coverImage: formData.coverImage,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          website: formData.website,
          categories: formData.categories.filter(
            cat => cat.name && cat.items && cat.items.length > 0
          ),
          theme: formData.theme,
          social: formData.social,
          status: "active", // Menu is active immediately
        }),
      });

      const createData = await createRes.json();
      
      if (!createRes.ok) {
        throw new Error(createData.message || "Failed to create menu");
      }

      localStorage.removeItem("buildMenuFormData");

      // Show success with direct links
      Swal.fire({
        icon: "success",
        title: "Menu Created! 🎉",
        html: `
          <div class="text-left space-y-4">
            <p class="text-gray-700">Your digital restaurant menu is now live and ready to be shared with customers!</p>
            
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <div class="flex items-start gap-3">
                <div class="bg-green-100 p-2 rounded-lg text-green-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p class="font-bold text-green-800 text-sm">Menu Active</p>
                  <p class="text-xs text-green-700 mt-1">Your menu link is active and reachable via QR code or NFC.</p>
                </div>
              </div>
            </div>
            
            <p class="text-sm text-gray-600">You can manage, edit, and view analytics for this menu in your dashboard.</p>
          </div>
        `,
        confirmButtonText: "🚀 View My Menu",
        confirmButtonColor: "#0ea5e9",
        showCancelButton: true,
        cancelButtonText: "Go to Dashboard",
        cancelButtonColor: "#6b7280",
        width: "500px",
      }).then((result) => {
        if (result.isConfirmed) {
          window.open(`/menu/${createData.data.uniqueSlug}`, "_blank");
          navigate("/dashboard");
        } else {
          navigate("/dashboard");
        }
      });
    } catch (err) {
      console.error("Error creating menu:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Failed to create menu",
        confirmButtonColor: "#f2a91d",
      });
    } finally {
      setLoading(false);
    }
  };

  const CurrentStepComponent = STEPS[currentStep - 1].component;

  return (
    <div className="min-h-screen bg-gray-50">
      <BuildMenuHero />

      {/* Progress Bar */}
      <div className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((step, idx) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      currentStep > step.id
                        ? "bg-green-500 text-white"
                        : currentStep === step.id
                        ? "bg-[#f2a91d] text-white ring-4 ring-[#f2a91d]/20"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium mt-2 hidden sm:block ${
                      currentStep === step.id
                        ? "text-[#f2a91d]"
                        : "text-gray-500"
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 rounded transition-all ${
                      currentStep > step.id ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8" data-aos="fade-up">
          <CurrentStepComponent
            formData={formData}
            updateFormData={updateFormData}
          />

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>

            {currentStep < STEPS.length ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#f2a91d] to-yellow-500 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all"
              >
                Next Step
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCreateMenu}
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Create Menu
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}