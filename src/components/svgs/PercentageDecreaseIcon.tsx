import * as React from "react";
import { SVGProps } from "react";
const PercentageDecreaseIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={8}
    height={8}
    fill="none"
    {...props}
  >
    <path
      stroke="#FF5A65"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={0.96}
      d="m.764.983 6.4 6.4M1.13 7.383h6.034V1.349"
    />
  </svg>
);
export default PercentageDecreaseIcon;
