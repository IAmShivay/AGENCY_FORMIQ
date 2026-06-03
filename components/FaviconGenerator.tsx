'use client';

import React, { useRef, useEffect } from 'react';

const FaviconGenerator: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateFavicon = (size: number): string | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Set canvas size
    canvas.width = size;
    canvas.height = size;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Scale factor
    const scale = size / 100;

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#3b82f6');
    gradient.addColorStop(1, '#6366f1');

    // Draw rounded square frame
    const frameSize = 70 * scale;
    const frameX = 15 * scale;
    const frameY = 15 * scale;
    const frameRadius = 12 * scale;

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2 * scale;
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.roundRect(frameX, frameY, frameSize, frameSize, frameRadius);
    ctx.stroke();

    // Reset alpha
    ctx.globalAlpha = 1;
    ctx.fillStyle = gradient;

    // Draw F letter
    // Main vertical stroke
    ctx.beginPath();
    ctx.roundRect(30 * scale, 30 * scale, 6 * scale, 40 * scale, 3 * scale);
    ctx.fill();

    // Top horizontal stroke
    ctx.beginPath();
    ctx.roundRect(30 * scale, 30 * scale, 25 * scale, 6 * scale, 3 * scale);
    ctx.fill();

    // Middle horizontal stroke
    ctx.beginPath();
    ctx.roundRect(30 * scale, 47 * scale, 20 * scale, 6 * scale, 3 * scale);
    ctx.fill();

    // Accent dots
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.arc(58 * scale, 33 * scale, 2 * scale, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(53 * scale, 50 * scale, 2 * scale, 0, 2 * Math.PI);
    ctx.fill();

    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.arc(42 * scale, 65 * scale, 1.5 * scale, 0, 2 * Math.PI);
    ctx.fill();

    return canvas.toDataURL('image/png');
  };

  const downloadFavicon = (size: number, filename: string) => {
    const dataUrl = generateFavicon(size);
    if (!dataUrl) return;

    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  };

  const generateAllSizes = () => {
    // Generate all required sizes
    downloadFavicon(16, 'favicon-16x16.png');
    setTimeout(() => downloadFavicon(32, 'favicon-32x32.png'), 100);
    setTimeout(() => downloadFavicon(48, 'favicon-48x48.png'), 200);
    setTimeout(() => downloadFavicon(180, 'apple-touch-icon.png'), 300);
    setTimeout(() => downloadFavicon(192, 'icon-192x192.png'), 400);
    setTimeout(() => downloadFavicon(512, 'icon-512x512.png'), 500);
  };

  useEffect(() => {
    // Generate a preview
    generateFavicon(64);
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Favicon Generator</h2>
      <canvas
        ref={canvasRef}
        className="border border-gray-300 rounded mb-4"
        style={{ width: '64px', height: '64px' }}
      />
      <button
        onClick={generateAllSizes}
        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded"
      >
        Download All Favicon Sizes
      </button>
      <p className="text-sm text-gray-600 mt-2">
        This will download all required favicon sizes. Place them in your public folder.
      </p>
    </div>
  );
};

export default FaviconGenerator;
