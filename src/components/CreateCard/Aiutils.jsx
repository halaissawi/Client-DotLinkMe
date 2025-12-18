// Aiutils.js - Direct Pollinations AI Integration (No Backend Needed)

/**
 * Generate AI Background Image using Pollinations AI
 * @param {string} prompt - Description of the desired background
 * @returns {Promise<string>} Base64 encoded image data URL
 */
export const generateAIImage = async (prompt) => {
  try {
    console.log("🎨 Generating AI background with prompt:", prompt);

    if (!prompt || !prompt.trim()) {
      throw new Error("Please provide a description for your design");
    }

    // Pollinations AI URL - generates image on-the-fly
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      prompt
    )}?width=1024&height=640&model=flux&nologo=true&enhance=true&seed=${Date.now()}`;

    console.log("📡 Fetching from Pollinations AI...");

    // Fetch the image
    const response = await fetch(pollinationsUrl);

    if (!response.ok) {
      throw new Error(`Failed to generate image (Status: ${response.status})`);
    }

    console.log("✅ Image received, converting to base64...");

    // Get image as blob
    const blob = await response.blob();

    // Convert blob to base64 data URL
    const base64Image = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Failed to convert image"));
      reader.readAsDataURL(blob);
    });

    console.log("✅ Background generated successfully!");
    return base64Image;
  } catch (error) {
    console.error("❌ AI Image generation error:", error);
    throw new Error(
      error.message || "Failed to generate background. Please try again."
    );
  }
};

/**
 * Generate AI Logo using Pollinations AI
 * @param {string} prompt - Description of the desired logo
 * @returns {Promise<string>} Base64 encoded image data URL
 */
export const generateAILogo = async (prompt) => {
  try {
    console.log("🎨 Generating AI logo with prompt:", prompt);

    if (!prompt || !prompt.trim()) {
      throw new Error("Please provide a description for your logo");
    }

    // Enhanced prompt for better logo results
    const logoPrompt = `professional logo design: ${prompt}, simple, clean, centered, minimalist, high quality, vector style`;

    // Pollinations AI URL - square format for logos
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      logoPrompt
    )}?width=512&height=512&model=flux&nologo=true&enhance=true&seed=${Date.now()}`;

    console.log("📡 Fetching logo from Pollinations AI...");

    const response = await fetch(pollinationsUrl);

    if (!response.ok) {
      throw new Error(`Failed to generate logo (Status: ${response.status})`);
    }

    console.log("✅ Logo received, converting to base64...");

    const blob = await response.blob();

    const base64Image = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Failed to convert logo"));
      reader.readAsDataURL(blob);
    });

    console.log("✅ Logo generated successfully!");
    return base64Image;
  } catch (error) {
    console.error("❌ AI Logo generation error:", error);
    throw new Error(
      error.message || "Failed to generate logo. Please try again."
    );
  }
};

/**
 * Optional: Generate AI Image with custom dimensions
 * @param {string} prompt - Description
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {Promise<string>} Base64 encoded image data URL
 */
export const generateCustomAIImage = async (
  prompt,
  width = 1024,
  height = 640
) => {
  try {
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      prompt
    )}?width=${width}&height=${height}&model=flux&nologo=true&enhance=true&seed=${Date.now()}`;

    const response = await fetch(pollinationsUrl);

    if (!response.ok) {
      throw new Error(`Failed to generate image (Status: ${response.status})`);
    }

    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Failed to convert image"));
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("❌ Custom AI generation error:", error);
    throw new Error(error.message || "Failed to generate image");
  }
};
