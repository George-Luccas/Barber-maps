"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { createPortal } from "react-dom";
import Link from "next/link";

interface Story {
  id: string;
  url: string;
  type: "image" | "video";
  duration: number;
}

interface BarbershopStoryData {
    id: string;
    name: string;
    avatarUrl: string;
    stories: Story[];
    city?: string;
}

interface StoryViewerProps {
    storiesData: BarbershopStoryData[];
    initialStoryIndex: number;
    onClose: () => void;
}

const StoryViewer = ({ storiesData, initialStoryIndex, onClose }: StoryViewerProps) => {
    const [currentBarbershopIndex, setCurrentBarbershopIndex] = useState(initialStoryIndex);
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    
    const currentBarbershop = storiesData[currentBarbershopIndex];
    if (!currentBarbershop) return null; // Safety check
    
    const currentStory = currentBarbershop.stories[currentStoryIndex];
    const STORY_DURATION = 5000; // 5 seconds per story

    const handleNext = useCallback(() => {
        if (currentStoryIndex < currentBarbershop.stories.length - 1) {
            // Next photo in same barbershop
            setCurrentStoryIndex(prev => prev + 1);
            setProgress(0);
        } else if (currentBarbershopIndex < storiesData.length - 1) {
            // Next barbershop
            setCurrentBarbershopIndex(prev => prev + 1);
            setCurrentStoryIndex(0);
            setProgress(0);
        } else {
            // End of all stories
            onClose();
        }
    }, [currentStoryIndex, currentBarbershop.stories.length, currentBarbershopIndex, storiesData.length, onClose]);

    const handlePrevious = useCallback(() => {
         if (currentStoryIndex > 0) {
            // Previous photo in same barbershop
            setCurrentStoryIndex(prev => prev - 1);
            setProgress(0);
         } else if (currentBarbershopIndex > 0) {
             // Previous barbershop (go to last story of previous barbershop)
             const prevIndex = currentBarbershopIndex - 1;
             setCurrentBarbershopIndex(prevIndex);
             setCurrentStoryIndex(storiesData[prevIndex].stories.length - 1);
             setProgress(0);
         }
    }, [currentStoryIndex, currentBarbershopIndex, storiesData]);

    // Auto-advance
    useEffect(() => {
        const startTime = Date.now();
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const newProgress = (elapsed / STORY_DURATION) * 100;
            
            if (newProgress >= 100) {
                handleNext();
            } else {
                setProgress(newProgress);
            }
        }, 50);

        return () => clearInterval(interval);
    }, [currentStoryIndex, currentBarbershopIndex, handleNext]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight") handleNext();
            if (e.key === "ArrowLeft") handlePrevious();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose, handleNext, handlePrevious]);

    // Use Portal to render at body level
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black">
             {/* Progress Bars */}
             <div className="absolute top-4 left-0 right-0 z-20 flex gap-1 px-2">
                 {currentBarbershop.stories.map((_, index) => (
                     <div key={index} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                         <div 
                            className="h-full bg-white transition-all duration-75 ease-linear"
                            style={{ 
                                width: index < currentStoryIndex ? "100%" : 
                                       index === currentStoryIndex ? `${progress}%` : "0%" 
                            }}
                         />
                     </div>
                 ))}
             </div>

             {/* Header */}
             <div className="absolute top-8 left-0 right-0 z-20 flex items-center justify-between px-4 py-2">
                 <div className="flex items-center gap-2">
                     <Avatar className="w-8 h-8 border border-white">
                         <AvatarImage src={currentBarbershop.avatarUrl} />
                         <AvatarFallback>{currentBarbershop.name[0]}</AvatarFallback>
                     </Avatar>
                     <div className="text-white drop-shadow-md">
                         <p className="text-sm font-bold">{currentBarbershop.name}</p>
                         {currentBarbershop.city && <p className="text-[10px] opacity-80">{currentBarbershop.city}</p>}
                     </div>
                 </div>
                 
                 <div className="flex items-center gap-4">
                     <Link href={`/barbershops/${currentBarbershop.id}`} className="text-xs font-bold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full text-white backdrop-blur-md transition-colors">
                         Ver Perfil
                     </Link>
                     <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20 rounded-full w-8 h-8">
                         <X className="w-6 h-6" />
                     </Button>
                 </div>
             </div>

             {/* Main Content (Image) */}
             <div className="relative w-full h-full md:max-w-md md:aspect-[9/16] bg-black">
                 {/* Click Areas for Navigation */}
                 <div className="absolute inset-y-0 left-0 w-1/3 z-10" onClick={handlePrevious} />
                 <div className="absolute inset-y-0 right-0 w-1/3 z-10" onClick={handleNext} />
                 
                 <Image
                    src={currentStory?.url || "/placeholder.png"}
                    alt="Story"
                    fill
                    className="object-contain md:object-cover"
                    priority
                 />
                 
                 {/* Bottom Gradient for text readability */}
                 <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
             </div>
        </div>,
        document.body
    );
};

export default StoryViewer;
