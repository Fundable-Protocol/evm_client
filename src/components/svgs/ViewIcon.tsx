import * as React from "react";
import { SVGProps } from "react";
const ViewIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={17}
    height={12}
    fill="none"
    {...props}
  >
    <path
      fill="#AEB9E1"
      fillRule="evenodd"
      d="M.329 5.387C1.082 4.059 3.616.38 8.603.38c4.987 0 7.522 3.678 8.275 5.006a.946.946 0 0 1 0 .942c-.753 1.328-3.288 5.006-8.275 5.006S1.082 7.657.33 6.329a.946.946 0 0 1 0-.942Zm11.319.471a3.043 3.043 0 1 1-6.086 0 3.043 3.043 0 0 1 6.086 0Z"
      clipRule="evenodd"
    />
  </svg>
);
export default ViewIcon;
