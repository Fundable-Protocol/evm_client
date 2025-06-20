import * as React from "react";
import { SVGProps } from "react";
const ArrowsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={14}
    height={15}
    fill="none"
    {...props}
  >
    <path
      fill="#fff"
      fillRule="evenodd"
      d="M9.063 1.5c0-.31.251-.563.562-.563H13c.31 0 .563.252.563.563v3.375a.562.562 0 1 1-1.126 0V2.858l-3.54 3.54a.563.563 0 0 1-.795-.796l3.54-3.54H9.625a.563.563 0 0 1-.563-.562ZM5.897 8.602c.22.22.22.576 0 .796l-3.54 3.54h2.017a.562.562 0 1 1 0 1.124H1a.563.563 0 0 1-.563-.562v-3.375a.563.563 0 0 1 1.125 0v2.017l3.54-3.54c.22-.22.576-.22.796 0Z"
      clipRule="evenodd"
    />
  </svg>
);
export default ArrowsIcon;
