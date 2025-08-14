import * as React from "react";
import { SVGProps } from "react";
const MailIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <path fill="url(#a)" d="M0 0h24v24H0z" transform="matrix(-1 0 0 1 24 0)" />
    <defs>
      <pattern
        id="a"
        width={1}
        height={1}
        patternContentUnits="objectBoundingBox"
      >
        <use xlinkHref="#b" transform="scale(.01111)" />
      </pattern>
      <image
        xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAACpklEQVR4nO3boW8UQRTH8YMSQtJAIEGQYBAYDAqDQoECQXHgkEgMAv6AChIMhpQEEiQKHAoMBgwGg0EgEKRNSAoBUvolk2xNQ3fm5mbevLn7fVST63ZvftmdffN2OpmIiIiIiIiIiIiIiIhIQcBR4C0S8x44PmvYy8Cr6KkW12vgcKkr+yDwvPWIHHoJHMoJdN/IZ0vAk9Yjc+QpcCAny/Dhs9jBwP3WI3TgIbA/clE+Hgs66XYA7rC4VlOn2VjQSRM8cAv4y+LYBm5PUzikBJ1UsgA3gD/Mvy3gZiSLY7tL4dSgg4/AycgJLgM/mV+/gWuRDE4AH3YfOE3QwWfgdOREF4DvzJ9N4FJk7KeAT/87eNqgg6/A2cgJzwHfmB8bwPnImM8AX/b6AzlBFzlxR4pcWLlB79xKF3NvpU4UmypnCTr4lftw6EDKw/9K6sN/1qCzyx3nipezJYLOKuAdq7JAKxX01EtSp6q1HEoHndxkwZ+qTbQaQVf/0hVUvzhqBd1T52/VYrqrGbT3zt+25QO8dtDBO4edvy3rktQi6OLFf6sOXA9Be+n8bc7Sgesl6Nadv42WjTDroFsNuHlrt0XQ1p0/D1NWs6CtOn9uXr+1DLp2mZXSgbtuVVa2DrrWwsHdQslD0KWXwi6X/p6CDh4k7PlbY29rCc2scA4WPWiGzZNLkStyBXgD/BgqmDBVXI0c03RjpseggxdZW2Adv3DwGnSxTd1eXqF5Djqp89fLv4N4D5phdTi6fB5ZxocFiws9BM3w0LubMpUAR4B73jZb9hL0jnXgUagwQv9imH+Xh59Xhs/C77jTW9DdUtBGFLQRBW1EQRtR0EYUtBEFbURBG1HQRhS0EQVtREEbUdBGFLSRWB9dREREREREREREREREJiP+AdaLJhJfih3lAAAAAElFTkSuQmCC"
        id="b"
        width={90}
        height={90}
        preserveAspectRatio="none"
      />
    </defs>
  </svg>
);
export default MailIcon;
