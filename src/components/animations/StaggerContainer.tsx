import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StaggerContainerProps {
  children: ReactNode;
  staggerDelay?: number;
  delay?: number;
}

interface StaggerItemProps {
  children: ReactNode;
  index?: number;
}

export const StaggerContainer = ({
  children,
  staggerDelay = 0.1,
  delay = 0
}: StaggerContainerProps) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{
      visible: {
        transition: {
          staggerChildren: staggerDelay,
          delayChildren: delay,
        },
      },
    }}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({ children, index = 0 }: StaggerItemProps) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" },
      },
    }}
  >
    {children}
  </motion.div>
);
