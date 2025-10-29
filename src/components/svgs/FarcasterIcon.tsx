import * as React from "react"
import { SVGProps } from "react"

const FarcasterIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-12S17.52 2 12 2zm-1 15h-2v-6h2v6zm-1-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm5 7h-2v-2.5c0-1.1-.9-2-2-2s-2 .9-2 2V17h-2v-6h2v1.5c.8-1.1 2.1-1.5 3.5-1.5s2.7.4 3.5 1.5V11h2v6z"/>
  </svg>
)

export default FarcasterIcon
