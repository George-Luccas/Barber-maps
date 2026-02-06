"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openImage = (index: number) => setSelectedIndex(index);
  const closeImage = () => setSelectedIndex(null);

  const goNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % images.length);
    }
  };

  const goPrev = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
    }
  };

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-3 gap-2">
        {images.map((img, i) => (
          <div 
            key={i} 
            className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
            onClick={() => openImage(i)}
          >
            <Image
              src={img}
              alt={`Trabalho ${i + 1}`}
              fill
              className="object-cover transition-transform group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
                Ver foto
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={closeImage}
          >
            {/* Close Button */}
            <button 
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
              onClick={closeImage}
            >
              <X className="size-6 text-white" />
            </button>

            {/* Previous Button */}
            <button 
              className="absolute left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
            >
              <ChevronLeft className="size-8 text-white" />
            </button>

            {/* Image */}
            <motion.div
              key={selectedIndex}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative w-[90vw] h-[80vh] max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[selectedIndex]}
                alt={`Trabalho ${selectedIndex + 1}`}
                fill
                className="object-contain"
              />
            </motion.div>

            {/* Next Button */}
            <button 
              className="absolute right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); goNext(); }}
            >
              <ChevronRight className="size-8 text-white" />
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
              {selectedIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
