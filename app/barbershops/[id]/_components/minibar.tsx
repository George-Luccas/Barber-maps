import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Beer, X, CupSoda } from "lucide-react"; // Changed icons
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BarbershopProduct } from "@prisma/client";

interface MinibarProps {
  products: BarbershopProduct[];
}

const Minibar = ({ products }: MinibarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!products || products.length === 0) return null;

  return (
    <>
      {/* Trigger Button - Floating 'Tab' on the right */}
      {!isOpen && (
        <motion.div
            initial={{ x: 100 }}
            animate={{ x: 0 }}
            className="fixed right-0 top-1/2 -translate-y-1/2 z-40"
        >
            <div 
                onClick={() => setIsOpen(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground 
                           cursor-pointer py-4 px-1 rounded-l-lg shadow-lg border-y border-l border-primary/20
                           flex flex-col items-center gap-2 writing-mode-vertical-rl"
                style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
            >
                <div className="rotate-180 flex items-center gap-2">
                    <Beer size={18} /> {/* Icon changed to Beer */}
                    <span className="font-bold text-sm tracking-wide">FRIGOBAR</span>
                </div>
            </div>
        </motion.div>
      )}

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Drawer / "Door" */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%", rotateY: -90 }}
            animate={{ x: 0, rotateY: 0 }}
            exit={{ x: "100%", rotateY: -90 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-[85%] max-w-[400px] bg-background border-l z-50 shadow-2xl flex flex-col"
            style={{ transformOrigin: "right center" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b">
                <div className="flex items-center gap-2">
                    <Beer className="text-primary" /> {/* Icon changed to Beer */}
                    <h2 className="text-xl font-bold uppercase">Frigobar</h2>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X size={20} />
                </Button>
            </div>

            {/* Content - Products List */}
            <div className="flex-1 overflow-y-auto p-5 scrollbar-hide">
                <div className="grid grid-cols-2 gap-4">
                    {products.map((product) => (
                        <Card key={product.id} className="overflow-hidden border-primary/10 hover:border-primary/50 transition-colors group">
                            <CardContent className="p-0">
                                <div className="relative h-[120px] w-full bg-secondary/50 flex items-center justify-center">
                                    {product.imageUrl ? (
                                        <Image 
                                            src={product.imageUrl} 
                                            alt={product.name} 
                                            fill 
                                            className="object-cover group-hover:scale-110 transition-transform duration-300" 
                                        />
                                    ) : (
                                        <CupSoda className="text-muted-foreground/50 size-10" /> // Fallback icon changed
                                    )}
                                </div>
                                <div className="p-3">
                                    <h3 className="font-bold text-sm truncate">{product.name}</h3>
                                    <p className="text-xs text-muted-foreground truncate mb-2">{product.description}</p>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="font-bold text-primary">
                                            {Intl.NumberFormat("pt-BR", {
                                                style: "currency",
                                                currency: "BRL",
                                            }).format(Number(product.priceInCents) / 100)}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                
                {products.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
                        <Beer size={40} className="opacity-20" /> {/* Empty state icon */}
                        <p>O frigobar está vazio hoje.</p>
                    </div>
                )}
            </div>

             {/* Footer hint */}
             <div className="p-4 bg-secondary/20 text-center text-xs text-muted-foreground">
                <p>Peça ao seu barbeiro para retirar o item.</p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Minibar;
