import * as React from "react";
import { SVGProps } from "react";
const TrashICon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={17}
    height={19}
    fill="none"
    {...props}
  >
    <path
      stroke="#B3B3B3"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M1 4.505h1.667m0 0H16m-13.333 0v11.667a1.667 1.667 0 0 0 1.666 1.666h8.334a1.667 1.667 0 0 0 1.666-1.666V4.505m-9.166 0V2.838a1.667 1.667 0 0 1 1.666-1.666h3.334a1.667 1.667 0 0 1 1.666 1.666v1.667m-5 4.167v5m3.334-5v5"
    />
  </svg>
);
export default TrashICon;
