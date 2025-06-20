import * as React from "react";
import { SVGProps } from "react";
const ArrowRightIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={14}
    fill="none"
    {...props}
  >
    <path
      stroke="#E1E4EA"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.624}
      d="m9.414 1.457 5.538 5.538m0 0-5.538 5.54m5.538-5.54H1.66"
    />
  </svg>
);
export default ArrowRightIcon;
