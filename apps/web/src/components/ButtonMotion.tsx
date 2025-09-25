import { type ButtonHTMLAttributes, forwardRef } from "react";
import { type MotionProps, motion } from "framer-motion";

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
  ) => (
    <motion.button
      ref={ref}
      className={["cursor-pointer", className].filter(Boolean).join(" ")}
      whileHover={whileHover}
      whileTap={whileTap}
      {...rest}
    >
      {children}
    </motion.button>
  ),
);

export default ButtonMotion;
