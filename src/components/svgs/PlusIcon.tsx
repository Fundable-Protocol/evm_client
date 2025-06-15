import * as React from "react";
import { SVGProps } from "react";
const PlusIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={15}
    fill="none"
    {...props}
  >
    <path
      fill="#AEB9E1"
      fillRule="evenodd"
      d="M15.237 7.48a7.2 7.2 0 1 1-14.4 0 7.2 7.2 0 0 1 14.4 0ZM8.038 3.366c.388 0 .702.314.702.702v2.71h2.708a.702.702 0 1 1 0 1.405H8.74v2.71a.702.702 0 1 1-1.404 0v-2.71H4.623a.702.702 0 0 1 0-1.404h2.713V4.068c0-.388.315-.702.702-.702Z"
      clipRule="evenodd"
    />
  </svg>
);
export default PlusIcon;
