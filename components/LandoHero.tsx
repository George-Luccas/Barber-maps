"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export const LandoHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Mouse positions
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for that "heavy" feel
  const springConfig = { damping: 30, stiffness: 200, mass: 1 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Parallax transforms - different speeds for different layers
  const backgroundX = useTransform(smoothX, [-500, 500], [-30, 30]);
  const backgroundY = useTransform(smoothY, [-500, 500], [-30, 30]);

  const midLayerX = useTransform(smoothX, [-500, 500], [-50, 50]);
  const midLayerY = useTransform(smoothY, [-500, 500], [-50, 50]);

  const foregroundX = useTransform(smoothX, [-500, 500], [-10, 10]);
  const foregroundY = useTransform(smoothY, [-500, 500], [-10, 10]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Offset from center
      const x = e.clientX - window.innerWidth / 2;
      const y = e.clientY - window.innerHeight / 2;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const scrollToRanking = () => {
    const element = document.getElementById('ranking-section');
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <motion.div 
      ref={containerRef}
      whileHover={{ scale: 0.995 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative min-h-[440px] md:h-[440px] w-full overflow-hidden rounded-3xl bg-[#0a0a0a] border-2 border-purple-500/50 mb-8 flex items-center justify-center cursor-default group shadow-[0_0_40px_rgba(147,51,234,0.4)] py-12 md:py-0"
    >
      {/* Background Glows (More visible) */}
      <motion.div
        style={{ x: midLayerX, y: midLayerY }}
        className="absolute w-[600px] md:w-[800px] h-[600px] md:h-[800px] bg-primary/20 rounded-full blur-[100px] md:blur-[150px] -top-1/4 md:-top-1/2 -left-1/4 opacity-50 z-[1]"
      />
      <motion.div
        style={{ x: midLayerX, y: midLayerY, rotate: 180 }}
        className="absolute w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-purple-600/10 rounded-full blur-[80px] md:blur-[120px] -bottom-1/4 -right-1/4 opacity-30 z-[1]"
      />

      {/* Video Background Layer */}
      <motion.div 
        style={{ x: backgroundX, y: backgroundY }}
        className="absolute inset-0 z-[2] pointer-events-none overflow-hidden"
      >
        <video
          autoPlay
          muted={true}
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-100 brightness-110"
          style={{ minWidth: "100%", minHeight: "100%" }}
        >
          <source src="/0311.mp4" type="video/mp4" />
          Seu navegador não suporta vídeos.
        </video>
        {/* Darkening Overlay for text readability */}
        <div className="absolute inset-0 bg-black/50 md:bg-black/40 z-10" />
      </motion.div>

      {/* Grid Pattern (Overlaying video) */}
      <div className="absolute inset-0 opacity-10 md:opacity-20 pointer-events-none z-[3]" style={{ 
        backgroundImage: 'linear-gradient(to right, #ffffff05 1px, transparent 1px), linear-gradient(to bottom, #ffffff05 1px, transparent 1px)',
        backgroundSize: '30px 30px'
      }} />

      {/* Dynamic Carbon Pattern (Subtle overlay) */}
      <motion.div 
        style={{ x: foregroundX, y: foregroundY }}
        className="absolute inset-0 opacity-5 md:opacity-10 pointer-events-none z-[3]"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] scale-[1.2]" />
      </motion.div>

      {/* Main Content */}
      <motion.div 
        style={{ x: foregroundX, y: foregroundY }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20 text-center px-4 md:px-6"
      >
        <div className="inline-block px-4 py-1.5 rounded-full bg-primary/20 border border-primary/40 text-[10px] md:text-[11px] font-black tracking-[0.2em] md:tracking-[0.3em] text-primary uppercase mb-4 md:mb-6 shadow-[0_0_20px_rgba(var(--primary),0.2)]">
          Sua barbearia no seu bolso
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black italic tracking-tighter text-white uppercase leading-[1] md:leading-[0.9] mb-4 md:mb-6 select-none">
          TRANSFORME SEU <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-primary/40 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            ESTILO AGORA.
          </span>
        </h1>
        
        <p className="text-gray-400 max-w-xs md:max-w-md mx-auto text-xs md:text-base font-medium leading-relaxed opacity-80 mb-6 md:mb-8">
          Conecte-se com os melhores profissionais e gerencie seus agendamentos com total praticidade.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center relative z-30">
          <motion.button 
            onClick={scrollToRanking}
            whileHover={{ backgroundColor: "rgba(255, 255, 255, 1)", color: "#000000", scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto px-6 md:px-10 py-3 md:py-4 border-2 border-white/50 text-white font-black italic uppercase text-[10px] md:text-xs tracking-[0.2em] shadow-lg backdrop-blur-md cursor-pointer"
          >
            Explorar Ranking
          </motion.button>
          
          <motion.button 
            onClick={() => router.push('/barber-radar')}
            whileHover={{ backgroundColor: "rgba(255, 255, 255, 1)", color: "#000000", scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto px-6 md:px-10 py-3 md:py-4 border-2 border-white/50 text-white font-black italic uppercase text-[10px] md:text-xs tracking-[0.2em] shadow-lg backdrop-blur-md cursor-pointer"
          >
            Ver Mapa
          </motion.button>
        </div>
      </motion.div>

      {/* Premium Accent Lines (Animated) */}
      <motion.div 
        style={{ x: foregroundX }}
        className="absolute top-0 right-32 w-[2px] h-full bg-gradient-to-b from-transparent via-white/20 to-transparent pointer-events-none z-0" 
      />
      <motion.div 
        style={{ x: midLayerX }}
        className="absolute top-0 right-36 w-[1px] h-full bg-gradient-to-b from-transparent via-white/10 to-transparent pointer-events-none z-0" 
      />
    </motion.div>
  );
};
