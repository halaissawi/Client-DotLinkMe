// resize-templates.js
// Run with: node resize-templates.js

const sharp = require("sharp");
const fs = require("fs").promises;
const path = require("path");

// Configuration
const CONFIG = {
  inputDir: "./input-templates", // Put your original images here
  outputDir: "./public/templates", // Output directory
  sizes: {
    preview: { width: 400, height: 252 }, // For selector
    full: { width: 1600, height: 1008 }, // For card display
  },
  format: "webp", // Output format: 'webp', 'png', or 'jpeg'
  quality: {
    preview: 80, // Quality for preview images (1-100)
    full: 90, // Quality for full images (1-100)
  },
};

// Ensure directories exist
async function ensureDirectories() {
  const dirs = [
    CONFIG.outputDir,
    path.join(CONFIG.outputDir, "previews"),
    path.join(CONFIG.outputDir, "full"),
  ];

  for (const dir of dirs) {
    try {
      await fs.mkdir(dir, { recursive: true });
      console.log(`✅ Directory ready: ${dir}`);
    } catch (error) {
      console.error(`❌ Error creating directory ${dir}:`, error.message);
    }
  }
}

// Resize a single image
async function resizeImage(inputPath, outputPath, width, height, quality) {
  try {
    const outputFormat = CONFIG.format === "jpeg" ? "jpeg" : CONFIG.format;

    await sharp(inputPath)
      .resize(width, height, {
        fit: "cover", // Crop to fill the dimensions
        position: "center", // Center the crop
      })
      [outputFormat]({ quality })
      .toFile(outputPath);

    const stats = await fs.stat(outputPath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    console.log(`  ✅ ${path.basename(outputPath)} (${sizeKB} KB)`);
  } catch (error) {
    console.error(
      `  ❌ Error resizing ${path.basename(inputPath)}:`,
      error.message
    );
  }
}

// Process all images in input directory
async function processTemplates() {
  console.log("\n🎨 Starting template image processing...\n");

  try {
    // Read all files from input directory
    const files = await fs.readdir(CONFIG.inputDir);
    const imageFiles = files.filter((file) =>
      /\.(jpg|jpeg|png|webp)$/i.test(file)
    );

    if (imageFiles.length === 0) {
      console.log("⚠️  No images found in input directory!");
      console.log(`   Please add images to: ${CONFIG.inputDir}`);
      return;
    }

    console.log(`📂 Found ${imageFiles.length} image(s) to process\n`);

    // Process each image
    for (const file of imageFiles) {
      const inputPath = path.join(CONFIG.inputDir, file);
      const baseName = path.parse(file).name;
      const ext = `.${CONFIG.format}`;

      console.log(`🖼️  Processing: ${file}`);

      // Create preview version
      const previewPath = path.join(
        CONFIG.outputDir,
        "previews",
        `${baseName}${ext}`
      );
      await resizeImage(
        inputPath,
        previewPath,
        CONFIG.sizes.preview.width,
        CONFIG.sizes.preview.height,
        CONFIG.quality.preview
      );

      // Create full version
      const fullPath = path.join(CONFIG.outputDir, "full", `${baseName}${ext}`);
      await resizeImage(
        inputPath,
        fullPath,
        CONFIG.sizes.full.width,
        CONFIG.sizes.full.height,
        CONFIG.quality.full
      );

      console.log("");
    }

    console.log("✨ All templates processed successfully!\n");
    console.log("📁 Output locations:");
    console.log(`   Previews: ${path.join(CONFIG.outputDir, "previews")}`);
    console.log(`   Full size: ${path.join(CONFIG.outputDir, "full")}\n`);
  } catch (error) {
    console.error("❌ Error processing templates:", error.message);
  }
}

// Main execution
async function main() {
  console.log("\n╔════════════════════════════════════════╗");
  console.log("║   Template Image Resizer for LinkMe   ║");
  console.log("╚════════════════════════════════════════╝\n");

  console.log("📋 Configuration:");
  console.log(`   Input:  ${CONFIG.inputDir}`);
  console.log(`   Output: ${CONFIG.outputDir}`);
  console.log(`   Format: ${CONFIG.format.toUpperCase()}`);
  console.log(
    `   Preview size: ${CONFIG.sizes.preview.width}×${CONFIG.sizes.preview.height}px @ ${CONFIG.quality.preview}% quality`
  );
  console.log(
    `   Full size: ${CONFIG.sizes.full.width}×${CONFIG.sizes.full.height}px @ ${CONFIG.quality.full}% quality\n`
  );

  await ensureDirectories();
  await processTemplates();
}

// Check if sharp is installed
try {
  require.resolve("sharp");
  main();
} catch (e) {
  console.log('\n❌ Error: "sharp" package not found!\n');
  console.log("📦 Please install it first:");
  console.log("   npm install sharp\n");
  console.log("Then run this script again:");
  console.log("   node resize-templates.js\n");
}
