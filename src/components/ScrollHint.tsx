import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface ScrollHintProps {
  label?: string;
  targetId?: string;
}

const ScrollHint = ({ label, targetId }: ScrollHintProps) => {
  const handleClick = () => {
    if (targetId) {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="flex flex-col items-center gap-1 py-4 cursor-pointer group"
      onClick={handleClick}
    >
      {label && (
        <span className="text-xs text-muted-foreground/60 uppercase tracking-widest group-hover:text-primary transition-colors">
          {label}
        </span>
      )}
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="h-5 w-5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
      </motion.div>
    </motion.div>
  );
};

export default ScrollHint;
