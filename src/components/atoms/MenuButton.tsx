import { RefObject } from "react";
import { motion } from "motion/react";

// A reusable mobile menu toggle component
interface MenuButtonProps {
  onClick: () => void;
  topLineRef: RefObject<SVGRectElement>;
  bottomLineRef: RefObject<SVGRectElement>;
}

const MenuButton = ({
  onClick,
  topLineRef,
  bottomLineRef,
}: MenuButtonProps) => (
  <div
    className="size-11 border border-fundable-deep-purple-lighter rounded-full grid place-content-center bg-fundable-dark md:hidden"
    onClick={onClick}
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <motion.rect
        x="3"
        y="7"
        width="18"
        height="2"
        fill="currentColor"
        style={{ transformOrigin: "12px 8px" }}
        ref={topLineRef}
      />
      <motion.rect
        x="3"
        y="15"
        width="18"
        height="2"
        fill="currentColor"
        style={{ transformOrigin: "12px 16px" }}
        ref={bottomLineRef}
      />
    </svg>
  </div>
);

export default MenuButton;
