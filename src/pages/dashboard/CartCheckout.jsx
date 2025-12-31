import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import ProfileSelector from "../../components/Dashboard/Cart/ProfileSelector";
import UniversalCardPreview from "../../components/shared/UniversalCardPreview";
import OrderSummary from "../../components/Dashboard/Cart/OrderSummary";
import ContactInformationForm from "../../components/Dashboard/Cart/ContactInformationForm";
import ShippingAddressForm from "../../components/Dashboard/Cart/ShippingAddressForm";
import PaymentMethodSection from "../../components/Dashboard/Cart/PaymentMethodSection";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import { generateAIImage } from "../../utils/cardUtils";
import { Loader2 } from "lucide-react"; // <-- Added Loader2 import

export default function CartCheckout() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  // State management
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const [allProfiles, setAllProfiles] = useState([]);
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [profile, setProfile] = useState(null);

  const [showDesignEdit, setShowDesignEdit] = useState(false);

  const [aiPrompt, setAiPrompt] = useState("");

  const [currentDesign, setCurrentDesign] = useState({
    color: "",
    template: "",
    designMode: "manual",
    aiBackground: null,
    uploadedImage: null,
  });

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
    fetchProfiles();
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (selectedProfileId && allProfiles.length > 0) {
      const selected = allProfiles.find((p) => p.id === selectedProfileId);
      if (selected) {
        setProfile(selected);
        setCurrentDesign({
          color: selected.color,
          template: selected.template,
          designMode: selected.designMode,
          aiBackground: selected.aiBackground,
          uploadedImage: null,
        });
      }
    }
  }, [selectedProfileId, allProfiles]);

  const fetchProfiles = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/profiles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (data.success && data.data && data.data.length > 0) {
        setAllProfiles(data.data);
        setSelectedProfileId(data.data[0].id);
      } else {
        navigate("/create-card");
      }
    } catch (error) {
      console.error("Error fetching profiles:", error);
    } finally {
      setLoading(false);
    }
  };

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
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGenerateAI = async () => {
    setIsGeneratingAI(true);
    try {
      const imageUrl = await generateAIImage(aiPrompt);
      await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(imageUrl);
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = imageUrl;
      });
      setCurrentDesign({
        ...currentDesign,
        designMode: "ai",
        aiBackground: imageUrl,
        uploadedImage: null,
      });
    } catch (error) {
      alert("Failed to generate AI design. Please try again.");
      console.error(error);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setCurrentDesign({
          ...currentDesign,
          designMode: "upload",
          uploadedImage: event.target.result,
          aiBackground: null,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          profileId: profile.id,
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
          cardDesign: {
            ...currentDesign,
            uploadedImage: currentDesign.uploadedImage || null,
          },
          paymentMethod: "cash_on_delivery",
          totalAmount: 15.0,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Order placed successfully! We'll contact you soon.");
        navigate("/dashboard");
      } else {
        alert(data.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  if (loading) {
    return <LoadingSpinner fullPage text="Loading checkout..." />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Please create a profile first before ordering a card.
          </p>
          <button
            onClick={() => navigate("/create-card")}
            className="btn-primary"
          >
            Create Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-gray-600 hover:text-brand-primary transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Dashboard
          </button>
        </div>

        <h1 className="text-3xl font-bold text-brand-dark mb-2">
          Order Your NFC Card
        </h1>
        <p className="text-gray-600 mb-8">
          Review your card design and complete your order
        </p>

        <ProfileSelector
          profiles={allProfiles}
          selectedProfileId={selectedProfileId}
          onSelectProfile={setSelectedProfileId}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Your Card Preview
              </h2>
              <UniversalCardPreview
                profile={{
                  ...profile,
                  color: currentDesign.color,
                  template: currentDesign.template,
                  designMode: currentDesign.designMode,
                  aiBackground: currentDesign.aiBackground,
                  customDesignUrl: currentDesign.uploadedImage,
                }}
                selectedTemplate={currentDesign.template}
              />

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => navigate(`/dashboard/profiles/${profile.id}`)}
                  className="flex-1 btn-ghost-clean text-sm py-2"
                >
                  Edit Design
                </button>
              </div>
            </div>

            <OrderSummary totalAmount={15.0} />
          </div>

          <div className="lg:col-span-2">
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              <ContactInformationForm
                formData={formData}
                onChange={handleInputChange}
              />

              <ShippingAddressForm
                formData={formData}
                onChange={handleInputChange}
              />

              <PaymentMethodSection />

              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-primary py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin h-5 w-5" />{" "}
                    {/* <-- Updated spinner */}
                    Processing Order...
                  </span>
                ) : (
                  "Place Order"
                )}
              </button>

              <p className="text-center text-sm text-gray-500">
                By placing this order, you agree to our terms and conditions
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
