import { useState, useEffect } from "react";
import { useAnimate } from "motion/react";

interface UseMenuAnimationReturn {
  isOpen: boolean;
  toggleMenu: () => void;
  navScope: React.RefObject<HTMLDivElement>;
  topLineScope: React.RefObject<SVGRectElement>;
  bottomLineScope: React.RefObject<SVGRectElement>;
}

const useMenuAnimation = (): UseMenuAnimationReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [navScope, navAnimate] = useAnimate<HTMLDivElement>();
  const [topLineScope, topLineAnimate] = useAnimate<SVGRectElement>();
  const [bottomLineScope, bottomLineAnimate] = useAnimate<SVGRectElement>();

  useEffect(() => {
    const animationDuration = { duration: 0.3 };
    if (isOpen) {
      // Animate the menu button to an "X"
      topLineAnimate([
        [topLineScope.current, { translateY: 4 }, animationDuration],
        [topLineScope.current, { rotate: 45 }, animationDuration],
      ]);
      bottomLineAnimate([
        [bottomLineScope.current, { translateY: -4 }, animationDuration],
        [bottomLineScope.current, { rotate: -45 }, animationDuration],
      ]);
      // Expand the mobile menu overlay
      navAnimate(navScope.current, { height: "100%" }, animationDuration);
    } else {
      // Reset the menu button
      topLineAnimate([
        [topLineScope.current, { translateY: 0 }, animationDuration],
        [topLineScope.current, { rotate: 0 }, animationDuration],
      ]);
      bottomLineAnimate([
        [bottomLineScope.current, { translateY: 0 }, animationDuration],
        [bottomLineScope.current, { rotate: 0 }, animationDuration],
      ]);
      // Collapse the mobile menu overlay
      navAnimate(navScope.current, { height: 0 }, animationDuration);
    }
  }, [
    isOpen,
    navAnimate,
    topLineAnimate,
    bottomLineAnimate,
    navScope,
    topLineScope,
    bottomLineScope,
  ]);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  return { isOpen, toggleMenu, navScope, topLineScope, bottomLineScope };
};

export default useMenuAnimation;
