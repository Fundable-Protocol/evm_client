import * as React from "react";
import { SVGProps } from "react";
const BookIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M20.167 15.345V4.281c0-1.1-.899-1.916-1.99-1.824h-.055c-1.924.165-4.849 1.146-6.48 2.172l-.156.101c-.266.165-.706.165-.972 0l-.229-.138C8.653 3.576 5.738 2.604 3.813 2.449a1.803 1.803 0 0 0-1.98 1.824v11.073c0 .88.715 1.705 1.595 1.815l.266.037c1.99.265 5.06 1.274 6.82 2.236l.037.019c.247.137.642.137.88 0 1.76-.972 4.84-1.99 6.838-2.255l.303-.037c.88-.11 1.595-.935 1.595-1.815ZM11 5.032v13.75M7.104 7.782H5.042M7.792 10.533h-2.75"
    />
  </svg>
);
export default BookIcon;
