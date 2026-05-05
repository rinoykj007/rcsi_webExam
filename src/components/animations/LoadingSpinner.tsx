import { motion } from "framer-motion";

export const LoadingSpinner = () => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    className="h-10 w-10 rounded-full border-2 border-blue-500 border-t-transparent"
  />
);
