const fs = require('fs');
const path = require('path');

// SVG content for the F logo favicon
const faviconSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <defs>
    <linearGradient id="fGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#3b82f6" />
      <stop offset="100%" stopColor="#6366f1" />
    </linearGradient>
    
    <filter id="softGlow">
      <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Clean rounded square frame -->
  <rect 
    x="15" y="15" 
    width="70" height="70" 
    rx="12" 
    fill="none" 
    stroke="url(#fGrad)" 
    strokeWidth="2"
    opacity="0.3"
  />

  <!-- Modern F design -->
  <g fill="url(#fGrad)" filter="url(#softGlow)">
    <!-- Main vertical stroke -->
    <rect x="30" y="30" width="6" height="40" rx="3" />
    
    <!-- Top horizontal stroke -->
    <rect x="30" y="30" width="25" height="6" rx="3" />
    
    <!-- Middle horizontal stroke -->
    <rect x="30" y="47" width="20" height="6" rx="3" />
    
    <!-- Modern accent dots -->
    <circle cx="58" cy="33" r="2" opacity="0.8" />
    <circle cx="53" cy="50" r="2" opacity="0.8" />
    <circle cx="42" cy="65" r="1.5" opacity="0.6" />
  </g>
</svg>`;

// Create the public directory if it doesn't exist
const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write the SVG favicon
fs.writeFileSync(path.join(publicDir, 'favicon.svg'), faviconSVG);

console.log('✅ Generated favicon.svg');
console.log('📝 To complete the favicon setup:');
console.log('');
console.log('🔗 Quick Setup Options:');
console.log('1. Use RealFaviconGenerator: https://realfavicongenerator.net/');
console.log('   - Upload the favicon.svg file');
console.log('   - Download the generated package');
console.log('   - Replace files in public/ directory');
console.log('');
console.log('2. Use Convertio: https://convertio.co/svg-ico/');
console.log('   - Convert favicon.svg to favicon.ico');
console.log('   - Place in public/ directory');
console.log('');
console.log('3. Use the FaviconGenerator component:');
console.log('   - Add <FaviconGenerator /> to any page');
console.log('   - Click "Download All Favicon Sizes"');
console.log('   - Place downloaded files in public/ directory');
console.log('');
console.log('Current setup uses SVG favicon which works in all modern browsers!');
