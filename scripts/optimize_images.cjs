#!/usr/bin/env node
/**
 * Image Optimization Script
 * Converts PNG to WebP for better performance
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execPromise = promisify(exec);

const imagesDir = path.join(__dirname, '..', 'public', 'images');

console.log('🖼️  NEXX Image Optimizer\n');

async function optimizeImages() {
  try {
    // Check if ImageMagick is available
    try {
      await execPromise('magick --version');
      console.log('✅ ImageMagick found\n');
    } catch (e) {
      console.log('⚠️  ImageMagick not found. Install from: https://imagemagick.org/\n');
      console.log('Alternative: Using manual optimization tips instead.\n');
      showManualTips();
      return;
    }

    // Get all PNG files
    const files = fs.readdirSync(imagesDir).filter(f => f.endsWith('.png'));
    
    if (files.length === 0) {
      console.log('No PNG files found.');
      return;
    }

    console.log(`Found ${files.length} PNG files:\n`);
    
    let optimized = 0;
    let totalSaved = 0;

    for (const file of files) {
      const pngPath = path.join(imagesDir, file);
      const webpPath = path.join(imagesDir, file.replace('.png', '.webp'));
      
      // Get original size
      const originalSize = fs.statSync(pngPath).size;
      
      try {
        // Convert to WebP
        await execPromise(`magick "${pngPath}" -quality 85 "${webpPath}"`);
        
        const webpSize = fs.statSync(webpPath).size;
        const saved = originalSize - webpSize;
        const percent = ((saved / originalSize) * 100).toFixed(1);
        
        totalSaved += saved;
        optimized++;
        
        console.log(`✅ ${file}`);
        console.log(`   PNG: ${(originalSize / 1024).toFixed(1)}KB → WebP: ${(webpSize / 1024).toFixed(1)}KB (-${percent}%)\n`);
      } catch (err) {
        console.log(`❌ Failed: ${file} - ${err.message}\n`);
      }
    }

    console.log('═══════════════════════════════════════');
    console.log(`✨ Optimized ${optimized}/${files.length} images`);
    console.log(`💾 Total saved: ${(totalSaved / 1024).toFixed(1)}KB`);
    console.log('═══════════════════════════════════════\n');
    
    console.log('💡 Next steps:');
    console.log('1. Update HTML to use WebP with PNG fallback:');
    console.log('   <picture>');
    console.log('     <source srcset="image.webp" type="image/webp">');
    console.log('     <img src="image.png" alt="...">');
    console.log('   </picture>');
    console.log('');
    console.log('2. Run build to include WebP files in dist/');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

function showManualTips() {
  console.log('📋 Manual Image Optimization Tips:\n');
  console.log('1. Use online tools:');
  console.log('   - TinyPNG: https://tinypng.com/');
  console.log('   - Squoosh: https://squoosh.app/');
  console.log('   - Compress PNG: https://compresspng.com/\n');
  
  console.log('2. Recommended settings:');
  console.log('   - WebP quality: 80-85%');
  console.log('   - PNG compression: Maximum');
  console.log('   - Remove metadata: Yes\n');
  
  console.log('3. Target sizes:');
  console.log('   - Hero images: < 200KB');
  console.log('   - Icons: < 50KB');
  console.log('   - Gallery: < 150KB each\n');
}

optimizeImages();
