import * as React from "react";
import { SVGProps } from "react";
const PercentageIncreaseIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={8}
    height={8}
    fill="none"
    {...props}
  >
    <path
      stroke="#14CA74"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={0.96}
      d="m.695 7.383 6.4-6.4M7.095 7.016V.983H1.06"
    />
  </svg>
);
export default PercentageIncreaseIcon;
