
"use client";

import { useEffect, useState } from "react";

interface BackgroundVideoProps {
  src: string;
  poster?: string;
  className?: string; // Allow custom classes (e.g., opacity)
}

export const BackgroundVideo = ({ src, poster, className }: BackgroundVideoProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null; // Prevent hydration mismatch

  return (
    <div className={`fixed inset-0 w-full h-full overflow-hidden -z-50 bg-black ${className}`}>
      {/* Overlay to darken video for readability */}
      <div className="absolute inset-0 bg-black/60 z-10" />
      
      <video
        autoPlay
        loop
        muted
        playsInline
        poster={poster}
        className="absolute w-full h-full object-cover"
        style={{ opacity: 0.6 }} // Lower opacity for background feel
      >
        <source src={src} type="video/mp4" />
        Seu navegador não suporta vídeos HTML5.
      </video>
    </div>
  );
};
