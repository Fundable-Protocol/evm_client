import * as React from "react";
import { SVGProps } from "react";
const DistributionIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={23}
    fill="none"
    {...props}
  >
    <path
      stroke="#E1E1E1"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M8.25 20.666h5.5c4.582 0 6.416-1.834 6.416-6.417v-5.5c0-4.583-1.834-6.417-6.417-6.417h-5.5c-4.583 0-6.417 1.834-6.417 6.417v5.5c0 4.583 1.834 6.417 6.417 6.417Z"
    />
    <path
      stroke="#E1E1E1"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m6.716 13.782 2.182-2.833a.92.92 0 0 1 1.292-.165l1.678 1.32a.927.927 0 0 0 1.292-.156l2.118-2.731"
    />
  </svg>
);
export default DistributionIcon;
