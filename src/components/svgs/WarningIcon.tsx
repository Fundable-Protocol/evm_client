import * as React from "react";
import { SVGProps } from "react";
const WarningIcon = (props: SVGProps<SVGSVGElement>) => (
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
        <use xlinkHref="#b" transform="scale(.01111)" />
      </pattern>
      <image
        xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAAD7ElEQVR4nO3db2hXVRzH8aP5h/yTNEUnUsxUQhIEYQ8CBTF64AN7MApm1BMVCrcoFNInpRMsQVEfyAIDfeSkjfJJ1pNKpOYwYguC/lAuKXQobmk1/2ZvOXZLmfudvOeec8+5935fcJ/sx873fD9s+93fPefeKSWEEEIIIYQQwh4wAVgHfAFcSI7PgTX6tQxDi38B04EeavsKmPnfN4j0gHFAryHku8N+wKKE0IBW7l/r7W8S6QB1yd/i+zUEzEhZRgDvkF67JJcC8ARwwyLov4DFaWpVGnAMe/q0b0zoHqIHPEd2z4buI2rAg8DPDoL+BZgUup9oAW/izhuh+4kSMAf402HQl4FHQ/cVHaAD9w6F7isqwJPA3x6C1mMuC91fFICxwJf4o6+VjFVVxz+XP31bq6oMmAqczSHoc8A0VVXALvKzU1URMB+4mmPQ14DHVdUAR8nfh6pKgKcJZ6WqAmA88H3AoH8EJqqyAzYS3gZVZsBM4LfQKQOXgHpVVsC7xGO/KiNgCXDTMpT1wMM1Dv2aDT2XJapsgOPYe8kw7ssZxu0u1bIXsJpsXjWM/VrGsZtViZanTmcMY5Nh/M0Zx/4VmKyKDmgjuy2G8bc6GH+rKjLgEWDYQRBvGWq87WjZq0EVFdCJG7sNNfY4qvGeKiJgqcPlqXbHW8dqWa4KuDylt9K6csBQ66DDOl8XavtvxnPb0XQYah3GrZrn7FFJPq2dd9z8B4Z6RxzXGtR3GajYAXtx7yNDvY891NujYgYsBK57aPwzTztPa9FbhhepWHn66dJOGGqabiTK4hMVI+AZ/Ok11O3zWHeVivA+wB88NvytofZ3Huv+FNWyl77og1/9htou9lObvK5iAMwCLnpu9qyh/oDn2r8Ds/NN1f8ns1qGDPXzWIM8mG+q9zbZmGF5Kg19yrijxuHjdHIk3WNjqJDHJHdAVUVPkGUv4EWq54W8Q54CnKF6BoCH8gx6O9W1Pa+QHwOuUF3XgAV5BP1+oAaHk6WxtuTodLQe6fSyrauQVwRq7LT+TRplPvOSu2RDeMrn02C+CdTUasO8ng80J53FOB9BtxDOXMO8ZgecV0vop8G41mCYW33AeellrzqXQe8jrGaP+/qy2ucq5EWWT4Nx/WY4r8adXaHeDN0ue+klHeJwGegCtiVHV/K1GHyaNeSm0B0USJNtyBOBU6FnXyD9VsteOd0MXzbrbILWD1wV6XTbBK2fjCjSGbQJ+o+URQRcsgn6pCSXWo9N0K+kr1N5rbandz63W5VNn/XT2ZNn0UnY/09nNMcq5BH76lqT5XZ5g7xDZ3EiyUb+z4AQQgghhBBCCCFUldwCQZFXEIv98UgAAAAASUVORK5CYII="
        id="b"
        width={90}
        height={90}
        preserveAspectRatio="none"
      />
    </defs>
  </svg>
);
export default WarningIcon;
