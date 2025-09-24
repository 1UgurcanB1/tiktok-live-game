import { forwardRef, type ButtonHTMLAttributes } from "react";
import { motion, type MotionProps } from "framer-motion";

type ButtonMotionProps = ButtonHTMLAttributes<HTMLButtonElement> & MotionProps;

const ButtonMotion = forwardRef<HTMLButtonElement, ButtonMotionProps>(
  (
    {
      children,
      className,
      // default animation
      whileHover = { scale: 1.03 },
      whileTap = { scale: 0.98 },
      ...rest
    },
    ref,
  ) => {
    return (
      <motion.button
        ref={ref}
        className={["cursor-pointer", className].filter(Boolean).join(" ")}
        whileHover={whileHover}
        whileTap={whileTap}
        {...rest}
      >
        {children}
      </motion.button>
    );
  },
);

export default ButtonMotion;
