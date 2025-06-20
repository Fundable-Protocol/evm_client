import * as React from "react";
import { SVGProps } from "react";
const EyeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={22}
    fill="none"
    {...props}
  >
    <path
      stroke="#E1E1E1"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M14.282 11A3.278 3.278 0 0 1 11 14.282 3.278 3.278 0 0 1 7.718 11 3.278 3.278 0 0 1 11 7.718 3.278 3.278 0 0 1 14.282 11Z"
    />
    <path
      stroke="#E1E1E1"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M11 18.58c3.236 0 6.252-1.906 8.35-5.206.826-1.292.826-3.465 0-4.757-2.098-3.3-5.114-5.207-8.35-5.207-3.236 0-6.252 1.907-8.35 5.207-.826 1.292-.826 3.465 0 4.757 2.098 3.3 5.114 5.207 8.35 5.207Z"
    />
  </svg>
);
export default EyeIcon;
