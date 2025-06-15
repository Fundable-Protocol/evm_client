import * as React from "react";
import { SVGProps } from "react";
const UserIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={13}
    height={15}
    fill="none"
    {...props}
  >
    <path
      fill="#AEB9E1"
      d="M.09 13.039a3.994 3.994 0 0 1 3.995-3.994h4.47a3.994 3.994 0 0 1 3.995 3.994c0 .735-.596 1.33-1.332 1.33H1.423a1.331 1.331 0 0 1-1.331-1.33ZM6.323 8.03a3.55 3.55 0 1 0 0-7.1 3.55 3.55 0 0 0 0 7.1Z"
    />
  </svg>
);
export default UserIcon;
