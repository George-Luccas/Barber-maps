
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
    <div className={`absolute inset-0 w-full h-full overflow-hidden z-0 bg-black background-video-container ${className}`}>
      {/* Overlay to darken video for readability */}
      <div className="absolute inset-0 bg-black/40 z-10" />
      
      <video
        autoPlay
        loop
        muted={true} // React requires explicit boolean sometimes
        playsInline
        poster={poster}
        className="absolute w-full h-full object-cover"
        style={{ opacity: 1 }} // Full opacity, let overlay handle darkening
      >
        <source src={src} type="video/mp4" />
        Seu navegador não suporta vídeos HTML5.
      </video>
    </div>
  );
};
