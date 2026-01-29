"use client"

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import Image from "next/image"
import { useState, useRef } from "react"
import { ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface GalleryPhoto {
    url: string
    alt: string
}

interface BarbershopGalleryProps {
    photos: GalleryPhoto[]
}

export function BarbershopGallery({ photos }: BarbershopGalleryProps) {
    const [open, setOpen] = useState(false)
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

    // Touch swipe handling
    const touchStartX = useRef(0)
    const touchEndX = useRef(0)

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.targetTouches[0].clientX
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.targetTouches[0].clientX
    }

    const handleTouchEnd = () => {
        if (touchStartX.current - touchEndX.current > 50) {
            handleNext()
        }
        if (touchStartX.current - touchEndX.current < -50) {
            handlePrev()
        }
    }

    const handleOpen = (index: number) => {
        setCurrentPhotoIndex(index)
        setOpen(true)
    }

    const handleNext = () => {
        setCurrentPhotoIndex((prev) => (prev + 1) % photos.length)
    }

    const handlePrev = () => {
        setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length)
    }

    if (!photos.length) return null

    return (
        <div className="flex gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden">
            {photos.map((photo, index) => (
                <div 
                    key={index} 
                    className="relative h-[150px] w-[150px] shrink-0 overflow-hidden rounded-xl cursor-pointer hover:opacity-90 transition-opacity group"
                    onClick={() => handleOpen(index)}
                >
                    <Image
                        src={photo.url}
                        alt={photo.alt}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Maximize2 className="text-white size-6 drop-shadow-md" />
                    </div>
                </div>
            ))}

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-[95vw] md:max-w-5xl p-0 bg-transparent border-none shadow-none flex items-center justify-center outline-none">
                     {/* Frame Container */}
                     <div className="relative w-full bg-card border border-neon-purple/50 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(139,92,246,0.25)] flex flex-col animate-in fade-in zoom-in-95 duration-300">
                        {/* Frame Header */}
                        <div className="bg-background/95 backdrop-blur py-3 px-4 border-b border-neon-purple/30 flex justify-between items-center z-20 relative">
                             <div className="flex items-center gap-3">
                                <div className="size-6 rounded-full bg-neon-purple flex items-center justify-center">
                                    <span className="text-[10px] font-bold text-white">BM</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-neon-purple font-bold text-sm tracking-wider font-serif leading-none">BARBER MAPS</span>
                                    <span className="text-muted-foreground text-[10px] uppercase tracking-[0.2em] leading-none">Galeria Oficial</span>
                                </div>
                             </div>
                             <button 
                                onClick={() => setOpen(false)} 
                                className="size-8 rounded-full bg-muted/50 hover:bg-destructive/20 hover:text-destructive flex items-center justify-center transition-colors"
                             >
                                <X className="size-4" />
                             </button>
                        </div>
                        
                        {/* Main Image Viewport */}
                        <div 
                            className="relative aspect-[4/5] md:aspect-video w-full bg-black/95 flex items-center justify-center overflow-hidden group select-none"
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        >
                             <Image 
                                src={photos[currentPhotoIndex].url} 
                                alt={photos[currentPhotoIndex].alt}
                                fill
                                className="object-contain" // Contain to ensure full visibility without cropping in modal
                                priority
                             />
                             
                             {/* Navigation Arrows */}
                             {photos.length > 1 && (
                                <>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                                        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 text-white/70 hover:bg-neon-purple hover:text-white border border-white/10 hover:border-neon-purple transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                                    >
                                        <ChevronLeft className="size-6" />
                                    </button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleNext(); }}
                                        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 text-white/70 hover:bg-neon-purple hover:text-white border border-white/10 hover:border-neon-purple transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                                    >
                                        <ChevronRight className="size-6" />
                                    </button>
                                </>
                             )}

                             {/* Image Counter */}
                             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/60 rounded-full border border-white/10 backdrop-blur-md">
                                <span className="text-xs font-medium text-white/90">
                                    {currentPhotoIndex + 1} / {photos.length}
                                </span>
                             </div>
                        </div>
                     </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
