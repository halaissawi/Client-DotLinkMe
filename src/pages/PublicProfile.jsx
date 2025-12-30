import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import ShareModal from "../components/PublicProfile/Modals";
import NotFound from "./NotFound";
import VisitorContactModal from "../components/PublicProfile/VisitorContactModal";
import { Loader2 } from "lucide-react";
import TemplateRenderer from "../components/PublicProfile/TemplateRenderer";

export default function PublicProfile() {
  const { slug } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showVisitorModal, setShowVisitorModal] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    let timeoutId;
    let isMounted = true;

    const trackView = async () => {
      try {
        await fetch(`${API_URL}/api/analytics/track-view/${slug}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ source: "link" }),
        });
      } catch (err) {
        console.error("Error tracking view:", err);
      }
    };

    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/api/profiles/public/${slug}`);

        if (!response.ok) {
          throw new Error("Profile not found");
        }

        const data = await response.json();

        if (isMounted) {
          setProfile(data.data);
          await trackView();

          timeoutId = setTimeout(() => {
            if (isMounted) {
              setShowVisitorModal(true);
            }
          }, 2000);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [slug, API_URL]);

  const handleSocialClick = async (linkId, url) => {
    try {
      await fetch(`${API_URL}/api/social-links/${linkId}/click`, {
        method: "POST",
      });
    } catch (err) {
      console.error("Error tracking click:", err);
    }
    window.open(url, "_blank");
  };

  const handleShare = async (method) => {
    const shareUrl = window.location.href;
    const shareText = `Check out ${profile.name}'s profile`;

    if (method === "native" && navigator.share) {
      try {
        await navigator.share({
          title: profile.name,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else if (method === "copy") {
      navigator.clipboard.writeText(shareUrl);
      Swal.fire({
        icon: "success",
        title: "Link copied to clipboard!",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
      });
    } else if (method === "whatsapp") {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`
      );
    } else if (method === "twitter") {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          shareText
        )}&url=${encodeURIComponent(shareUrl)}`
      );
    } else if (method === "facebook") {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareUrl
        )}`
      );
    } else if (method === "linkedin") {
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          shareUrl
        )}`
      );
    }

    setShowShareModal(false);
  };

  const handleDownloadVCard = () => {
    const phoneLink = profile.socialLinks?.find((l) => l.platform === "phone");
    const emailLink = profile.socialLinks?.find((l) => l.platform === "email");
    const websiteLink = profile.socialLinks?.find(
      (l) => l.platform === "website"
    );

    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${profile.name}
${profile.title ? `TITLE:${profile.title}` : ""}
${emailLink ? `EMAIL:${emailLink.url}` : ""}
${phoneLink ? `TEL:${phoneLink.url}` : ""}
${websiteLink ? `URL:${websiteLink.url}` : ""}
${profile.bio ? `NOTE:${profile.bio}` : ""}
END:VCARD`;

    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${profile.name}.vcf`;
    link.click();
  };

  const handleCall = async (linkId, phone) => {
    try {
      await fetch(`${API_URL}/api/social-links/${linkId}/click`, {
        method: "POST",
      });
    } catch (err) {
      console.error("Error tracking click:", err);
    }
    window.location.href = `tel:${phone}`;
  };

  const handleEmail = async (linkId, email) => {
    try {
      await fetch(`${API_URL}/api/social-links/${linkId}/click`, {
        method: "POST",
      });
    } catch (err) {
      console.error("Error tracking click:", err);
    }
    window.location.href = `mailto:${email}`;
  };

  const handleWhatsApp = async (linkId, number) => {
    try {
      await fetch(`${API_URL}/api/social-links/${linkId}/click`, {
        method: "POST",
      });
    } catch (err) {
      console.error("Error tracking click:", err);
    }
    const cleanNumber = number.replace(/\D/g, "");
    window.open(`https://wa.me/${cleanNumber}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-700 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return <NotFound />;
  }

  const phoneLink = profile.socialLinks?.find((l) => l.platform === "phone");
  const emailLink = profile.socialLinks?.find((l) => l.platform === "email");
  const whatsappLink = profile.socialLinks?.find(
    (l) => l.platform === "whatsapp"
  );

  return (
    <>
      {/* Template Renderer - Works for both mobile and desktop */}
      <TemplateRenderer
        templateId={profile.pageTemplate || "modern"} // ✅ Use PAGE template
        themeColor={profile.pageColor || "#0EA5E9"} // ✅ Use PAGE color
        profile={profile}
        phoneLink={phoneLink}
        emailLink={emailLink}
        whatsappLink={whatsappLink}
        handleCall={handleCall}
        handleEmail={handleEmail}
        handleWhatsApp={handleWhatsApp}
        handleDownloadVCard={handleDownloadVCard}
        handleSocialClick={handleSocialClick}
        setShowShareModal={setShowShareModal}
      />

      {/* Modals */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        onShare={handleShare}
        themeColor={profile.pageColor || profile.color || "#3B82F6"}
      />

      <VisitorContactModal
        isOpen={showVisitorModal}
        onClose={() => setShowVisitorModal(false)}
        profileSlug={profile?.slug}
        source="link"
        themeColor={profile.pageColor || profile.color || "#3B82F6"}
      />
    </>
  );
}
