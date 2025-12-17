import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface TiltCardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export function TiltCard({ children, className, onClick }: TiltCardProps) {
    const ref = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            style={{
                rotateY,
                rotateX,
                transformStyle: "preserve-3d",
            }}
            className={cn("relative transition-all duration-200 ease-linear", className)}
        >
            <div style={{ transform: "translateZ(50px)" }}>
                {children}
            </div>

            {/* Glare Effect */}
            <motion.div
                style={{
                    background: useTransform(
                        mouseXSpring,
                        [-0.5, 0.5],
                        [
                            "linear-gradient(to right, transparent 0%, rgba(255,255,255,0) 100%)",
                            "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.3) 100%)" // very subtle
                        ]
                    ),
                    opacity: useTransform(mouseXSpring, [-0.5, 0.5], [0, 1])
                }}
                className="absolute inset-0 rounded-xl z-20 pointer-events-none mix-blend-overlay"
            />
        </motion.div>
    );
}
