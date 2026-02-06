"use client";

import { useState, Children, useRef } from "react";

interface AutoScrollCarouselProps {
  children: React.ReactNode;
  duration?: number;
}

export function AutoScrollCarousel({ children, duration = 40 }: AutoScrollCarouselProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const childArray = Children.toArray(children);
  const duplicatedChildren = [
    ...childArray, ...childArray, ...childArray, ...childArray,
    ...childArray, ...childArray, ...childArray, ...childArray,
    ...childArray, ...childArray, ...childArray, ...childArray
  ];

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsPaused(true);
    setStartX(e.pageX - (containerRef.current?.offsetLeft || 0));
    setScrollLeft(containerRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (containerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (containerRef.current) {
      containerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setTimeout(() => setIsPaused(false), 1000);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    setStartX(e.touches[0].pageX - (containerRef.current?.offsetLeft || 0));
    setScrollLeft(containerRef.current?.scrollLeft || 0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const x = e.touches[0].pageX - (containerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (containerRef.current) {
      containerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleTouchEnd = () => {
    setTimeout(() => setIsPaused(false), 1000);
  };

  return (
    <>
      <style>
        {`
          @keyframes carousel-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .carousel-container {
            overflow-x: auto;
            scrollbar-width: none;
            -ms-overflow-style: none;
            cursor: grab;
          }
          .carousel-container::-webkit-scrollbar {
            display: none;
          }
          .carousel-container:active {
            cursor: grabbing;
          }
          .carousel-track {
            display: flex;
            gap: 1.5rem;
            width: max-content;
            animation: carousel-scroll ${duration}s linear infinite;
          }
          .carousel-track.paused {
            animation-play-state: paused;
          }
        `}
      </style>
      <div 
        ref={containerRef}
        className="carousel-container"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className={`carousel-track ${isPaused ? 'paused' : ''}`}>
          {duplicatedChildren.map((child, index) => (
            <div key={index} className="flex-shrink-0">
              {child}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
