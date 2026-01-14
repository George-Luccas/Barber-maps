"use client";

import { useState } from "react";
import Image from "next/image";
import { Barbershop, Style } from "@prisma/client";
import StoryViewer from "./story-viewer";

// Extended Barbershop type to include Style
interface BarbershopWithStyles extends Barbershop {
  Style: Style[];
}

interface StoryListProps {
  barbershops: BarbershopWithStyles[];
}

const StoryList = ({ barbershops }: StoryListProps) => {
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);

  // Map database data to StoryViewer format
  const storiesData = barbershops.map((barbershop) => {
    // If has styles, use them. Otherwise, use cover image as a single story.
    const hasStyles = barbershop.Style && barbershop.Style.length > 0;
    
    let stories = [];
    
    if (hasStyles) {
        stories = barbershop.Style.map(style => ({
            id: style.id,
            url: style.imageUrl,
            type: "image" as const,
            duration: 5000
        }));
    } else {
        stories = [{
            id: barbershop.id + "-cover",
            url: barbershop.imageUrl || "/placeholder.png",
            type: "image" as const,
            duration: 5000
        }];
    }

    return {
        id: barbershop.id,
        name: barbershop.name,
        avatarUrl: barbershop.imageUrl || "/placeholder.png",
        city: barbershop.city || "",
        stories: stories
    };
  });

  return (
    <>
      <div className="w-full">
        <div className="flex gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden pt-2">
          {barbershops.map((barbershop, index) => (
            <div 
              key={barbershop.id} 
              className="flex-shrink-0 group cursor-pointer"
              onClick={() => setSelectedStoryIndex(index)}
            >
              <div className="relative w-[88px] h-[130px] rounded-xl overflow-hidden border-2 border-neon-purple/50 group-hover:border-neon-purple transition-all group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                 {/* Image */}
                 <Image
                    src={barbershop.imageUrl || "/placeholder.png"}
                    alt={barbershop.name}
                    fill
                    className="object-cover"
                 />
                 
                 {/* Gradient Overlay */}
                 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                 {/* Content */}
                 <div className="absolute bottom-1 left-1 right-1">
                    <p className="text-[10px] font-bold text-white line-clamp-2 leading-tight text-center">
                      {barbershop.name}
                    </p>
                 </div>
                 
                 {/* Live/Story indicator */}
                 {/* Show indicator only if there are NEW stories/styles? For now, always show if they have stories */}
                  <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-green-500 animate-pulse border border-white/20" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedStoryIndex !== null && (
          <StoryViewer 
            storiesData={storiesData}
            initialStoryIndex={selectedStoryIndex}
            onClose={() => setSelectedStoryIndex(null)}
          />
      )}
    </>
  );
};

export default StoryList;
