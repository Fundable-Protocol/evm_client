import * as React from "react";
import { SVGProps } from "react";
const LogoutIcon = (props: SVGProps<SVGSVGElement>) => (
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
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="m15.987 13.402 2.346-2.347-2.346-2.347M8.947 11.055h9.322M10.78 18.333c-4.052 0-7.333-2.75-7.333-7.333s3.281-7.333 7.333-7.333"
    />
  </svg>
);
export default LogoutIcon;
