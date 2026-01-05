// Aiutils.js - Frontend calls backend proxy (SECURE)

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Generate AI Background Image via backend proxy
 * @param {string} prompt - Description of the desired background
 * @returns {Promise<string>} Base64 image data URL
 */
export const generateAIImage = async (prompt) => {
  try {
    console.log("🎨 Starting AI generation with prompt:", prompt);

    if (!prompt || !prompt.trim()) {
      throw new Error("Please provide a description for your design");
    }

    const token = localStorage.getItem("token");

    // Call YOUR backend endpoint (not Pollinations directly)
    const response = await fetch(`${API_URL}/api/ai/generate-ai-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Your auth token
      },
      body: JSON.stringify({
        prompt: prompt,
        width: 1024,
        height: 640,
        type: "background",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to generate image");
    }

    const data = await response.json();

    if (!data.success || !data.imageUrl) {
      throw new Error("Invalid response from server");
    }

    console.log("✅ Successfully generated image");

    return data.imageUrl; // This is now a base64 data URL
  } catch (error) {
    console.error("❌ AI Image generation error:", error);
    throw new Error(
      error.message || "Failed to generate background. Please try again."
    );
  }
};

/**
 * Generate AI Logo via backend proxy
 * @param {string} prompt - Description of the desired logo
 * @returns {Promise<string>} Base64 image data URL
 */
export const generateAILogo = async (prompt) => {
  try {
    console.log("🎨 Generating AI logo with prompt:", prompt);

    if (!prompt || !prompt.trim()) {
      throw new Error("Please provide a description for your logo");
    }

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/api/ai/generate-ai-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        prompt: prompt,
        width: 512,
        height: 512,
        type: "logo",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to generate logo");
    }

    const data = await response.json();

    if (!data.success || !data.imageUrl) {
      throw new Error("Invalid response from server");
    }

    console.log("✅ Logo generated successfully");

    return data.imageUrl;
  } catch (error) {
    console.error("❌ AI Logo generation error:", error);
    throw new Error(
      error.message || "Failed to generate logo. Please try again."
    );
  }
};
