import * as React from "react";
import { SVGProps } from "react";
const WalletIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M11.917 8.25h-5.5M20.167 10.056v1.888a.941.941 0 0 1-.917.935h-1.797c-.99 0-1.897-.724-1.98-1.714a1.841 1.841 0 0 1 .55-1.494c.34-.349.807-.55 1.32-.55h1.907c.513.018.917.43.917.935Z"
    />
    <path
      stroke="#E1E1E1"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M16.023 9.67a1.841 1.841 0 0 0-.55 1.495c.083.99.99 1.714 1.98 1.714h1.797v1.33c0 2.75-1.833 4.583-4.583 4.583h-8.25c-2.75 0-4.584-1.834-4.584-4.584V7.792c0-2.494 1.504-4.235 3.841-4.529.239-.036.486-.055.743-.055h8.25c.238 0 .467.01.687.046 2.365.275 3.896 2.026 3.896 4.538V9.12h-1.907c-.513 0-.98.201-1.32.55Z"
    />
  </svg>
);
export default WalletIcon;
