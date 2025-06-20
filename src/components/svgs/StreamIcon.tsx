import * as React from "react";
import { SVGProps } from "react";
const StreamIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M20.167 7.792a5.958 5.958 0 0 1-6.435 5.94 5.966 5.966 0 0 0-5.464-5.464 5.958 5.958 0 1 1 11.898-.477Z"
    />
    <path
      stroke="#E1E1E1"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M13.75 14.208a5.958 5.958 0 1 1-11.916 0 5.958 5.958 0 0 1 11.916 0ZM5.124 1.833H2.75a.92.92 0 0 0-.917.917v2.374c0 .816.99 1.228 1.568.651l2.374-2.374c.568-.578.165-1.568-.65-1.568ZM16.876 20.167h2.374a.92.92 0 0 0 .917-.917v-2.374c0-.816-.99-1.229-1.568-.651l-2.374 2.374c-.568.578-.165 1.568.65 1.568Z"
    />
  </svg>
);
export default StreamIcon;
