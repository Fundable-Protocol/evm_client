import * as React from "react";
import { SVGProps } from "react";
const DashboardIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={23}
    fill="none"
    {...props}
  >
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M16.08 8.116a2.255 2.255 0 1 0 0-4.51 2.255 2.255 0 0 0 0 4.51ZM5.925 8.116a2.255 2.255 0 1 0 0-4.51 2.255 2.255 0 0 0 0 4.51ZM16.08 19.393a2.255 2.255 0 1 0 0-4.51 2.255 2.255 0 0 0 0 4.51ZM5.925 19.393a2.255 2.255 0 1 0 0-4.51 2.255 2.255 0 0 0 0 4.51Z"
    />
  </svg>
);
export default DashboardIcon;
