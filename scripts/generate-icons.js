#!/usr/bin/env node

/**
 * Icon Generator for Digital Decluttering Agent
 * Generates .icns file from icon.png for macOS app
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const assetsDir = path.join(__dirname, '..', 'assets');
const iconPng = path.join(assetsDir, 'icon.png');
const iconIcns = path.join(assetsDir, 'icon.icns');

console.log('🎨 Digital Decluttering Agent - Icon Generator');
console.log('==============================================\n');

// Check if icon.png exists
if (!fs.existsSync(iconPng)) {
    console.log('⚠️  icon.png not found in assets directory');
    console.log('Creating a default icon...\n');
    
    // Create a simple SVG icon
    const svgIcon = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#0f62fe" rx="80"/>
  <g fill="white">
    <path d="M256 128c-70.7 0-128 57.3-128 128s57.3 128 128 128 128-57.3 128-128-57.3-128-128-128zm0 224c-53 0-96-43-96-96s43-96 96-96 96 43 96 96-43 96-96 96z"/>
    <circle cx="256" cy="256" r="48"/>
    <path d="M200 200l-40-40m192 0l-40 40m-112 112l-40 40m192 0l-40-40" stroke="white" stroke-width="16" stroke-linecap="round"/>
  </g>
  <text x="256" y="440" font-family="Arial, sans-serif" font-size="80" font-weight="bold" fill="white" text-anchor="middle">🧹</text>
</svg>`;
    
    const svgPath = path.join(assetsDir, 'icon.svg');
    fs.writeFileSync(svgPath, svgIcon);
    console.log('✓ Created default SVG icon');
    
    // Try to convert SVG to PNG using available tools
    try {
        // Check if ImageMagick is available
        execSync('which convert', { stdio: 'ignore' });
        execSync(`convert "${svgPath}" -resize 512x512 "${iconPng}"`, { stdio: 'inherit' });
        console.log('✓ Converted SVG to PNG using ImageMagick\n');
    } catch (error) {
        console.log('⚠️  ImageMagick not found. Please install it or manually add icon.png');
        console.log('   brew install imagemagick\n');
        console.log('Or manually create a 512x512 PNG file at:');
        console.log(`   ${iconPng}\n`);
        return;
    }
}

// Check if we can generate .icns
try {
    // Check if png2icons is available
    const png2icons = require('png2icons');
    
    console.log('📦 Generating .icns file from icon.png...');
    
    const input = fs.readFileSync(iconPng);
    const output = png2icons.createICNS(input, png2icons.BILINEAR, 0);
    fs.writeFileSync(iconIcns, output);
    
    console.log('✓ Generated icon.icns successfully\n');
    console.log('Icon files ready:');
    console.log(`  - ${iconPng}`);
    console.log(`  - ${iconIcns}\n`);
    
} catch (error) {
    console.log('⚠️  Could not generate .icns file');
    console.log('Error:', error.message);
    console.log('\nPlease ensure png2icons is installed:');
    console.log('  npm install png2icons\n');
}

console.log('Done! 🎉');

// Made with Bob