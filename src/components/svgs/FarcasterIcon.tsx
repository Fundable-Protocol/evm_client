import * as React from "react"
import { SVGProps } from "react"
const FarcasterIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <path fill="url(#a)" d="M0 0h24v24H0z" />
    <defs>
      <pattern
        id="a"
        width={1}
        height={1}
        patternContentUnits="objectBoundingBox"
      >
        <use xlinkHref="#b" transform="scale(.01)" />
      </pattern>
      <image
        xlinkHref="data:image/png;base64,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"
        id="b"
        width={100}
        height={100}
        preserveAspectRatio="none"
      />
    </defs>
  </svg>
    
)
export default FarcasterIcon
