import { forwardRef, type HTMLAttributes } from "react";
import { motion, type MotionProps } from "framer-motion";

type PageTransitionProps = HTMLAttributes<HTMLDivElement> &
  MotionProps & { className?: string };

const PageTransition = forwardRef<HTMLDivElement, PageTransitionProps>(
  (
    {
      children,
      className,
      // override ได้ถ้าต้องการ
      initial = { opacity: 0, y: 8 },
      animate = { opacity: 1, y: 0 },
      exit = { opacity: 0, y: -8 },
      transition = { duration: 2 },
      ...rest
    },
    ref,
  ) => {
    const base = "h-full w-full grid overflow-hidden min-h-0 min-w-0";
    return (
      <motion.div
        ref={ref}
        initial={initial}
        animate={animate}
        exit={exit}
        transition={transition}
        className={`${base}${className ? ` ${className}` : ""}`}
        {...rest}
      >
        {children}
      </motion.div>
    );
  },
);

export default PageTransition;
