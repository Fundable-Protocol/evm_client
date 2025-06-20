import {
  isInArgentMobileAppBrowser,
  ArgentMobileConnector,
} from "starknetkit/argentMobile";
import {
  BraavosMobileConnector,
  isInBraavosMobileAppBrowser,
} from "starknetkit/braavosMobile";

import { InjectedConnector } from "starknetkit/injected";
import { WebWalletConnector } from "starknetkit/webwallet";

import { constants } from "starknet";
import { StarknetkitConnector } from "starknetkit";
import { projectId } from "./constant";

export const getAvailableConnectors = () => {
  const argentMobile = ArgentMobileConnector.init({
    options: {
      dappName: "Fundable",
      url:
        typeof window !== "undefined"
          ? window.location.href
          : "staging.fundable.finance",
      chainId: constants.NetworkName.SN_MAIN,
      projectId: projectId,
      description: "Your web3 automated payment processor",
    },
  }) as StarknetkitConnector;

  const connectorOptions = [
    { id: "braavos", name: "Braavos" },
    { id: "argentX", name: "Argent X" },
    { id: "keplr", name: "Keplr" },
    { id: "metamask", name: "MetaMask" },
    { id: "okxwallet", name: "OKX" },
    { id: "fordefi", name: "Fordefi" },
  ].map((connector) => new InjectedConnector({ options: connector }));

  switch (true) {
    case isInArgentMobileAppBrowser():
      return [argentMobile];

    case isInBraavosMobileAppBrowser():
      return [BraavosMobileConnector.init({}), argentMobile];

    default:
      return [
        ...connectorOptions,
        new WebWalletConnector({ url: "https://web.argent.xyz" }),
        argentMobile,
      ];
  }
};
