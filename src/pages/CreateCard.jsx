import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate, useLocation } from "react-router-dom";
import { Sparkle, Upload, Wand2, Edit3, Eye, RefreshCw } from "lucide-react";

import CreateCardHero from "../components/CreateCard/CreateCardHero";
import ProfileTypeSwitch from "../components/CreateCard/ProfileTypeSwitch";
import ProfileForm from "../components/CreateCard/ProfileForm";
import LiveCardPreview from "../components/CreateCard/LiveCardPreview";
import CVUploadModal from "../components/CreateCard/CVUploadModal";
import CustomProfileRenderer from "../components/PublicProfile/CustomProfileRenderer";
import { TEMPLATES_ARRAY } from "../constants/cardTemplates";
import Swal from "sweetalert2";

const INITIAL_PERSONAL_DATA = {
  name: "",
  title: "",
  bio: "",
  color: "#2563eb",
  image: null,
  designMode: "manual",
  aiPrompt: "",
  aiBackground: null,
  customDesignUrl: null,
  customDesignFile: null,
};

const INITIAL_BUSINESS_DATA = {
  name: "",
  title: "",
  bio: "",
  color: "#2563eb",
  logo: null,
  designMode: "manual",
  aiPrompt: "",
  aiBackground: null,
  customDesignUrl: null,
  customDesignFile: null,
};

const INITIAL_SOCIAL_LINKS = {
  website: "",
  linkedin: "",
  instagram: "",
  twitter: "",
  github: "",
  whatsapp: "",
  email: "",
  phone: "",
};

