import { motion } from "framer-motion";

export function AliveBackground() {
    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-background">
            {/* Mesh Gradient Blob 1 */}
            <motion.div
                animate={{
                    x: [0, 100, 0],
                    y: [0, -50, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/10 blur-[100px]"
            />

            {/* Mesh Gradient Blob 2 */}
            <motion.div
                animate={{
                    x: [0, -100, 0],
                    y: [0, 100, 0],
                    scale: [1, 1.5, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                }}
                className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-purple-500/10 blur-[120px]"
            />

            {/* Mesh Gradient Blob 3 */}
            <motion.div
                animate={{
                    x: [0, 50, -50, 0],
                    y: [0, 50, 0],
                }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 5,
                }}
                className="absolute top-[40%] left-[40%] w-[40vw] h-[40vw] rounded-full bg-blue-500/5 blur-[90px]"
            />
        </div>
    );
}
