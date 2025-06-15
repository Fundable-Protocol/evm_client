import * as React from "react";
import { SVGProps } from "react";
const NotificationIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={23}
    height={22}
    fill="none"
    {...props}
  >
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M11.25 5.904v3.052M11.268 1.833a6.103 6.103 0 0 0-6.105 6.105v1.925c0 .623-.257 1.558-.578 2.09l-1.164 1.943c-.715 1.2-.22 2.54 1.1 2.98a21.395 21.395 0 0 0 13.503 0 2.035 2.035 0 0 0 1.1-2.98l-1.165-1.943c-.32-.532-.577-1.476-.577-2.09V7.938c-.01-3.355-2.76-6.105-6.114-6.105Z"
    />
    <path
      stroke="#fff"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M14.306 17.251a3.063 3.063 0 0 1-3.052 3.052 3.058 3.058 0 0 1-2.154-.898 3.058 3.058 0 0 1-.899-2.154"
    />
  </svg>
);
export default NotificationIcon;