async function createProfile(profileData, token) {
  const formData = new FormData();

  formData.append("profileType", profileData.profileType);
  formData.append("name", profileData.name);
  formData.append("title", profileData.title || "");
  formData.append("bio", profileData.bio || "");
  formData.append("color", profileData.color);
  formData.append("designMode", profileData.designMode);
  formData.append("template", profileData.template);
  if (profileData.productId) {
    formData.append("productId", profileData.productId);
  }

  if (profileData.aiPrompt) {
    formData.append("aiPrompt", profileData.aiPrompt);
  }

  if (profileData.aiBackground) {
    formData.append("aiBackground", profileData.aiBackground);
  }

  if (profileData.avatarFile) {
    formData.append("avatar", profileData.avatarFile);
  }

  if (profileData.customDesignUrl) {
    formData.append("customDesignUrl", profileData.customDesignUrl);
  }

  // 🆕 Add custom profile design (for AI-generated profile pages)
  if (profileData.customProfileDesign) {
    formData.append(
      "customProfileDesign",
      JSON.stringify(profileData.customProfileDesign),
    );
  }

  // Add skills and experience if available
  if (profileData.skills) {
    formData.append("skills", JSON.stringify(profileData.skills));
  }

  if (profileData.experience) {
    formData.append("experience", JSON.stringify(profileData.experience));
  }

  if (profileData.education) {
    formData.append("education", JSON.stringify(profileData.education));
  }

  const buildFinalLink = (platform, value) => {
    const username = value.trim();

    if (username.startsWith("http://") || username.startsWith("https://")) {
      return username;
    }

    switch (platform) {
      case "instagram":
        return `https://instagram.com/${username}`;
      case "linkedin":
        return `https://linkedin.com/in/${username}`;
      case "twitter":
      case "x":
        return `https://twitter.com/${username}`;
      case "github":
        return `https://github.com/${username}`;
      case "facebook":
        return `https://facebook.com/${username}`;
      case "website":
        return `https://${username}`;
      default:
        return username;
    }
  };

  const socialLinksArray = Object.entries(profileData.socialLinks)
    .filter(([_, value]) => value && value.trim())
    .map(([platform, url]) => ({
      platform: platform === "x" ? "twitter" : platform,
      url: buildFinalLink(platform, url),
    }));

  formData.append("socialLinks", JSON.stringify(socialLinksArray));
  const API_URL = import.meta.env.VITE_API_URL;

  const response = await fetch(`${API_URL}/api/profiles`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return response;
}

export default function CreateCard() {
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product;
  const isAccessory = product?.category === "Accessories" || product?.category === "Bracelet";

  const [loading, setLoading] = useState(false);
  const [profileType, setProfileType] = useState("personal");
  const [selectedTemplate, setSelectedTemplate] = useState("template1");
  const [personalData, setPersonalData] = useState(INITIAL_PERSONAL_DATA);
  const [businessData, setBusinessData] = useState(INITIAL_BUSINESS_DATA);
  const [socialLinks, setSocialLinks] = useState(INITIAL_SOCIAL_LINKS);
  const [showCVModal, setShowCVModal] = useState(false);

  // 🆕 Profile creation mode: "manual" or "ai-profile"
  const [profileCreationMode, setProfileCreationMode] = useState("manual");

  // 🆕 AI-generated profile data with custom design
  const [aiGeneratedProfile, setAiGeneratedProfile] = useState(null);
  const [showProfilePreview, setShowProfilePreview] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 900, once: true });

    const savedFormData = localStorage.getItem("createCardFormData");
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);

        if (parsedData.profileType) {
          setProfileType(parsedData.profileType);
        }

        if (parsedData.selectedTemplate) {
          setSelectedTemplate(parsedData.selectedTemplate);
        }

        if (parsedData.personalData) {
          setPersonalData(parsedData.personalData);
        }

        if (parsedData.businessData) {
          setBusinessData(parsedData.businessData);
        }

        if (parsedData.socialLinks) {
          setSocialLinks(parsedData.socialLinks);
        }

        localStorage.setItem("createCardFormDataRestored", "true");
        localStorage.removeItem("createCardFormData");

        Swal.fire({
          icon: "success",
          title: "Welcome Back!",
          text: "Your form data has been restored. Continue where you left off!",
          confirmButtonColor: "#060640",
          timer: 3000,
        });
      } catch (error) {
        console.error("Error restoring form data:", error);
        localStorage.removeItem("createCardFormData");
      }
    }
  }, []);

  // 🆕 Handle CV parsed with AI custom profile design
  const handleCVParsed = (cvData) => {
    console.log("📄 [CreateCard] CV data received:", cvData);
    console.log("🔍 [CreateCard] Has customDesign?", !!cvData.customDesign);
    console.log(
      "🔍 [CreateCard] Has isAICustomProfile?",
      !!cvData.isAICustomProfile,
    );

    // ✅ Check for AI custom profile
    if (cvData.customDesign && cvData.isAICustomProfile) {
      console.log("✅ [CreateCard] AI Profile Detected!");

      // AI-generated custom profile page
      setAiGeneratedProfile(cvData);
      setProfileCreationMode("ai-profile");

      // Also update form data for card info
      const cardData = {
        name: cvData.name || "",
        title: cvData.title || "",
        bio: cvData.bio || "",
        color: cvData.customDesign?.colorPalette?.primary || "#2563eb",
        image: cvData.aiGeneratedImage || null,
      };

      if (profileType === "personal") {
        setPersonalData((prev) => ({ ...prev, ...cardData }));
      } else {
        setBusinessData((prev) => ({ ...prev, ...cardData }));
      }

      // Map social links
      if (cvData.suggestedSocialLinks) {
        const newSocialLinks = { ...socialLinks };
        if (cvData.suggestedSocialLinks.linkedin) {
          newSocialLinks.linkedin = cvData.suggestedSocialLinks.linkedin;
        }
        if (cvData.suggestedSocialLinks.github) {
          newSocialLinks.github = cvData.suggestedSocialLinks.github;
        }
        if (cvData.suggestedSocialLinks.twitter) {
          newSocialLinks.twitter = cvData.suggestedSocialLinks.twitter;
        }
        if (cvData.suggestedSocialLinks.website) {
          newSocialLinks.website = cvData.suggestedSocialLinks.website;
        }
        if (cvData.email) {
          newSocialLinks.email = cvData.email;
        }
        if (cvData.phone) {
          newSocialLinks.phone = cvData.phone;
        }
        setSocialLinks(newSocialLinks);
      }

      // 🆕 AUTO-SHOW PREVIEW
      setShowProfilePreview(true);

      Swal.fire({
        icon: "success",
        title: "✨ AI Profile Generated!",
        html: `
        <div class="text-left space-y-2">
          <p><strong>Custom Profile Design:</strong> ${cvData.customDesign?.designConcept?.name}</p>
          <p class="text-sm text-gray-600">${cvData.customDesign?.designConcept?.description}</p>
          <p class="mt-4 text-sm">Next steps:</p>
          <ul class="text-sm text-gray-700 list-disc list-inside">
            <li>Choose your NFC card template below</li>
            <li>Preview your custom profile page</li>
            <li>Add/edit social media links</li>
            <li>Create your profile!</li>
          </ul>
        </div>
      `,
        confirmButtonColor: "#060640",
        confirmButtonText: "Got it!",
      });
    } else {
      console.log("ℹ️ [CreateCard] Simple auto-fill mode");

      // Simple CV parsing (old way) - just auto-fill form
      const mappedData = {
        name: cvData.name || "",
        title: cvData.title || "",
        bio: cvData.bio || "",
        color: cvData.color || "#2563eb",
        designMode: "manual",
        image: cvData.aiGeneratedImage || null,
      };

      if (profileType === "personal") {
        setPersonalData((prev) => ({ ...prev, ...mappedData }));
      } else {
        setBusinessData((prev) => ({ ...prev, ...mappedData }));
      }

      if (cvData.suggestedSocialLinks) {
        const newSocialLinks = { ...socialLinks };
        if (cvData.suggestedSocialLinks.linkedin) {
          newSocialLinks.linkedin = cvData.suggestedSocialLinks.linkedin;
        }
        if (cvData.suggestedSocialLinks.github) {
          newSocialLinks.github = cvData.suggestedSocialLinks.github;
        }
        if (cvData.suggestedSocialLinks.twitter) {
          newSocialLinks.twitter = cvData.suggestedSocialLinks.twitter;
        }
        if (cvData.suggestedSocialLinks.website) {
          newSocialLinks.website = cvData.suggestedSocialLinks.website;
        }
        if (cvData.email) {
          newSocialLinks.email = cvData.email;
        }
        if (cvData.phone) {
          newSocialLinks.phone = cvData.phone;
        }
        setSocialLinks(newSocialLinks);
      }

      Swal.fire({
        icon: "success",
        title: "Form Auto-Filled!",
        html: `
        <p>Your form has been filled from your CV.</p>
        <p class="text-sm text-gray-600 mt-2">Choose a card template and create your profile!</p>
      `,
        confirmButtonColor: "#060640",
        confirmButtonText: "Got it!",
      });
    }
  };

  // 🆕 Regenerate AI profile design
  const handleRegenerateProfile = async () => {
    if (!aiGeneratedProfile) return;

    Swal.fire({
      title: "Regenerating Profile Design...",
      text: "Creating a new unique profile page layout",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const token = localStorage.getItem("token");
      const API_URL = import.meta.env.VITE_API_URL;

      const response = await fetch(`${API_URL}/api/ai/regenerate-design`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          profileData: aiGeneratedProfile,
          cvText: "regenerate",
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAiGeneratedProfile({
          ...aiGeneratedProfile,
          customDesign: data.data.customDesign,
        });

        Swal.fire({
          icon: "success",
          title: "New Profile Design!",
          text: `Design: ${data.data.customDesign.designConcept?.name}`,
          confirmButtonColor: "#060640",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Regeneration Failed",
        text: "Please try again",
        confirmButtonColor: "#060640",
      });
    }
  };

  const updatePersonalData = (updates) => {
    setPersonalData((prev) => ({ ...prev, ...updates }));
  };

  const updateBusinessData = (updates) => {
    setBusinessData((prev) => ({ ...prev, ...updates }));
  };

  const updateSocialLinks = (platform, value) => {
    setSocialLinks((prev) => ({ ...prev, [platform]: value }));
  };

  const getCurrentProfile = () => {
    const data = profileType === "personal" ? personalData : businessData;
    return {
      name: data.name,
      title: data.title,
      bio: data.bio,
      color: data.color,
      image: data.image,
      imageFile: data.imageFile,
      designMode: data.designMode,
      aiPrompt: data.aiPrompt,
      aiBackground: data.aiBackground,
      aiGeneratedLogo: data.aiGeneratedLogo,
      customDesignUrl: data.customDesignUrl,
      customDesignFile: data.customDesignFile,
    };
  };

  const saveFormDataToLocalStorage = () => {
    const formDataToSave = {
      profileType,
      selectedTemplate,
      personalData,
      businessData,
      socialLinks,
    };
    localStorage.setItem("createCardFormData", JSON.stringify(formDataToSave));
  };

  const handleCreateProfile = async (e) => {
    const token = localStorage.getItem("token");

    if (!token) {
      saveFormDataToLocalStorage();

      Swal.fire({
        icon: "info",
        title: "Login Required",
        text: "Please login to create your profile. Your data will be saved!",
        confirmButtonColor: "#060640",
        confirmButtonText: "Go to Login",
        showCancelButton: true,
        cancelButtonText: "Sign Up Instead",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login", { state: { returnTo: "/create-card" } });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          navigate("/signup", { state: { returnTo: "/create-card" } });
        }
      });
      return;
    }

    const currentData =
      profileType === "personal" ? personalData : businessData;

    if (!currentData.name?.trim()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Name is required",
        confirmButtonColor: "#060640",
      });
      return;
    }

    setLoading(true);

    try {
      // Build profile data
      const profileData = {
        ...getCurrentProfile(),
        profileType,
        socialLinks,
        template: selectedTemplate,
        productId: product?.id,
      };

      // 🆕 Add AI profile design if in AI mode
      if (profileCreationMode === "ai-profile" && aiGeneratedProfile) {
        profileData.customProfileDesign = aiGeneratedProfile.customDesign;
        profileData.skills = aiGeneratedProfile.skills;
        profileData.experience = aiGeneratedProfile.experience;
        profileData.education = aiGeneratedProfile.education;
        profileData.designMode = "manual";
      }

      const res = await createProfile(profileData, token);

      const data = await res.json();

      if (!res.ok) {
        let errorMessage = "Error creating profile. Please try again.";

        if (data.error) {
          errorMessage = data.error.replace(/^Validation error:\s*/i, "");
        } else if (data.message) {
          errorMessage = data.message;
        }

        if (data.errors && Array.isArray(data.errors)) {
          errorMessage = data.errors
            .map((err) => err.replace(/^Validation error:\s*/i, ""))
            .join(", ");
        }

        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMessage,
          confirmButtonColor: "#060640",
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Profile Created!",
        html: `${
          profileType === "personal" ? "Personal" : "Business"
        } profile created successfully! ${
          profileCreationMode === "ai-profile"
            ? "<br><strong>✨ With custom AI-designed profile page!</strong>"
            : ""
        } <br>Your link: <a href="/u/${
          data.data.slug
        }" class="text-blue-600 underline">View Profile</a>`,
        confirmButtonColor: "#060640",
      }).then(() => {
        navigate("/dashboard");
      });
    } catch (err) {
      console.error("Error creating profile:", err);
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: "An unexpected error occurred. Please try again.",
        confirmButtonColor: "#060640",
      });
    } finally {
      setLoading(false);
    }
  };

  const currentProfile = getCurrentProfile();

  return (
    <div className="min-h-screen bg-brand-light">
      <CreateCardHero />

      {/* 🆕 AI Profile Mode Indicator */}
      {profileCreationMode === "ai-profile" && aiGeneratedProfile && (
        <section className="section-shell pb-4">
          <div
            className="max-w-4xl mx-auto bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl p-6 shadow-xl"
            data-aos="fade-up"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkle className="w-6 h-6" />
                  <h3 className="text-xl font-bold">
                    AI Custom Profile Active
                  </h3>
                </div>
                <p className="text-sm opacity-90">
                  Design: {aiGeneratedProfile.customDesign?.designConcept?.name}
                </p>
                <p className="text-xs opacity-75">
                  Your profile page will have a unique custom design. Choose
                  your card template below.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowProfilePreview(!showProfilePreview)}
                  className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  {showProfilePreview ? "Hide" : "Preview"} Profile
                </button>
                <button
                  onClick={handleRegenerateProfile}
                  className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Regenerate
                </button>
                <button
                  onClick={() => {
                    setProfileCreationMode("manual");
                    setAiGeneratedProfile(null);
                  }}
                  className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all flex items-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Switch to Manual
                </button>
              </div>
            </div>
          </div>

          {/* Profile Preview Modal */}
          {showProfilePreview && aiGeneratedProfile && (
            <div
              className="max-w-4xl mx-auto mt-6 bg-white rounded-2xl shadow-2xl overflow-hidden"
              data-aos="fade-up"
            >
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6">
                <h3 className="text-xl font-bold">
                  Your Custom Profile Page Preview
                </h3>
                <p className="text-sm opacity-90">
                  This is what people will see when they tap your card
                </p>
              </div>
              <div className="max-h-[600px] overflow-y-auto bg-gray-50">
                {aiGeneratedProfile.customDesign ? (
                  <div className="p-4">
                    <CustomProfileRenderer
                      profile={{
                        name: aiGeneratedProfile.name || "Your Name",
                        title: aiGeneratedProfile.title || "Your Title",
                        bio: aiGeneratedProfile.bio || "Your bio",
                        avatarUrl: aiGeneratedProfile.aiGeneratedImage || null,
                        profileType: "personal",
                        customProfileDesign: aiGeneratedProfile.customDesign,
                        skills: aiGeneratedProfile.skills || [],
                        experience: aiGeneratedProfile.experience || [],
                        education: aiGeneratedProfile.education || [],
                        socialLinks: Object.entries(socialLinks)
                          .filter(([_, value]) => value && value.trim())
                          .map(([platform, url], index) => ({
                            id: index + 1,
                            platform,
                            url,
                            isVisible: true,
                          })),
                      }}
                      phoneLink={
                        socialLinks.phone
                          ? {
                              id: 1,
                              platform: "phone",
                              url: socialLinks.phone,
                              isVisible: true,
                            }
                          : null
                      }
                      emailLink={
                        socialLinks.email
                          ? {
                              id: 2,
                              platform: "email",
                              url: socialLinks.email,
                              isVisible: true,
                            }
                          : null
                      }
                      whatsappLink={
                        socialLinks.whatsapp
                          ? {
                              id: 3,
                              platform: "whatsapp",
                              url: socialLinks.whatsapp,
                              isVisible: true,
                            }
                          : null
                      }
                      handleCall={(id, phone) => console.log("Call:", phone)}
                      handleEmail={(id, email) => console.log("Email:", email)}
                      handleWhatsApp={(id, number) =>
                        console.log("WhatsApp:", number)
                      }
                      handleDownloadVCard={() => console.log("Download vCard")}
                      handleSocialClick={(id, url) =>
                        console.log("Social:", url)
                      }
                      setShowShareModal={() => {}}
                    />
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <p className="text-red-600 font-bold">
                      ERROR: No custom design found!
                    </p>
                    <pre className="text-xs text-left bg-gray-100 p-4 mt-4 overflow-auto">
                      {JSON.stringify(aiGeneratedProfile, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      )}

      {/* 🆕 CV Upload Section */}
      <section className="section-shell pb-4">
        <div className="flex justify-center gap-4" data-aos="fade-up">
          <button
            onClick={() => setShowCVModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <Upload className="w-5 h-5" />
            <span>Upload CV</span>
            <Sparkle className="w-4 h-4" />
          </button>
        </div>
        <p
          className="text-center text-gray-600 text-sm mt-3"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          {profileCreationMode === "ai-profile"
            ? "✨ Upload a new CV to regenerate your profile"
            : "Upload your CV to auto-fill the form or generate a custom profile page"}
        </p>
      </section>

      {/* Original Form Section */}
      <section className="section-shell pb-20">
        <ProfileTypeSwitch
          profileType={profileType}
          onSwitch={setProfileType}
        />

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          <ProfileForm
            profileType={profileType}
            currentProfile={currentProfile}
            updateProfile={
              profileType === "personal"
                ? updatePersonalData
                : updateBusinessData
            }
            socialLinks={socialLinks}
            onSocialLinksChange={updateSocialLinks}
            selectedTemplate={selectedTemplate}
            onTemplateChange={setSelectedTemplate}
            templates={TEMPLATES_ARRAY}
            onSubmit={handleCreateProfile}
            onSwitchProfile={() =>
              setProfileType((prev) =>
                prev === "personal" ? "business" : "personal",
              )
            }
            loading={loading}
            isAccessory={isAccessory}
          />

          {!isAccessory && (
            <LiveCardPreview
              profileType={profileType}
              currentProfile={currentProfile}
              selectedTemplate={selectedTemplate}
              templates={TEMPLATES_ARRAY}
            />
          )}
        </div>
      </section>

      {/* CV Upload Modal */}
      <CVUploadModal
        isOpen={showCVModal}
        onClose={() => setShowCVModal(false)}
        onCVParsed={handleCVParsed}
      />
    </div>
  );
}
